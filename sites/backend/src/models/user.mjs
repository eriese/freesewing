import jwt from 'jsonwebtoken'
import { log } from '../utils/log.mjs'
import { hash, hashPassword, randomString, verifyPassword } from '../utils/crypto.mjs'
import { clean, asJson, i18nUrl } from '../utils/index.mjs'
import { ConfirmationModel } from './confirmation.mjs'

export function UserModel(tools) {
  this.config = tools.config
  this.prisma = tools.prisma
  this.decrypt = tools.decrypt
  this.encrypt = tools.encrypt
  this.mailer = tools.email
  this.Confirmation = new ConfirmationModel(tools)
  this.clear = {} // For holding decrypted data

  return this
}

/*
 * Loads a user from the database based on the where clause you pass it
 *
 * Stores result in this.record
 */
UserModel.prototype.read = async function (where) {
  try {
    this.record = await this.prisma.user.findUnique({ where })
  } catch (err) {
    log.warn({ err, where }, 'Could not read user')
  }

  this.reveal()

  return this.setExists()
}

/*
 * Helper method to decrypt at-rest data
 */
UserModel.prototype.reveal = async function (where) {
  this.clear = {}
  if (this.record) {
    this.clear.data = JSON.parse(this.decrypt(this.record.data))
    this.clear.email = this.decrypt(this.record.email)
    this.clear.initial = this.decrypt(this.record.initial)
  }

  return this
}

/*
 * Loads a user from the database based on the where clause you pass it
 * In addition prepares it for returning the account data
 *
 * Stores result in this.record
 */
UserModel.prototype.readAsAccount = async function (where) {
  await this.read(where)

  return this.setResponse(200, false, {
    result: 'success',
    account: this.asAccount(),
  })
}

/*
 * Finds a user based on one of the accepted unique fields which are:
 *   - lusername (lowercase username)
 *   - ehash
 *   - id
 *
 * Stores result in this.record
 */
UserModel.prototype.find = async function (body) {
  try {
    this.record = await this.prisma.user.findFirst({
      where: {
        OR: [
          { lusername: { equals: clean(body.username) } },
          { ehash: { equals: hash(clean(body.username)) } },
          { id: { equals: parseInt(body.username) || -1 } },
        ],
      },
    })
  } catch (err) {
    log.warn({ err, body }, `Error while trying to find user: ${body.username}`)
  }

  this.reveal()

  return this.setExists()
}

/*
 * Loads the user that is making the API request
 *
 * Stores result in this.authenticatedUser
 */
UserModel.prototype.loadAuthenticatedUser = async function (user) {
  if (!user) return this
  this.authenticatedUser = await this.prisma.user.findUnique({
    where: { id: user.uid },
    include: {
      apikeys: true,
    },
  })

  return this
}

/*
 * Checks this.record and sets a boolean to indicate whether
 * the user exists or not
 *
 * Stores result in this.exists
 */
UserModel.prototype.setExists = function () {
  this.exists = this.record ? true : false

  return this
}

/*
 * Creates a user+confirmation and sends out signup email
 */
UserModel.prototype.create = async function ({ body }) {
  if (Object.keys(body) < 1) return this.setResponse(400, 'postBodyMissing')
  if (!body.email) return this.setResponse(400, 'emailMissing')
  if (!body.password) return this.setResponse(400, 'passwordMissing')
  if (!body.language) return this.setResponse(400, 'languageMissing')

  const ehash = hash(clean(body.email))
  await this.read({ ehash })
  if (this.exists) return this.setResponse(400, 'emailExists')

  try {
    this.clear.email = clean(body.email)
    this.clear.initial = this.clear.email
    this.language = body.language
    const email = this.encrypt(this.clear.email)
    const username = clean(randomString()) // Temporary username
    const data = {
      ehash,
      ihash: ehash,
      email,
      initial: email,
      username,
      lusername: username,
      data: this.encrypt(asJson({ settings: { language: this.language } })),
      password: asJson(hashPassword(body.password)),
    }
    this.record = await this.prisma.user.create({ data })
  } catch (err) {
    log.warn(err, 'Could not create user record')
    return this.setResponse(500, 'createAccountFailed')
  }

  // Update username
  try {
    await this.safeUpdate({
      username: `user-${this.record.id}`,
      lusername: `user-${this.record.id}`,
    })
  } catch (err) {
    log.warn(err, 'Could not update username after user creation')
    return this.setResponse(500, 'usernameUpdateAfterUserCreationFailed')
  }

  // Create confirmation
  this.confirmation = await this.Confirmation.create({
    type: 'signup',
    data: {
      language: this.language,
      email: this.clear.email,
      id: this.record.id,
      ehash: ehash,
    },
    userId: this.record.id,
  })

  // Send signup email
  if (!this.isUnitTest(body) || this.config.tests.sendEmail)
    await this.mailer.send({
      template: 'signup',
      language: this.language,
      to: this.clear.email,
      replacements: {
        actionUrl: i18nUrl(this.language, `/confirm/signup/${this.Confirmation.record.id}`),
        whyUrl: i18nUrl(this.language, `/docs/faq/email/why-signup`),
        supportUrl: i18nUrl(this.language, `/patrons/join`),
      },
    })

  return this.isUnitTest(body)
    ? this.setResponse(201, false, {
        email: this.clear.email,
        confirmation: this.confirmation.record.id,
      })
    : this.setResponse(201, false, { email: this.clear.email })
}

/*
 * Login based on username + password
 */
UserModel.prototype.passwordLogin = async function (req) {
  if (Object.keys(req.body) < 1) return this.setReponse(400, 'postBodyMissing')
  if (!req.body.username) return this.setReponse(400, 'usernameMissing')
  if (!req.body.password) return this.setReponse(400, 'passwordMissing')

  await this.find(req.body)
  if (!this.exists) {
    log.warn(`Login attempt for non-existing user: ${req.body.username} from ${req.ip}`)
    return this.setResponse(401, 'loginFailed')
  }

  // Account found, check password
  const [valid, updatedPasswordField] = verifyPassword(req.body.password, this.record.password)
  if (!valid) {
    log.warn(`Wrong password for existing user: ${req.body.username} from ${req.ip}`)
    return this.setResponse(401, 'loginFailed')
  }

  log.info(`Login by user ${this.record.id} (${this.record.username})`)

  // Login success
  if (updatedPasswordField) {
    // Update the password field with a v3 hash
    await this.safeUpdate({ password: updatedPasswordField })
  }

  return this.isOk() ? this.loginOk() : this.setResponse(401, 'loginFailed')
}

/*
 * Confirms a user account
 */
UserModel.prototype.confirm = async function ({ body, params }) {
  if (!params.id) return this.setReponse(404, 'missingConfirmationId')
  if (Object.keys(body) < 1) return this.setResponse(400, 'postBodyMissing')
  if (!body.consent || typeof body.consent !== 'number' || body.consent < 1)
    return this.setResponse(400, 'consentRequired')

  // Retrieve confirmation record
  await this.Confirmation.read({ id: params.id })

  if (!this.Confirmation.exists) {
    log.warn(err, `Could not find confirmation id ${params.id}`)
    return this.setResponse(404, 'failedToFindConfirmationId')
  }

  if (this.Confirmation.record.type !== 'signup') {
    log.warn(err, `Confirmation mismatch; ${params.id} is not a signup id`)
    return this.setResponse(404, 'confirmationIdTypeMismatch')
  }

  if (this.error) return this
  const data = this.Confirmation.clear.data
  if (data.ehash !== this.Confirmation.record.user.ehash)
    return this.setResponse(404, 'confirmationEhashMismatch')
  if (data.id !== this.Confirmation.record.user.id)
    return this.setResponse(404, 'confirmationUserIdMismatch')

  // Load user
  await this.read({ id: this.Confirmation.record.user.id })
  if (this.error) return this

  // Update user status, consent, and last login
  await this.safeUpdate({
    status: 1,
    consent: body.consent,
    lastLogin: new Date(),
  })
  if (this.error) return this

  // Account is now active, let's return a passwordless login
  return this.loginOk()
}

/*
 * Updates the user data - Used when we create the data ourselves
 * so we know it's safe
 */
UserModel.prototype.safeUpdate = async function (data) {
  try {
    this.record = await this.prisma.user.update({
      where: { id: this.record.id },
      data,
    })
  } catch (err) {
    log.warn(err, 'Could not update user record')
    process.exit()
    return this.setResponse(500, 'updateUserFailed')
  }

  return this.setResponse(200)
}

/*
 * Updates the user data - Used when we pass through user-provided data
 * so we can't be certain it's safe
 */
UserModel.prototype.unsafeUpdate = async function (body) {
  const data = {}
  // Update consent
  if ([0, 1, 2, 3].includes(body.consent)) data.consent = body.consent
  // Update newsletter
  if ([true, false].includes(body.newsletter)) data.newsletter = body.newsletter
  // Update username
  if (typeof body.username === 'string') {
    if (await this.isAvailableUsername(body.username)) {
      data.username = body.username.trim()
      data.lusername = clean(body.username)
    }
  }
  // Update password
  if (typeof body.password === 'string') {
    data.password = asJson(hashPassword(body.password))
  }
  // Update data
  if (typeof body.data === 'object') {
    data.data = { ...this.record.data }
  }

  /*
  data          String    @default("{}")
  ehash         String    @unique
  email         String
  */

  try {
    this.record = await this.prisma.user.update({ where, data })
  } catch (err) {
    log.warn(err, 'Could not update user record')
    process.exit()
    return this.setResponse(500, 'updateUserFailed')
  }

  return this.setResponse(200)
}

/*
 * Returns account data
 */
UserModel.prototype.asAccount = function () {
  return {
    id: this.record.id,
    consent: this.record.consent,
    createdAt: this.record.createdAt,
    data: this.clear.data,
    email: this.clear.email,
    initial: this.clear.initial,
    lastLogin: this.record.lastLogin,
    newsletter: this.record.newsletter,
    patron: this.record.patron,
    role: this.record.role,
    status: this.record.status,
    updatedAt: this.record.updatedAt,
    username: this.record.username,
    lusername: this.record.lusername,
  }
}

/*
 * Returns a JSON Web Token (jwt)
 */
UserModel.prototype.getToken = function () {
  return jwt.sign(
    {
      _id: this.record.id,
      username: this.record.username,
      role: this.record.role,
      status: this.record.status,
      aud: this.config.jwt.audience,
      iss: this.config.jwt.issuer,
    },
    this.config.jwt.secretOrKey,
    { expiresIn: this.config.jwt.expiresIn }
  )
}

/*
 * Helper method to set the response code, result, and body
 *
 * Will be used by this.sendResponse()
 */
UserModel.prototype.setResponse = function (status = 200, error = false, data = {}) {
  this.response = {
    status,
    body: {
      result: 'success',
      ...data,
    },
  }
  if (status > 201) {
    this.response.body.error = error
    this.response.body.result = 'error'
    this.error = true
  } else this.error = false

  return this.setExists()
}

/*
 * Helper method to send response
 */
UserModel.prototype.sendResponse = async function (res) {
  return res.status(this.response.status).send(this.response.body)
}

/*
 * Update method to determine whether this request is
 * part of a unit test
 */
UserModel.prototype.isUnitTest = function (body) {
  return body.unittest && this.clear.email.split('@').pop() === this.config.tests.domain
}

/*
 * Helper method to check an account is ok
 */
UserModel.prototype.isOk = function () {
  if (
    this.exists &&
    this.record &&
    this.record.status > 0 &&
    this.record.consent > 0 &&
    this.record.role &&
    this.record.role !== 'blocked'
  )
    return true

  return false
}

/*
 * Helper method to return from successful login
 */
UserModel.prototype.loginOk = function () {
  return this.setResponse(200, false, {
    result: 'success',
    token: this.getToken(),
    account: this.asAccount(),
  })
}
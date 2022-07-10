import path from 'path'
import fs from 'fs'
import glob from 'glob'
import yaml from 'js-yaml'
import chalk from 'chalk'
import mustache from 'mustache'
import { capitalize } from '../sites/shared/utils.mjs'
import conf from '../lerna.json'
const { version } = conf
import {
  publishedSoftware as software,
  publishedTypes as types
} from '../config/software/index.mjs'
import { buildOrder } from '../config/build-order.mjs'
import rootPackageJson from '../package.json'

// Working directory
const cwd = process.cwd()

/*
 * This object holds info about the repository
 */
const repo = {
  path: cwd,
  defaults: readConfigFile('defaults.yaml'),
  keywords: readConfigFile('keywords.yaml'),
  badges: readConfigFile('badges.yaml'),
  scripts: readConfigFile('scripts.yaml'),
  changelog: readConfigFile('changelog.yaml'),
  changetypes: ['Added', 'Changed', 'Deprecated', 'Removed', 'Fixed', 'Security'],
  dependencies: readConfigFile('dependencies.yaml', { version }),
  exceptions: readConfigFile('exceptions.yaml'),
  templates: {
    pkg: readTemplateFile('package.dflt.json'),
    changelog: readTemplateFile('changelog.dflt.md'),
    readme: readTemplateFile('readme.dflt.md'),
    build: readTemplateFile('build.dflt.js'),
  },
  dirs: foldersByType(),
  contributors: fs.readFileSync(path.join(cwd, 'CONTRIBUTORS.md'), 'utf-8'),
  ac: JSON.parse(fs.readFileSync(path.join(cwd, '.all-contributorsrc'), 'utf-8')),
}

/*
 * Now let's get to work
 */
const log = process.stdout

// Step 1: Generate main README file from template
log.write(chalk.blueBright('Generating out main README file...'))
fs.writeFileSync(
  path.join(repo.path, 'README.md'),
  mustache.render(
    fs.readFileSync(path.join(repo.path, 'config', 'templates', 'readme.main.md'), 'utf-8'),
    { allcontributors: repo.ac.contributors.length }
  ) + repo.contributors
)
log.write(chalk.green(" Done\n"))

// Step 2: Validate package configuration
log.write(chalk.blueBright('Validating configuration...'))
if (validate()) log.write(chalk.green(" Done\n"))


// Step 3: Generate package.json, README, and CHANGELOG
log.write(chalk.blueBright('Generating package-specific files...'))
for (const pkg of Object.values(software)) {
  fs.writeFileSync(
    path.join(cwd, pkg.folder, pkg.name, 'package.json'),
    JSON.stringify(packageJson(pkg), null, 2) + '\n'
  )
  fs.writeFileSync(
    path.join(cwd, pkg.folder, pkg.name, 'README.md'),
    readme(pkg)
  )
  if (repo.exceptions.customBuild.indexOf(pkg.name) === -1) {
    fs.writeFileSync(
      path.join(cwd, pkg.folder, pkg.name, 'build.js'),
      repo.templates.build
    )
  }
  fs.writeFileSync(
    path.join(cwd, pkg.folder, pkg.name, 'CHANGELOG.md'),
    changelog(pkg, repo)
  )
}
log.write(chalk.green(" Done\n"))

// Step 3: Generate overall CHANGELOG.md
fs.writeFileSync(
  path.join(repo.path, 'CHANGELOG.md'),
  changelog('global', repo)
)

// Step 6: Generate build script for published software
log.write(chalk.blueBright('Generating buildall node script...'))
const buildSteps = buildOrder.map((step, i) => `lerna run cibuild_step${i}`);
const buildAllCommand = buildSteps.join(' && ');
const newRootPkgJson = {...rootPackageJson};
newRootPkgJson.scripts.buildall = buildAllCommand;
fs.writeFileSync(
  path.join(repo.path, 'package.json'),
  JSON.stringify(newRootPkgJson, null, 2) + '\n'
)
log.write(chalk.green(" Done\n"))

// Step 7: Generate tests for designs and plugins



// All done
log.write(chalk.green(" All done\n"))
process.exit()

/*
 * Generates a list of folders by type
 */
function foldersByType() {
  const dirs = {}
  for (const dir of types) {
    dirs[dir] = glob.sync('*', { cwd: path.join(cwd, dir) })
  }

  return dirs
}

/**
 * Reads a template file
 */
function readTemplateFile(file) {
  return fs.readFileSync(path.join(cwd, 'config', 'templates', file), 'utf-8')
}

/**
 * Reads a YAML config file, with mustache replacements if needed
 */
function readConfigFile(file, replace = false) {
  if (replace)
    return yaml.load(
      mustache.render(fs.readFileSync(path.join(cwd, 'config', file), 'utf-8'), replace)
    )
  return yaml.load(fs.readFileSync(path.join(cwd, 'config', file), 'utf-8'))
}

/**
 * Reads info.md from the package directory
 * Returns its contents if it exists, or an empty string if not
 */
function readInfoFile(pkg) {
  let markup = ''
  try {
    markup = fs.readFileSync(path.join(cwd, pkg.folder, pkg.name, 'info.md'), 'utf-8')
  } catch (err) {
    return ''
  }

  return markup
}

/**
 * Returns an array of keywords for a package
 */
function keywords(pkg) {
  if (typeof repo.keywords[pkg.name] !== 'undefined') return repo.keywords[pkg.name]
  if (typeof repo.keywords[pkg.type] !== 'undefined') return repo.keywords[pkg.type]
  else {
    console.log(
      chalk.redBright.bold('Problem:'),
      chalk.redBright(`No keywords for package ${pkg.name} which is of type ${pkg.type}`)
    )
    process.exit()
  }
}

/**
 * Returns an plain object of scripts for a package
 */
function scripts(pkg) {
  let runScripts = {}
  for (const key of Object.keys(repo.scripts._)) {
    runScripts[key] = mustache.render(repo.scripts._[key], {
      name: pkg.name
    })
  }
  if (typeof repo.scripts._types[pkg.type] !== 'undefined') {
    for (const key of Object.keys(repo.scripts._types[pkg.type])) {
      runScripts[key] = mustache.render(repo.scripts._types[pkg.type][key], {
        name: pkg.name
      })
    }
  }
  if (typeof repo.scripts[pkg.name] !== 'undefined') {
    for (const key of Object.keys(repo.scripts[pkg.name])) {
      if (repo.scripts[pkg.name][key] === '!') delete runScripts[key]
      else
        runScripts[key] = mustache.render(repo.scripts[pkg.name][key], {
          name: pkg.name
        })
    }
  }

  // Enforce build order by generating the cibuild_stepX scrips
  let i = 0
  for (const step in buildOrder) {
    if (buildOrder[step].indexOf(pkg.name) !== -1) {
      if (runScripts.build) runScripts[`cibuild_step${step}`] = runScripts.build
    }
  }

  return runScripts
}

/**
 * Returns an plain object with the of dependencies for a package
 * section is the key in the dependencies.yaml fine, one of:
 *
 *  - _ (for dependencies)
 *  - dev (for devDependencies)
 *  - peer (for peerDependencies)
 *
 */
function dependencies(section, pkg) {
  let dependencies = {}
  if (
    typeof repo.dependencies._types[pkg.type] !== 'undefined' &&
    typeof repo.dependencies._types[pkg.type][section] !== 'undefined'
  )
    dependencies = repo.dependencies._types[pkg.type][section]
  if (typeof repo.dependencies[pkg.name] === 'undefined') return dependencies
  if (typeof repo.dependencies[pkg.name][section] !== 'undefined')
    return { ...dependencies, ...repo.dependencies[pkg.name][section] }

  return dependencies
}

/**
 * Creates a package.json file for a package
 */
function packageJson(pkg) {
  let pkgConf = {}
  // Let's keep these at the top
  pkgConf.name = fullName(pkg.name)
  pkgConf.version = version
  pkgConf.description = pkg.description
  pkgConf = {
    ...pkgConf,
    ...JSON.parse(mustache.render(repo.templates.pkg, { name: pkg.name }))
  }
  pkgConf.keywords = pkgConf.keywords.concat(keywords(pkg))
  pkgConf.scripts = scripts(pkg)
  if (repo.exceptions.skipTests.indexOf(pkg.name) !== -1) {
    pkgConf.scripts.test = `echo "skipping tests for ${pkg.name}"`
    pkgConf.scripts.testci = `echo "skipping tests for ${pkg.name}"`
  }
  pkgConf.dependencies = dependencies('_', pkg)
  pkgConf.devDependencies = dependencies('dev', pkg)
  pkgConf.peerDependencies = dependencies('peer', pkg)
  if (typeof repo.exceptions.packageJson[pkg.name] !== 'undefined') {
    pkgConf = {
      ...pkgConf,
      ...repo.exceptions.packageJson[pkg.name]
    }
    for (let key of Object.keys(repo.exceptions.packageJson[pkg.name])) {
      if (repo.exceptions.packageJson[pkg.name][key] === '!') delete pkgConf[key]
    }
  }

  return pkgConf
}

/**
 * Returns an string with the markup for badges in the readme file
 */
function badges(pkgName) {
  let markup = ''
  for (let group of ['_all', '_social']) {
    markup += "<p align='center'>"
    for (let key of Object.keys(repo.badges[group])) {
      const name = (key === 'contributors')
        ? repo.ac.contributors.length
        : pkgName
      markup += formatBadge(repo.badges[group][key], name, fullName(pkgName))
    }
    markup += '</p>'
  }

  return markup
}

/**
 * Formats a badge for a readme file
 */
function formatBadge(badge, name, fullname) {
  return `<a
  href="${mustache.render(badge.link, { name, fullname })}"
  title="${mustache.render(badge.alt, { name, fullname })}"
  ><img src="${mustache.render(badge.img, { name, fullname })}"
  alt="${mustache.render(badge.alt, { name, fullname })}"/>
  </a>`
}
/**
 * Returns the full (namespaced) name of a package
 */
function fullName(name) {
  if (repo.exceptions.noNamespace.indexOf(name) !== -1) return name
  else return `@freesewing/${name}`
}

/**
 * Creates a README.md file for a package
 */
function readme(pkg) {
  let markup = mustache.render(repo.templates.readme, {
    fullname: fullName(pkg.name),
    description: pkg.description,
    badges: badges(pkg.name),
    info: readInfoFile(pkg),
    contributors: repo.contributors
  })

  return markup
}

/**
 * Creates a CHANGELOG.md file for a package
 */
function changelog(pkg) {
  let markup = mustache.render(repo.templates.changelog, {
    fullname: pkg === 'global' ? 'FreeSewing (global)' : fullName(pkg.name),
    changelog: pkg === 'global' ? globalChangelog() : packageChangelog(pkg.name)
  })

  return markup
}

/**
 * Generates the global changelog data
 */
function globalChangelog() {
  let markup = ''
  for (let v in repo.changelog) {
    let changes = repo.changelog[v]
    markup += '\n## ' + v
    if (v !== 'Unreleased') markup += ' (' + formatDate(changes.date) + ')'
    markup += '\n\n'
    for (let pkg in software) {
      let changed = false
      for (let type of repo.changetypes) {
        if (
          typeof changes[type] !== 'undefined' &&
          changes[type] !== null &&
          typeof changes[type][pkg] !== 'undefined' &&
          changes[type][pkg] !== null
        ) {
          if (!changed) changed = ''
          changed += '\n#### ' + type + '\n\n'
          for (let change of changes[type][pkg]) changed += ' - ' + change + '\n'
        }
      }
      if (changed) markup += '### ' + pkg + '\n' + changed + '\n'
    }
  }

  return markup
}

/**
 * Generates the changelog data for a package
 */
function packageChangelog(pkgName) {
  let log = {}
  let version
  let markup = ''
  for (let v in repo.changelog) {
    version = v
    let changes = repo.changelog[v]
    let changed = false
    for (let type of repo.changetypes) {
      if (
        typeof changes[type] !== 'undefined' &&
        changes[type] !== null &&
        typeof changes[type][pkgName] !== 'undefined' &&
        changes[type][pkgName] !== null
      ) {
        if (!changed) changed = ''
        changed += '\n### ' + type + '\n\n'
        for (let change of changes[type][pkgName]) changed += ' - ' + change + '\n'
      }
    }
    if (v !== 'Unreleased' && changed) {
      markup += '\n## ' + v
      markup += ' (' + formatDate(changes.date) + ')'
      markup += '\n'
      markup += changed
    }
  }

  markup += '\n\nThis is the **initial release**, and the start of this change log.\n'
  if (version === '2.0.0')
    markup += `
> Prior to version 2, FreeSewing was not a JavaScript project.
> As such, that history is out of scope for this change log.
`

  return markup
}

function formatDate(date) {
  let d = new Date(date),
    month = '' + (d.getUTCMonth() + 1),
    day = '' + d.getUTCDate(),
    year = d.getUTCFullYear()

  if (month.length < 2) month = '0' + month
  if (day.length < 2) day = '0' + day

  return [year, month, day].join('-')
}

/**
 * Make sure we have (at least) a description for each package
 */
function validate() {
  for (const type in repo.dirs) {
    for (const dir of repo.dirs[type]) {
      if (typeof software[dir] === 'undefined' || typeof software[dir].description !== 'string') {
        log.write(
          chalk.redBright(` No description for package ${type}/${dir}`+"\n")
        )
        return false
      }
    }
  }

  return true
}

/**
 * Puts a package.json, build.js, README.md, and CHANGELOG.md
 * into every subdirectory under the packages directory.
 * Also adds unit tests for patterns, and writes the global CHANGELOG.md.
 */
function reconfigure(pkgs, repo) {
  for (const pkg of pkgs) {
    console.log(chalk.blueBright(`Reconfiguring ${pkg}`))
    //if (repo.exceptions.customPackageJson.indexOf(pkg) === -1) {
    //  const pkgConfig = packageConfig(pkg, repo)
    //  fs.writeFileSync(
    //    path.join(repo.path, 'packages', pkg, 'package.json'),
    //    JSON.stringify(pkgConfig, null, 2) + '\n'
    //  )
    //}
    //if (repo.exceptions.customBuild.indexOf(pkg) === -1) {
    //  fs.writeFileSync(
    //    path.join(repo.path, 'packages', pkg, 'build.js'),
    //    repo.templates.build
    //  )
    //}
    //if (repo.exceptions.customReadme.indexOf(pkg) === -1) {
    //  fs.writeFileSync(path.join(repo.path, 'packages', pkg, 'README.md'), readme(pkg, repo))
    //}
    if (repo.exceptions.customChangelog.indexOf(pkg) === -1) {
      fs.writeFileSync(
        path.join(repo.path, 'packages', pkg, 'CHANGELOG.md'),
        changelog(pkg, repo)
      )
    }
    const type = packageType(pkg, repo)
  }
  fs.writeFileSync(path.join(repo.path, 'CHANGELOG.md'), changelog('global', repo))
  console.log(chalk.yellowBright.bold('All done.'))
}

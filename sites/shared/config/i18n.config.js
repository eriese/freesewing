// See: https://github.com/isaachinman/next-i18next

const i18n = (locales = ['en', 'de', 'es', 'fr', 'nl']) => ({
  i18n: {
    defaultLocale: 'en',
    locales,
  },
  // interpolation: {
  //   prefix: '{',
  //   suffix: '}',
  // }
  // localeStructure: '{lng}/{ns}',
})

module.exports = i18n

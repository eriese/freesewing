import orderBy from 'lodash.orderby'
import get from 'lodash.get'
import cloneDeep from 'lodash.clonedeep'
import { useState, useMemo, createContext } from 'react'
import { useNavigation } from 'site/hooks/use-navigation.mjs'
import { objUpdate } from 'shared/utils.mjs'

const defaultNavigationContext = {
  path: [],
  title: 'FIXME: No title (default)',
  locale: 'en',
  crumbs: [],
}

export const NavigationContext = createContext(defaultNavigationContext)

const createCrumbs = (path, nav) =>
  path.map((crumb, i) => {
    const slice = path.slice(0, i + 1)
    const entry = get(nav, slice, { t: 'no-actual-title', s: slice.join('/') })
    const val = { t: entry.t, s: entry.s }
    if (entry.o) val.o = entry.o

    return val
  })

const createSections = (nav) => {
  const sections = {}
  for (const slug of Object.keys(nav)) {
    const entry = nav[slug]
    const val = { t: entry.t, s: entry.s }
    if (entry.o) val.o = entry.o
    if (!entry.h) sections[slug] = val
  }

  return orderBy(sections, ['o', 't'])
}

const buildNavState = (value, siteNav, extra = []) => {
  for (const [path, data] of extra) {
    siteNav = objUpdate(siteNav, path, data)
  }
  const obj = {
    siteNav,
    crumbs: createCrumbs(value.path, siteNav),
    sections: createSections(siteNav),
    slug: value.path.join('/'),
  }
  obj.title = obj.crumbs.length > 0 ? obj.crumbs.slice(-1)[0].t : ''

  return obj
}

export const NavigationContextProvider = ({ children }) => {
  function setNavigation(newValues) {
    setValue({
      ...value,
      ...newValues,
      setNavigation,
      addPages,
    })
  }

  const [value, setValue] = useState({
    ...defaultNavigationContext,
    setNavigation,
  })
  const [extraPages, setExtraPages] = useState([])

  const rawSiteNav = useNavigation({ path: value.path, locale: value.locale })

  const siteNav = useMemo(() => {
    const nav = cloneDeep(rawSiteNav)

    for (const [_path, _data] of extraPages) {
      objUpdate(nav, _path, _data)
    }

    return nav
  }, [rawSiteNav, extraPages])

  const navState = buildNavState(value, siteNav)

  const addPages = (extra) => {
    setExtraPages([...extraPages, ...extra])
  }

  return (
    <NavigationContext.Provider value={{ ...value, ...navState }}>
      {children}
    </NavigationContext.Provider>
  )
}

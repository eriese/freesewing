import { useEffect, useState } from 'react'
import useLocalStorage from 'shared/hooks/useLocalStorage.js'
import Layout from 'shared/components/layouts/default'
import Menu from 'shared/components/workbench/menu/index.js'
import set from 'lodash.set'
import unset from 'lodash.unset'
import defaultSettings from 'shared/components/workbench/default-settings.js'
import DraftError from 'shared/components/workbench/draft/error.js'
import theme from 'pkgs/plugin-theme/src/index.js'
import preloaders from 'shared/components/workbench/preload.js'

// Views
import Measurements from 'shared/components/workbench/measurements/index.js'
import LabDraft from 'shared/components/workbench/draft/index.js'
import LabSample from 'shared/components/workbench/sample.js'
import ExportDraft from 'shared/components/workbench/export.js'
import GistAsJson from 'shared/components/workbench/json.js'
import GistAsYaml from 'shared/components/workbench/yaml.js'
import DraftEvents from 'shared/components/workbench/events.js'
import CutLayout from 'shared/components/workbench/layout/cut'
import PrintLayout from 'shared/components/workbench/layout/print'

const views = {
  measurements: Measurements,
  draft: LabDraft,
  test: LabSample,
  printingLayout: PrintLayout,
  cuttingLayout: CutLayout,
  export: ExportDraft,
  events: DraftEvents,
  yaml: GistAsYaml,
  json: GistAsJson,
  welcome: () => <p>TODO</p>,
}

// Generates a default pattern gist to start from
const defaultGist = (pattern, locale='en') => {
  const gist = {
  design: pattern.config.name,
  version: pattern.config.version,
  ...defaultSettings
  }
  if (locale) gist.locale = locale

  return gist
}

const hasRequiredMeasurements = (pattern, gist) => {
  for (const m of pattern.config.measurements) {
    if (!gist?.measurements?.[m]) return false
  }

  return true
}

/*
 * This component wraps the workbench and is in charge of
 * keeping the gist state, which will trickle down
 * to all workbench subcomponents
 */
const WorkbenchWrapper = ({ app, pattern, preload=false, from=false, layout=false }) => {

  // State for gist
  const [gist, setGist, ready] = useLocalStorage(`${pattern.config.name}_gist`, defaultGist(pattern, app.locale))
  const [messages, setMessages] = useState([])

  // If we don't have the required measurements,
  // force view to measurements
  useEffect(() => {
    if (
      ready && gist?._state?.view !== 'measurements'
      && !hasRequiredMeasurements(pattern, gist)
    ) updateGist(['_state', 'view'], 'measurements')
  }, [ready])

  // If we need to preload the gist, do so
  useEffect(() => {
    const doPreload = async () => {
      if (preload && from && preloaders[from]) {
        const g = await preloaders[from](preload, pattern)
        setGist({ ...gist, ...g.settings })
      }
    }
    doPreload();
  }, [preload, from])

  // Helper methods to manage the gist state
  const updateGist = (path, content, closeNav=false) => {
    const newGist = {...gist}
    set(newGist, path, content)
    setGist(newGist)
    // Force close of menu on mobile if it is open
    if (closeNav && app.primaryMenu) app.setPrimaryMenu(false)
  }
  const unsetGist = (path) => {
    const newGist = {...gist}
    unset(newGist, path)
    setGist(newGist)
  }
  // Helper methods to handle messages
  const feedback = {
    add: msg => {
      const newMsgs = [...messages]
      if (Array.isArray(msg)) newMsgs.push(...msg)
      else newMsgs.push(msg)
      setMessages(newMsgs)
    },
    set: setMessages,
    clear: () => setMessages([]),
  }

  // Generate the draft here so we can pass it down
  let draft = false
  if (['draft', 'events', 'test'].indexOf(gist?._state?.view) !== -1) {
    draft = new pattern(gist)
    if (gist.renderer === 'svg') draft.use(theme)
    try {
      if (gist._state.view !== 'test') draft.draft()
    }
    catch(error) {
      console.log('Failed to draft pattern', error)
      return <DraftError error={error} app={app} draft={draft} at={'draft'} />
    }
  }

  // Props to pass down
  const componentProps = { app, pattern, gist, updateGist, unsetGist, setGist, draft, feedback }
  // Required props for layout
  const layoutProps = {
    app: app,
    noSearch: true,
    workbench: true,
    AltMenu: <Menu {...componentProps }/>
  }

  // Layout to use
  const LayoutComponent = layout
    ? layout
    : Layout

  const Component = views[gist?._state?.view]
    ? views[gist._state.view]
    : views.welcome

  return  <LayoutComponent {...layoutProps}>
            {messages}
            <Component {...componentProps} />
          </LayoutComponent>
}

export default WorkbenchWrapper


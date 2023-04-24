import { useEffect, useRef, useState } from 'react'

const doDebug = true

export function useRenderTracing(props, componentName = 'Page') {
  // doDebug && console.log(`Initialize component ${componentName}`)
  const prev = useRef(props)
  const [count, setCount] = useState(0)

  const drillProps = (curVal, prevVal, level = 0) => {
    if (curVal == prevVal) return

    const curType = typeof curVal
    if (curType !== typeof prevVal || level > 4 || curType !== 'object') {
      return [prevVal, curVal]
    }

    if (curType === 'object') {
      const storage = {}
      for (var k in curVal) {
        let diff = drillProps(curVal[k], prevVal[k], level + 1)
        diff && (storage[k] = diff)
      }
      return Object.keys(storage).length ? storage : undefined
    }
  }
  useEffect(() => {
    doDebug && console.debug(`First render from component ${componentName}`)
    setCount(1)
  }, [])

  useEffect(() => {
    setCount((curCount) => {
      doDebug &&
        console.debug(`Checking for changed props on render ${curCount} of ${componentName}`)
      const changedProps = drillProps({ ...props }, { ...prev.current })
      if (changedProps && doDebug) {
        console.debug('Changed props:', componentName, changedProps)
      }
      prev.current = props
      return curCount + 1
    })
  }, Object.values(props))
}

const usePrevious = (value, initialValue) => {
  const ref = useRef(initialValue)
  useEffect(() => {
    ref.current = value
  })
  return ref.current
}

export const useEffectDebugger = (
  effectHook,
  dependencies,
  dependencyNames = [],
  componentName
) => {
  const previousDeps = usePrevious(dependencies, [])

  const changedDeps = dependencies.reduce((accum, dependency, index) => {
    if (dependency !== previousDeps[index]) {
      const keyName = dependencyNames[index] || index
      return {
        ...accum,
        [keyName]: {
          before: previousDeps[index],
          after: dependency,
        },
      }
    }

    return accum
  }, {})

  if (Object.keys(changedDeps).length && doDebug) {
    console.log('[use-effect-debugger] ', componentName, changedDeps)
  }

  useEffect(effectHook, dependencies)
}

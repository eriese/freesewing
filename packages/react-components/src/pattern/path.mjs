import React from 'react'
import { getId, getProps } from './utils.mjs'

export const Path = ({ stackName, pathName, path, partName, part, settings, components, t }) => {
  // Don't render hidden paths
  if (path.hidden) return null

  // Get potentially swizzled components
  const { TextOnPath } = components

  const output = []
  const pathId = getId({ settings, stackName, partName, pathName })

  return (
    <>
      <path id={pathId} d={path.d} {...getProps(path)} />
      {path.attributes.text.length > 0 ? <TextOnPath {...{ path, pathId, t }} /> : null}
    </>
  )

  return output
}

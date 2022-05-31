import React from 'react'
import { useTranslation } from 'next-i18next'

const Text = (props) => {
  const { t } = useTranslation(['plugin'])
  const text = []
  // Handle translation
  let translated = ''
  for (let string of props.point.attributes.getAsArray('data-text')) {
      translated += t(string)
      translated += ' '
  }
  // Handle muti-line text
  if (translated.indexOf('\n') !== -1) {
    let key = 0
    const lines = translated.split('\n')
    text.push(<tspan key={'tspan-' + key}>{lines.shift()}</tspan>)
    for (const line of lines) {
      key++
      text.push(
        <tspan
          key={'tspan-' + key}
          x={props.point.x}
          dy={props.point.attributes.get('data-text-lineheight') || 12}
        >
          {line.toString().replace(/&quot;/g, '"')}
        </tspan>
      )
    }
  } else text.push(<tspan key="tspan-1">{translated}</tspan>)

  return (
    <text
      x={props.point.x}
      y={props.point.y}
      {...props.point.attributes.asPropsIfPrefixIs('data-text-')}
    >
      {text}
    </text>
  )
}

export default Text

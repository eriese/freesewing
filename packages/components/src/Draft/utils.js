export const getProps = (obj) => {
  console.warn('CALLING THE WRONG getProps')
  // /** I can't believe it but there seems to be no method on NPM todo this */
  // const cssKey = (key) => {
  //   let chunks = key.split('-')
  //   if (chunks.length > 1) {
  //     key = chunks.shift()
  //     for (let s of chunks) key += s.charAt(0).toUpperCase() + s.slice(1)
  //   }

  //   return key
  // }

  // const convert = (css) => {
  //   let style = {}
  //   let rules = css.split(';')
  //   for (let rule of rules) {
  //     let chunks = rule.split(':')
  //     if (chunks.length === 2) style[cssKey(chunks[0].trim())] = chunks[1].trim()
  //   }
  //   return style
  // }

  // let rename = {
  //   class: 'className',
  //   'marker-start': 'markerStart',
  //   'marker-end': 'markerEnd'
  // }
  // let props = {}

  // let style = obj.attributes.get('style') || ''
  // style.['transform-origin'] = obj.attributes.get('transform-origin').renderAsCss()

  // obj.attributes.set('style', style)

  // for (let key in obj.attributes.list) {
  //   if (key === 'style') props[key] = convert(obj.attributes.get(key))
  //   if (Object.keys(rename).indexOf(key) !== -1) props[rename[key]] = obj.attributes.get(key)
  //   else if (key !== 'style') props[key] = obj.attributes.get(key)
  // }

  // console.log(props)
  // return props
}

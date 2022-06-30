import style from './lib/style'
import pkg from '../package.json'

export default {
  name: pkg.name,
  version: pkg.version,
  hooks: {
    preRender: (svg) => {
      if (svg.attributes.get('freesewing:plugin-title') === false) {
        svg.attributes.set('freesewing:plugin-title', pkg.version)
        svg.style += style
      }
    },
  },
  macros: {
    title: function (so) {
      const transform = function (anchor) {
        const cx = anchor.x - so.scale * anchor.x
        const cy = anchor.y - so.scale * anchor.y

        return `matrix(${so.scale}, 0, 0, ${so.scale}, ${cx}, ${cy}) rotate(${so.rotation} ${anchor.x} ${anchor.y})`
      }
      const defaults = {
        scale: 1,
        rotation: 0,
        lines: []
      }
      so = { ...defaults, ...so }
      so.scale = so.scale * this.context.settings.scale
      let overwrite = true
      if (so.append) overwrite = false
      let prefix = ''
      if (so.prefix) prefix = so.prefix
      this.points[`_${prefix}_titleNr`] = so.at
        .clone()
        .attr('data-text', so.nr, overwrite)
        .attr('data-text-class', 'text-4xl fill-note font-bold')
        .attr('data-text-transform', transform(so.at))
      let shift = 0;
      const shiftAngle = -90 - so.rotation;
      const addShiftedLine = (pointName, text, className, transformSize) => {
        shift += 8;
        this.points[`_${prefix}_${pointName}`] = so.at
          .shift(shiftAngle, shift * so.scale)
          .attr('data-text', text)
          .attr('data-text-class', className)
          .attr('data-text-transform', transform(so.at.shift(shiftAngle, transformSize * so.scale)));

        return this.points[`_${prefix}_${pointName}`]
      }
      if (so.title) {
        addShiftedLine('titleName', so.title, 'text-lg fill-current font-bold', 13)
        // this.points[`_${prefix}_titleName`] = so.at
        //   .shift(shiftAngle, shift * so.scale)
        //   .attr('data-text', so.title)
        //   .attr('data-text-class', 'text-lg fill-current font-bold')
        //   .attr('data-text-transform', transform(so.at.shift(shiftAngle, 13 * so.scale)))
        // shift += 8
      }
      addShiftedLine('titlePattern', `${this.context.config.name} v${this.context.config.version}`, 'fill-note', shift);
      // this.points[`_${prefix}_titlePattern`] = so.at
      //   .shift(shiftAngle, shift * so.scale)
      //   .attr('data-text', this.context.config.name)
      //   .attr('data-text', 'v' + this.context.config.version)
      //   .attr('data-text-class', 'fill-note')
      //   .attr('data-text-transform', transform(so.at.shift(shiftAngle, shift * so.scale)))
      if (this.context.settings.metadata && this.context.settings.metadata.for) {
        addShiftedLine('titleFor', `( ${this.context.settings.metadata.for} )`, 'fill-current font-bold', shift);
        // shift += 8
        // this.points[`_${prefix}_titleFor`] = so.at
        //   .shift(shiftAngle, shift * so.scale)
        //   .attr('data-text', '( ' + this.context.settings.metadata.for + ' )')
        //   .attr('data-text-class', 'fill-current font-bold')
        //   .attr('data-text-transform', transform(so.at.shift(shiftAngle, shift * so.scale)))
      }
      if (so.lines?.length) {
        for (var i = 0; i < so.lines.length; i++) {
          const line = so.lines[i];
          addShiftedLine(`titleLine${i}`, line, 'fill-current', shift)
          // shift += 8;
          // this.points[`_${prefix}_titleLine${i}`] = so.at
          //   .shift(shiftAngle, shift * so.scale)
        }
      }
    },
  },
}

// FIXME surely this can be extracted from the theme in some way so as to keep things consistent?

const round = value => Math.round(value * 1e2) / 1e2

const colors = {
  fabric: '#212121',
  lining: '#10b981',
  interfacing: '#a3a3a3',
  canvas: '#d97706',
  various: '#ef4444',
  note: '#8b5cf6',
  mark: '#3b82f6',
  contrast: '#ec4899'
}

export default (scale, nest) => `
  ${nest ? '/* Reset */' : ''}
  ${nest ? 'svg.freesewing ' : ''}path,
  ${nest ? 'svg.freesewing ' : ''}circle,
  ${nest ? 'svg.freesewing ' : ''}rect {
    fill: none;
    stroke: none;
  }

  ${nest ? '/* Defaults */' : ''}
  ${nest ? 'svg.freesewing ' : ''}path,
  ${nest ? 'svg.freesewing ' : ''}circle {
    stroke: #000;
    stroke-opacity: 1;
    stroke-width: ${round(0.3*scale)};
    stroke-linecap: round;
    stroke-linejoin: round;
  }

  ${nest ? '/* Stroke classes */' : ''}
  ${nest ? 'svg.freesewing ' : ''}.fabric {
    stroke-width: ${round(0.6*scale)};
    stroke: ${colors.fabric};
  }
  ${nest ? 'svg.freesewing ' : ''}.lining {
    stroke-width: ${round(0.6*scale)};
    stroke: ${colors.lining};
  }
  ${nest ? 'svg.freesewing ' : ''}.interfacing {
    stroke-width: ${round(0.6*scale)};
    stroke: ${colors.interfacing};
  }
  ${nest ? 'svg.freesewing ' : ''}.canvas {
    stroke-width: ${round(0.6*scale)};
    stroke: ${colors.canvas};
  }
  ${nest ? 'svg.freesewing ' : ''}.various {
    stroke-width: ${round(0.6*scale)};
    stroke: ${colors.various};
  }
  ${nest ? 'svg.freesewing ' : ''}.note {
    stroke-width: ${round(0.4*scale)};
    stroke: ${colors.note};
  }
  ${nest ? 'svg.freesewing ' : ''}.mark {
    stroke-width: ${round(0.4*scale)};
    stroke: ${colors.mark};
  }
  ${nest ? 'svg.freesewing ' : ''}.contrast {
    stroke-width: ${round(0.8*scale)};
    stroke: ${colors.contrast};
  }

  ${nest ? 'svg.freesewing ' : ''}.stroke-xs {
    stroke-width: ${round(0.1*scale)};
  }
  ${nest ? 'svg.freesewing ' : ''}.stroke-sm {
    stroke-width: ${round(0.2*scale)};
  }
  ${nest ? 'svg.freesewing ' : ''}.stroke-lg {
    stroke-width: ${round(0.6*scale)};
  }
  ${nest ? 'svg.freesewing ' : ''}.stroke-xl {
    stroke-width: ${round(1*scale)};
  }
  ${nest ? 'svg.freesewing ' : ''}.stroke-xxl,
  ${nest ? 'svg.freesewing ' : ''}.stroke-2xl {
    stroke-width: ${round(2*scale)};
  }
  ${nest ? 'svg.freesewing ' : ''}.stroke-3xl {
    stroke-width: ${round(3*scale)};
  }
  ${nest ? 'svg.freesewing ' : ''}.stroke-4xl {
    stroke-width: ${round(4*scale)};
  }

  ${nest ? 'svg.freesewing ' : ''}.sa {
    stroke-dasharray: 0.4, 0.8;
  }
  ${nest ? 'svg.freesewing ' : ''}.help {
    stroke-width: ${round(0.2*scale)};
    stroke-dasharray: 15, 1.5, 1, 1.5;
  }
  ${nest ? 'svg.freesewing ' : ''}.dotted {
    stroke-dasharray: 0.4, 0.8;
  }
  ${nest ? 'svg.freesewing ' : ''}.dashed {
    stroke-dasharray: 1, 1.5;
  }
  ${nest ? 'svg.freesewing ' : ''}.lashed {
    stroke-dasharray: 6, 6;
  }
  ${nest ? 'svg.freesewing ' : ''}.hidden {
    stroke: none;
    fill: none;
  }
  ${nest ? 'svg.freesewing ' : ''}.no-stroke { stroke: none !important; }
  ${nest ? 'svg.freesewing ' : ''}.no-fill { fill: none !important; }
  ${nest ? 'svg.freesewing ' : ''}.muted {
    opacity: 0.15;
  }

  ${nest ? '/* Fill classes */' : ''}
  ${nest ? 'svg.freesewing ' : ''}.fill-fabric {
    fill: ${colors.fabric};
  }
  ${nest ? 'svg.freesewing ' : ''}.fill-lining {
    fill: ${colors.lining};
  }
  ${nest ? 'svg.freesewing ' : ''}.fill-interfacing {
    fill: ${colors.interfacing};
  }
  ${nest ? 'svg.freesewing ' : ''}.fill-canvas {
    fill: ${colors.canvas};
  }
  ${nest ? 'svg.freesewing ' : ''}.fill-various {
    fill: ${colors.various};
  }
  ${nest ? 'svg.freesewing ' : ''}.fill-note {
    fill: ${colors.note};
  }
  ${nest ? 'svg.freesewing ' : ''}.fill-mark {
    fill: ${colors.mark};
  }
  ${nest ? 'svg.freesewing ' : ''}.fill-contrast {
    fill: ${colors.contrast};
  }

  ${nest ? '/* Text */' : ''}
  ${nest ? 'svg.freesewing ' : ''}text {
    font-size: ${round(5*scale)}px;
    font-family: -apple-system, system-ui, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue',
      Arial, sans-serif;
    fill: #000;
    text-anchor: start;
    font-weight: 200;
    dominant-baseline: ideographic;
  }
  ${nest ? 'svg.freesewing ' : ''}.text-xs {
    font-size: ${round(3*scale)}px;
  }
  ${nest ? 'svg.freesewing ' : ''}.text-sm {
    font-size: ${round(4*scale)}px;
  }
  ${nest ? 'svg.freesewing ' : ''}.text-lg {
    font-size: ${round(7*scale)}px;
  }
  ${nest ? 'svg.freesewing ' : ''}.text-xl {
    font-size: ${round(9*scale)}px;
  }
  ${nest ? 'svg.freesewing ' : ''}.text-xxl {
    font-size: ${round(12*scale)}px;
  }
  ${nest ? 'svg.freesewing ' : ''}.text-4xl {
    font-size: ${round(36*scale)}px;
  }

  ${nest ? 'svg.freesewing ' : ''}.center {
    text-anchor: middle;
  }
  ${nest ? 'svg.freesewing ' : ''}.baseline-center {
    alignment-baseline: central;
    dominant-baseline: central;
  }

  ${nest ? 'svg.freesewing ' : ''}.right {
    text-anchor: end;
  }

  ${nest ? '/* Bartack */' : ''}
  ${nest ? 'svg.freesewing ' : ''}path.bartack {
    stroke-width: ${round(2*scale)};
    stroke: #fd7e14;
    stroke-linecap: butt;
  }
`;

import { version } from '../package.json'

export default {
  version,
  name: 'carlton',
  design: ['Anneke Caramin', 'Joost De Cock'],
  code: 'Joost De Cock',
  department: 'coats',
  type: 'pattern',
  difficulty: 5,
  optionGroups: {
    fit: [
      'acrossBackFactor',
      'armholeDepthFactor',
      'bicepsEase',
      'chestEase',
      'cuffEase',
      'shoulderEase',
      'sleeveBend',
      'sleeveLengthBonus',
      'waistEase',
      'seatEase',
      'draftForHighBust',
    ],
    advanced: [
      'backNeckCutout',
      'frontArmholeDeeper',
      'frontOverlap',
      'lapelReduction',
      'shoulderSlopeReduction',
      'sleevecapHeight',
      'sleevecapEase',
    ],
    pockets: [
      'pocketPlacementHorizontal',
      'pocketPlacementVertical',
      'pocketWidth',
      'pocketHeight',
      'pocketRadius',
      'pocketFlapRadius',
      'chestPocketHeight',
      'chestPocketWidth',
      'chestPocketPlacement',
      'chestPocketAngle',
      'innerPocketPlacement',
      'innerPocketWidth',
      'innerPocketDepth',
      'innerPocketWeltHeight',
    ],
    style: [
      'beltWidth',
      'buttonSpacingHorizontal',
      'cuffLength',
      'length',
      's3Collar',
      's3Armhole',
    ],
    collar: ['collarHeight', 'collarSpread', 'collarFlare'],
  },
  measurements: [
    'biceps',
    'chest',
    'hips',
    'hpsToWaistBack',
    'waist',
    'waistToHips',
    'neck',
    'shoulderSlope',
    'shoulderToElbow',
    'shoulderToShoulder',
    'shoulderToWrist',
    'wrist',
    'waistToFloor',
    'waistToSeat',
    'seat',
  ],
  optionalMeasurements: ['highBust'],
  dependencies: {
    bentBack: 'bentBase',
    bentFront: 'bentBack',
    bentTopSleeve: 'bentSleeve',
    bentUnderSleeve: 'bentSleeve',
    front: 'bentFront',
    back: 'bentBack',
    tail: ['front', 'back'],
    topSleeve: ['bentTopSleeve', 'bentFront'],
    underSleeve: ['bentUnderSleeve', 'bentFront'],
    belt: 'back',
    collarStand: ['front', 'back'],
    collar: 'collarStand',
    cuffFacing: ['topSleeve', 'underSleeve', 'bentFront'],
    pocket: 'front',
    pocketFlap: 'front',
    pocketLining: 'pocket',
    chestPocketWelt: 'front',
    chestPocketBag: 'front',
    innerPocketWelt: 'front',
    innerPocketBag: 'front',
    innerPocketTab: 'front',
  },
  inject: {
    bentBack: 'bentBase',
    bentFront: 'bentBack',
    bentTopSleeve: 'bentSleeve',
    bentUnderSleeve: 'bentSleeve',
    front: 'bentFront',
    back: 'bentBack',
    topSleeve: 'bentTopSleeve',
    underSleeve: 'bentUnderSleeve',
    collar: 'collarStand',
    pocketLining: 'pocket',
  },
  hide: ['bentBase', 'bentBack', 'bentFront', 'bentSleeve', 'bentTopSleeve', 'bentUnderSleeve'],
  options: {
    // Constants
    brianFitSleeve: true,
    brianFitCollar: true,
    collarFactor: 4.8,
    chestShapingMax: 5,
    backPleat: 0.048,
    lengthBonus: 0,
    collarEase: 0.145,

    // Options inherited from Bent
    acrossBackFactor: { pct: 97, min: 93, max: 100 },
    armholeDepthFactor: { pct: 65, min: 50, max: 70 },
    bicepsEase: { pct: 20, min: 0, max: 50 },
    chestEase: { pct: 10, min: 5, max: 20 },
    cuffEase: { pct: 60, min: 30, max: 100 },
    shoulderEase: { pct: 0, min: -2, max: 6 },
    sleeveBend: { deg: 10, min: 0, max: 20 },
    sleevecapHeight: { pct: 45, min: 40, max: 60 },
    sleevecapEase: { pct: 1, min: 0, max: 10 },
    sleeveLengthBonus: { pct: 7, min: 0, max: 20 },
    shoulderSlopeReduction: { pct: 12, min: 0, max: 80 },
    backNeckCutout: { pct: 5, min: 2, max: 8 },
    frontArmholeDeeper: { pct: 0.5, min: 0, max: 1.5 },

    // Carlton options
    waistEase: { pct: 14, min: 8, max: 25 },
    seatEase: { pct: 14, min: 8, max: 25 },
    length: { pct: 69, min: 35, max: 100 },
    buttonSpacingHorizontal: { pct: 43.5, min: 15, max: 60 },
    frontOverlap: { pct: 1.5, min: 1, max: 2 },
    lapelReduction: { pct: 5, min: 0, max: 10 },
    pocketPlacementHorizontal: { pct: 11, min: 5, max: 60 },
    pocketPlacementVertical: { pct: 6, min: 5, max: 60 },
    pocketWidth: { pct: 95, min: 70, max: 120 },
    pocketHeight: { pct: 15, min: 0, max: 40 },
    pocketRadius: { pct: 20, min: 0, max: 50 },
    pocketFlapRadius: { pct: 15, min: 0, max: 50 },
    chestPocketHeight: { pct: 60, min: 40, max: 80 },
    chestPocketWidth: { pct: 25, min: 15, max: 50 },
    chestPocketPlacement: { pct: 55, min: 30, max: 65 },
    chestPocketAngle: { deg: 4, min: 0, max: 6 },

    innerPocketPlacement: { pct: 53, min: 42, max: 62 },
    innerPocketWidth: { pct: 50, min: 45, max: 65 },
    innerPocketDepth: { pct: 110, min: 75, max: 140 },
    innerPocketWeltHeight: { pct: 3.5, min: 2.5, max: 5 },

    beltWidth: { pct: 15, min: 10, max: 20 },
    cuffLength: { pct: 15, min: 10, max: 20 },
    collarHeight: { pct: 9.6, min: 8, max: 11 },
    collarSpread: { deg: 4, min: 2, max: 6 },
    collarFlare: { pct: 20, min: 0, max: 40 },
    // s3 is short for Shoulder Seam Shift
    s3Collar: { pct: 0, min: -100, max: 100 },
    s3Armhole: { pct: 0, min: -100, max: 100 },

    // draft for high bust
    draftForHighBust: { bool: false },
  },
}

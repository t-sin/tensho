export const GAME_INITIALIZING = 'initializing';
export const GAME_PLAYING = 'playing';
export const GAME_PLAYER_DEFEATED = 'player defeated';
export const GAME_PLAYER_WON = 'player won';

export const CANNON_DISABLED = 'disabled';
export const CANNON_ALIVE = 'alive';
export const CANNON_DYING = 'dying';

export const CANNON_SHOT_DISABLED = 'disabled';
export const CANNON_SHOT_MOVING = 'moving';
export const CANNON_SHOT_DYING = 'dying';

export const INVADER_SHOT_DISABLED = 'disabled';
export const INVADER_SHOT_MOVING = 'moving';
export const INVADER_SHOT_DYING = 'dying';

export const INVADER_DISABLED = 'disabled';
export const INVADER_ALIVE = 'alive';
export const INVADER_DYING = 'dying';

export const UFO_DISABLED = 'disabled';
export const UFO_ALIVE = 'alive';
export const UFO_DYING = 'dying';

export const ufo_dying_anim_pattern = '⺍丷';

export const cannon_alive_anim_pattern = '凸';
export const cannon_dying_anim_pattern = '⺍丷';

export const invader_anim_pattern = [
  "閧闘",
  "閧闘",
  "莔莤",
  "莔莤",
  "余会",
];

export const invader_shot_anim_pattern = [
  '⦚⧘⸾', // NotoSans, 
  '⭭⭽', // NotoSansSymbol2
];

export const torchka_pattern = [
  ['門', '門', '門', '門', '門', '門', '門', '　', '　', '門', '門', '門', '門', '門', '門', '門'],
  ['門', '門', '門', '門', '門', '門', '門', '　', '　', '門', '門', '門', '門', '門', '門', '門'],
  ['門', '門', '　', '　', '　', '　', '門', '　', '　', '門', '　', '　', '　', '　', '門', '門'],
  ['門', '門', '門', '門', '門', '門', '門', '　', '　', '門', '門', '門', '門', '門', '門', '門'],

  ['門', '門', '　', '　', '　', '　', '門', '　', '　', '門', '　', '　', '　', '　', '門', '門'],
  ['門', '門', '門', '門', '門', '門', '門', '　', '　', '門', '門', '門', '門', '門', '門', '門'],
  ['門', '門', '門', '門', '門', '門', '門', '　', '　', '門', '門', '門', '門', '門', '門', '門'],
  ['門', '門', '　', '　', '　', '　', '　', '　', '　', '　', '　', '　', '　', '　', '門', '門'],

  ['門', '門', '　', '　', '　', '　', '　', '　', '　', '　', '　', '　', '　', '　', '門', '門'],
  ['門', '門', '　', '　', '　', '問', '問', '問', '問', '問', '問', '　', '　', '　', '門', '門'],
  ['門', '門', '　', '　', '　', '問', '　', '　', '　', '　', '問', '　', '　', '　', '門', '門'],
  ['門', '門', '　', '　', '　', '問', '　', '　', '　', '　', '問', '　', '　', '　', '門', '門'],

  ['門', '門', '　', '　', '　', '問', '閂', '閂', '閂', '閂', '問', '　', '　', '　', '門', '門'],
  ['門', '門', '　', '　', '　', '問', '　', '　', '　', '　', '問', '　', '　', '　', '門', '門'],
  ['門', '門', '　', '　', '　', '問', '　', '　', '　', '　', '問', '　', '　', '　', '門', '門'],
  ['門', '門', '　', '　', '　', '問', '問', '問', '問', '問', '問', '　', '　', '　', '門', '門'],
];

export const score = {
  invader: [
    10,
    10,
    20,
    20,
    30,
  ],
  ufo: [
    100, 50, 100, 300, 50, 50, 100, 500, 100, 300, 150, 300, 50, 100, 50, 150, 300,
  ],
};

export const config = {
  rows: 5,
  columns: 11,
  edge: {
    top: 30,
    bottom: 440,
    left: 70,
    right: 570,
  },
};


export const ufo = {
  str: [
    '文字渦',
    '円城塔',
  ],
  interval: 60 * 15,
  initial: { x: [50 - Math.floor(18 * 1.5), 570 - Math.floor(18 * 1.5)], y: 70 },
  speed: { x: 2 },
  hit: {
    offset: { x: 0, y: -15 },
    size: { w: 20 * 2.5, h: 20 },
  },
};

export const cannon = {
  initial: { x: 320, y: 430 },
  speed: { x: 5 },
  hit: {
    offset: { x: -3, y: 20 },
    width: 20,
  },
  shot: {
    hit: {
      offset: { x: 7, y: 20 },
    },
  },
};

export const invaders = {
  initial: {
    topleft: { x: 130, y: 100 },
    offset: { x: 35, y: 29 },
  },
  speed: { x: 5, y: 20 },
  move_per_frames: 2,
  hit: {
    offset: { x: 3, y: 20 },
    width: 20,
  },
  size: 25,
  shot: {
    hit: {
      offset: { x: 10, y: 10 },
    },
  },
};

export const torchka = {
  toplefts: [
    { x: 120, y: 330 },
    { x: 240, y: 330 },
    { x: 360, y: 330 },
    { x: 480, y: 330 },
  ],
};

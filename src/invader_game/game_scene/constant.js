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

export const cannon_alive_anim_pattern = '凸';
export const cannon_dying_anim_pattern = '⺍丷';

export const invader_anim_pattern = [
  "閧闘",
  "莔莤",
  "莔莤",
  "莔莤",
  "余会",
];

export const invader_shot_anim_pattern = [
  '⦚⧘⸾', // NotoSans, 
  '⭭⭽', // NotoSansSymbol2
];

export const config = {
  rows: 5,
  columns: 11,
  edge: {
    top: 50,
    bottom: 440,
    left: 70,
    right: 570,
  },
  cannon: {
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
  },
  invaders: {
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
        offset: { x: 10, y: 0 },
      },
    },
  },
};

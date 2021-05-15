export const CANNON_SHOT_DISABLED = 'disabled';
export const CANNON_SHOT_MOVING = 'moving';
export const CANNON_SHOT_DYING = 'dying';

export const INVADER_SHOT_DISABLED = 'disabled';
export const INVADER_SHOT_MOVING = 'moving';
export const INVADER_SHOT_DYING = 'dying';

export const INVADER_DISABLED = 'disabled';
export const INVADER_ALIVE = 'alive';
export const INVADER_DYING = 'dying';

export const invader_anim_pattern = [
  "閧闘",
  "莔莤",
  "莔莤",
  "莔莤",
  "余会",
];

export const invader_shot_anim_pattern = [
  '⦚⧘⸾',
  '⭭⭽',
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
      offset: { x: 3, y: 20 },
      width: 20,
    },
    shot: {
      hit: {
        offset: { x: 10, y: 20 },
      },
    },
  },
  invaders: {
    initial: {
      topleft: { x: 130, y: 100 },
      offset: { x: 35, y: 29 },
    },
    speed: { x: 5, y: 15 },
    move_per_frames: 2,
    hit: {
      offset: { x: 3, y: 20 },
      width: 20,
    },
    size: 25,
  },
};

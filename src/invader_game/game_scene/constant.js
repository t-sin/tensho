export const CANNON_SHOT_DISABLED = 'disable';
export const CANNON_SHOT_MOVING = 'moving';
export const CANNON_SHOT_DYING = 'dying';
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
  },
  invaders: {
    initial: {
      topleft: { x: 120, y: 100 },
      offset: { x: 35, y: 30 },
    },
    speed: { x: 5, y: 20 },
    move_per_frames: 1,
  },
  hit: {
    cannon: {
      offset: { x: 3, y: 20 },
      width: 20,
    },
    invader: {
      offset: { x: 3, y: 20 },
      width: 20,
    },
    shot: {
      offset: { x: 10, y: 20 },
    },
  },
};

const constant = require('./constant.js');

const iterate_all_invaders = (fn, state) => {
  for (let j = 0; j < constant.config.rows; j++) {
    for (let i = 0; i < constant.config.columns; i++) {
      fn(i, j, state.invaders.array[j * constant.config.columns + i]);
    }
  }
};

const should_move_down = () => {
  return false;
};

const should_animate = () => {
  return false;
};

const proc_one_invader = (i, j, invader) => {
};

export const proc = (game, state) => {
  iterate_all_invaders(proc_one_invader, state);
};

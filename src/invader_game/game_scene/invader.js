const constant = require('./constant.js');

const iterate_all_invaders = (fn, state) => {
  for (let j = 0; j < constant.config.rows; j++) {
    for (let i = 0; i < constant.config.columns; i++) {
      fn(state, i, j, state.invaders.array[j * constant.config.columns + i]);
    }
  }
};

const nth_in_array = (i, j) => {
  return j * constant.config.columns + i;
};

const should_move = (i, j) => {
  return false;
};

const should_animate = (i, j, state) => {
  const nth = nth_in_array(i, j)
  const now_is_the_time = state.frames % constant.config.invaders.move_per_frames == 0;

  return state.invaders.current == nth && now_is_the_time;
};

const proc_one_invader = (state, i, j, invader) => {
  if (should_animate(i, j, state)) {
    console.log(invader.current_char);
    invader.current_char = (invader.current_char + 1) % invader.char.length;
  }
};

export const proc = (game, state) => {
  iterate_all_invaders(proc_one_invader, state);

  state.invaders.current = (state.invaders.current + 1) % state.invaders.array.length;
};

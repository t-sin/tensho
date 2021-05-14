const constant = require('./constant.js');

const nth_in_array = (i, j) => {
  return j * constant.config.columns + i;
};

const iterate_all_invaders = (fn, state) => {
  for (let j = 0; j < constant.config.rows; j++) {
    for (let i = 0; i < constant.config.columns; i++) {
      fn(state, i, j, state.invaders.array[j * constant.config.columns + i]);
    }
  }
};

const make_living_checker = () => {
  let first_living_idx = -1;
  let last_living_idx = -1;

  const reset_living_checker = () => {
    first_living_idx = -1;
    last_living_idx = -1;
  };

  const check_living = (i, j, invader) => {
    const idx = nth_in_array(i, j);
    if (invader.state.kind == constant.INVADER_ALIVE) {
      last_living_idx = idx;
    }
    if (first_living_idx == -1 && invader.state.kind == constant.INVADER_ALIVE) {
      first_living_idx = idx;
    }
  };

  const get_living_idx = () => {
    const ret = {
      first: first_living_idx,
      last: last_living_idx,
    };
    return ret;
  };

  return { check_living, get_living_idx, reset_living_checker };
};
const { reset_living_checker, get_living_idx, check_living } = make_living_checker();

const should_move = (i, j, state) => {
  const nth = nth_in_array(i, j)
  const now_is_the_time = state.frames % constant.config.invaders.move_per_frames == 0;

  return state.invaders.current == nth && now_is_the_time;
};

const check_one_invader = (state, i, j, invader) => {
  check_living(i, j, invader);
};

const proc_one_invader = (state, i, j, invader) => {
  if (should_move(i, j, state)) {
    invader.current_char = (invader.current_char + 1) % invader.char.length;
    if (state.invaders.direction_right) {
      invader.x += constant.config.invaders.speed.x;
    } else {
      invader.x -= constant.config.invaders.speed.x;
    }
  }

  const { first, last } = get_living_idx();
  const { left, right } = constant.config.edge;
  const dir_right = state.invaders.direction_right;
  if (first != -1 && state.invaders.array[first].x < left && !dir_right) {
    state.invaders.direction_right = true;
    invader.y += constant.config.invaders.speed.y;
  }
  if (last != -1 && state.invaders.array[last].x > right && dir_right) {
    state.invaders.direction_right = false;
    invader.y += constant.config.invaders.speed.y;
  }

  // animate dying invader
  // hit detection
};

export const proc = (game, state) => {
  reset_living_checker();
  iterate_all_invaders(check_one_invader, state);
  iterate_all_invaders(proc_one_invader, state);

  state.invaders.current = (state.invaders.current + 1) % state.invaders.array.length;
};

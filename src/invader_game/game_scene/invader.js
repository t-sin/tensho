const constant = require('./constant.js');

const nth_in_array = (i, j) => {
  return j * constant.config.columns + i;
};

const iterate_all_invaders = (fn, state, ...rest) => {
  for (let j = 0; j < constant.config.rows; j++) {
    for (let i = 0; i < constant.config.columns; i++) {
      fn(state, i, j, state.invaders.array[nth_in_array(i, j)], ...rest);
    }
  }
};

const make_alive_checker = () => {
  const rows = constant.config.rows;
  let left_alives = new Array(rows);
  let right_alives = new Array(rows);
  let left_alive_idx, right_alive_idx;
  let first_alive_idx, last_alive_idx;

  const reset_alive_checker = () => {
    left_alives.fill(null);
    right_alives.fill(null);
    first_alive_idx = -1;
    last_alive_idx = -1;
  };

  const check_alive = (i, j, invader) => {
    if (invader.state.kind == constant.INVADER_ALIVE) {
      const idx = nth_in_array(i, j);
      last_alive_idx = idx

      if (first_alive_idx == -1) {
        first_alive_idx = idx;
      }

      if (left_alives[j] == null || i < left_alives[j].i) {
        left_alives[j] = { i, j };
      };

      if (right_alives[j] == null || i > right_alives[j].i) {
        right_alives[j] = { i, j };
      };
    }
  };

  const get_alive_idx = () => {
    left_alives.sort((a, b) => (a == null || b == null || b.j < a.j || b.i < a.i) ? 1 : -1);
    right_alives.sort((a, b) => (a == null || b == null || b.i > a.i) ? 1 : -1);
    left_alive_idx = left_alives[0];
    right_alive_idx = right_alives[0];

    return {
      left: left_alive_idx,
      right: right_alive_idx,
      first: first_alive_idx,
      last: last_alive_idx,
    };
  };

  return { check_alive, get_alive_idx, reset_alive_checker };
};
const { reset_alive_checker, get_alive_idx, check_alive } = make_alive_checker();

const check_one_invader = (state, i, j, invader) => {
  check_alive(i, j, invader);
};

const should_move = (i, j, state) => {
  const nth = nth_in_array(i, j)
  const now_is_the_time = state.frames % constant.config.invaders.move_per_frames == 0;

  return state.invaders.current == nth && now_is_the_time;
};

const is_hit = (shot, invader) => {
  const shot_hit_x = shot.x + constant.config.cannon.shot.hit.offset.x;
  const shot_hit_y = shot.y;
  const invader_hit = {
    x1: invader.x + constant.config.invaders.hit.offset.x,
    x2: invader.x + constant.config.invaders.hit.offset.x + constant.config.invaders.hit.width,
    y1: invader.y - constant.config.invaders.hit.offset.y,
    y2: invader.y - constant.config.invaders.hit.offset.y + 25,
  };

  const in_invader_x = invader_hit.x1 < shot_hit_x && shot_hit_x < invader_hit.x2;
  const in_invader_y = invader_hit.y1 < shot_hit_y && shot_hit_y < invader_hit.y2;
  const hit = in_invader_x && in_invader_y;

  return hit;
};

const kill_invader = (state, shot, invader) => {
  if (state.cannon.shot.state.kind == constant.CANNON_SHOT_MOVING) {
    if (invader.state.kind == constant.INVADER_ALIVE) {
      shot.state.kind = constant.CANNON_SHOT_DISABLED;
      shot.state.changed_at = state.frames;

      invader.state.kind = constant.INVADER_DYING;
      invader.state.changed_at = state.frames;
      state.invaders.number_of_alive--;
    }
  }
};


const update_one_invader = (state, i, j, invader, turn) => {
  if (turn) {
    invader.y += constant.config.invaders.speed.y;
  }

  if (should_move(i, j, state)) {
    invader.current_char = (invader.current_char + 1) % invader.char.length;
    if (state.invaders.direction_right) {
      invader.x += constant.config.invaders.speed.x;
    } else {
      invader.x -= constant.config.invaders.speed.x;
    }
  }

  if (invader.state.kind == constant.INVADER_DYING) {
    if (state.frames > invader.state.changed_at + 10) {
      invader.state.kind = constant.INVADER_DISABLED;
    }
  }

  if (is_hit(state.cannon.shot, invader)) {
    kill_invader(state, state.cannon.shot, invader);
    return;
  }
};

const on_edge = (state) => {
  let { left, right } = get_alive_idx();
  const { left: edge_left, right: edge_right } = constant.config.edge;

  const invaders = state.invaders.array;
  let most_left, most_right;
  if (left == null) most_left = null; else most_left = invaders[nth_in_array(left.i, left.j)];
  if (right == null) most_right = null; else most_right = invaders[nth_in_array(right.i, right.j)];

  const on_left_edge = most_left != null && most_left.x < edge_left;
  const on_right_edge = most_right != null && most_right.x > edge_right - 25;

  const to_right = state.invaders.direction_right;
  return (to_right && on_right_edge) || (!to_right && on_left_edge);
};

export const proc = (game, state) => {
  reset_alive_checker();
  iterate_all_invaders(check_one_invader, state);

  const { first: first_invader_idx } = get_alive_idx();
  const on_first_invader_moving = state.invaders.current == first_invader_idx;
  if (on_edge(state) && on_first_invader_moving) {
    state.invaders.direction_right = !state.invaders.direction_right;
    iterate_all_invaders(update_one_invader, state, true);
  } else {
    iterate_all_invaders(update_one_invader, state, false);
  }

  state.invaders.current = (state.invaders.current + 1) % state.invaders.array.length;

  if (state.invaders.number_of_alive == 0) {
    return true;
  }

  return false
};

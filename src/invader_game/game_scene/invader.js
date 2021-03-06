const constant = require('./constant.js');

const index = (i, j) => {
  return j * constant.config.columns + i;
};

const iterate_all_invaders = (fn, state, ...rest) => {
  for (let j = 0; j < constant.config.rows; j++) {
    for (let i = 0; i < constant.config.columns; i++) {
      fn(state, i, j, state.invaders.array[index(i, j)], ...rest);
    }
  }
};

const make_alive_checker = () => {
  const rows = constant.config.rows;
  const columns = constant.config.columns;
  let left_alives = new Array(rows);
  let right_alives = new Array(rows);
  let bottom_alives = new Array(columns);
  let left_alive_idx, right_alive_idx;
  let first_alive_idx, last_alive_idx;

  const reset_alive_checker = () => {
    left_alives.fill(null);
    right_alives.fill(null);
    bottom_alives.fill(null);
    first_alive_idx = -1;
    last_alive_idx = -1;
  };

  const check_alive = (i, j, invader) => {
    if (invader.state.kind == constant.INVADER_ALIVE) {
      const idx = index(i, j);
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

      if (bottom_alives[i] == null || j < bottom_alives[i].j) {
        bottom_alives[i] = { i, j };
      };
    }
  };

  const get_alive_idx = (state) => {
    left_alives.sort((a, b) => (a == null ? 1 : b == null ? -1 : b.i < a.i ? 1 : -1));
    right_alives.sort((a, b) => (a == null ? 1 : b == null ? -1 : b.i > a.i ? 1 : -1));

    state.debug.invaders.alive.lefts = left_alives;
    state.debug.invaders.alive.rights = right_alives;
    state.debug.invaders.alive.bottoms = bottom_alives;

    left_alive_idx = left_alives[0];
    right_alive_idx = right_alives[0];

    return {
      left: left_alive_idx,
      right: right_alive_idx,
      first: first_alive_idx,
      last: last_alive_idx,
      bottoms: bottom_alives,
    };
  };

  return { check_alive, get_alive_idx, reset_alive_checker };
};
const { reset_alive_checker, get_alive_idx, check_alive } = make_alive_checker();

const check_one_invader = (state, i, j, invader) => {
  check_alive(i, j, invader);
};

const is_hit = (shot, invader) => {
  const shot_hit_x = shot.x + constant.cannon.shot.hit.offset.x;
  const shot_hit_y = shot.y;
  const invader_hit = {
    x: invader.x + constant.invaders.hit.offset.x,
    y: invader.y + constant.invaders.hit.offset.y,
    w: constant.invaders.hit.size.w,
    h: constant.invaders.hit.size.h,
  };

  const in_invader_x = invader_hit.x < shot_hit_x && shot_hit_x < invader_hit.x + invader_hit.w;
  const in_invader_y = invader_hit.y < shot_hit_y && shot_hit_y < invader_hit.y + invader_hit.h;
  const hit = in_invader_x && in_invader_y;

  return hit;
};

const kill_invader = (state, shot, i, j, invader) => {
  if (invader.state.kind == constant.INVADER_ALIVE) {
    state.score += constant.score.invader[j];
    shot.state.kind = constant.CANNON_SHOT_DISABLED;
    shot.state.changed_at = state.frames;

    invader.state.kind = constant.INVADER_DYING;
    invader.state.changed_at = state.frames;
    state.invaders.number_of_alive--;
  }
};

const can_shoot = (state, bottom_idx, i, j, invader) => {
  const cannon = state.cannon;
    if (!(bottom_idx != null && i == bottom_idx.i && j == bottom_idx.j)) {
    return false;
  }

  const shot = state.invaders.shot[i];
  return (
    cannon.state.kind == constant.CANNON_ALIVE &&
    shot.state.kind == constant.INVADER_SHOT_DISABLED &&
    invader.to_shot <= 0);
};

const shoot = (state, invader, shot) => {
  shot.state.kind = constant.INVADER_SHOT_MOVING;
  shot.state.changed_at = state.frames;
  shot.x = invader.x;
  shot.y = invader.y + constant.invaders.shot.hit.offset.y;
  invader.to_shot = Math.floor(Math.random() * 250 + 100);
};

const collide_with_torchka = (state, invader) => {
  for (let n = 0; n < state.torchka.array.length; n++) {
    let torchka = state.torchka.array[n];

    const topleft = constant.torchka.toplefts[n];
    const box = {
      x: topleft.x,
      y: topleft.y,
      w: torchka[0].length * constant.torchka.dot.size.w,
      h: torchka.length * constant.torchka.dot.size.h * constant.torchka.dot.scale.y,
    };
    const ihit = {
      x: invader.x + constant.invaders.hit.offset.x,
      y: invader.y + constant.invaders.hit.offset.y,
      w: constant.invaders.hit.size.w,
      h: constant.invaders.hit.size.h,
    };

    let x_in_box, y_in_box;
    if (box.x < ihit.x) {
      x_in_box = box.x < ihit.x && ihit.x < box.x + box.w;
    } else {
      x_in_box = ihit.x < box.x && box.x < ihit.x + ihit.w;
    }
    if (box.y < ihit.y) {
      y_in_box = box.y < ihit.y && ihit.y < box.y + box.h;
    } else {
      y_in_box = ihit.y < box.y && box.y < ihit.y + ihit.h;
    }

    const cdot = constant.torchka.dot;
    for (let row of torchka) {
      for (let dot of row) {
        const dhit = {
          x: dot.x + cdot.offset.x,
          y: dot.y + cdot.offset.y,
          w: cdot.size.w,
          h: cdot.size.h,
        };

        let x_in_invader, y_in_invader;
        if (ihit.x < dhit.x) {
          x_in_invader = ihit.x < dhit.x && dhit.x < ihit.x + ihit.w;
        } else {
          x_in_invader = dhit.x < ihit.x && ihit.x < dhit.x + dhit.w;
        }
        if (ihit.y < dhit.y) {
          y_in_invader = ihit.y < dhit.y && dhit.y < ihit.y + ihit.h;
        } else {
          y_in_invader = dhit.y < ihit.y && ihit.y < dhit.y + dhit.h;
        }

        if (x_in_invader && y_in_invader) {
            dot.enabled = false;
        }
      }
    }
  }
};

const update_one_invader = (state, i, j, invader, turn) => {
  if (turn) {
    invader.y += constant.invaders.speed.y;
  }

  if (invader.state.kind == constant.INVADER_DYING) {
    if (state.frames > invader.state.changed_at + 10) {
      invader.state.kind = constant.INVADER_DISABLED;
      return;
    }
  }

  collide_with_torchka(state, invader);

  const cannon_shot_moving = state.cannon.shot.state.kind == constant.CANNON_SHOT_MOVING;
  if (cannon_shot_moving && is_hit(state.cannon.shot, invader)) {
    kill_invader(state, state.cannon.shot, i, j, invader);
    return;
  }

  const { bottoms } = get_alive_idx(state);
  for (let bottom of bottoms) {
    if (can_shoot(state, bottom, i, j, invader)) {
      shoot(state, invader, state.invaders.shot[i]);
    }
  }

  invader.to_shot--;
};

const move = (state, invader) => {
  if (invader.state.kind != constant.INVADER_ALIVE) {
    return
  }

  invader.current_char = (invader.current_char + 1) % invader.char.length;

  if (state.invaders.direction_right) {
    invader.x += constant.invaders.speed.x;
  } else {
    invader.x -= constant.invaders.speed.x;
  }
};

const on_edge = (state) => {
  let { left, right } = get_alive_idx(state);
  const { left: edge_left, right: edge_right } = constant.config.edge;

  const invaders = state.invaders.array;
  let most_left, most_right;
  if (left == null) most_left = null; else most_left = invaders[index(left.i, left.j)];
  if (right == null) most_right = null; else most_right = invaders[index(right.i, right.j)];
  state.debug.invaders.alive.most_left = left;
  state.debug.invaders.alive.most_right = right;

  const on_left_edge = most_left != null && most_left.x < edge_left;
  const on_right_edge = most_right != null && most_right.x > edge_right - 25;

  const to_right = state.invaders.direction_right;
  return (to_right && on_right_edge) || (!to_right && on_left_edge);
};

const next_invader_idx = (state) => {
  state.invaders.current++;
  state.invaders.current %= state.invaders.array.length;

  let invader = state.invaders.array[state.invaders.current];
  while (invader.state.kind != constant.INVADER_ALIVE) {
    if (state.invaders.number_of_alive <= 0) {
      break;
    }

    state.invaders.current++;
    state.invaders.current %= state.invaders.array.length;
    invader = state.invaders.array[state.invaders.current];
  }
};

export const init = (game, state) => {
  let invader = state.invaders.array[state.invaders.current];
  invader.state.kind = constant.INVADER_ALIVE;
  state.invaders.number_of_alive++;

  state.invaders.current++;

  const all_invaders = constant.config.rows * constant.config.columns;
  if (state.invaders.current == all_invaders) {
    state.invaders.current = 0;
    state.kind = constant.GAME_PLAYING;
    state.changed_at = state.frames;
  }
};

const invader_reached_ground = (game, state) => {
  if (state.kind != constant.GAME_PLAYING) {
    return;
  }

  let bottoms = [].concat(get_alive_idx(state).bottoms);
  bottoms.sort((a, b) => (a == null ? 1 : b == null ? -1 : b.j < a.j ? 1 : -1));

  if (bottoms[0] != null) {
    const invader = state.invaders.array[index(bottoms[0].i, bottoms[0].j)];

    if (invader.y > constant.config.edge.bottom - 20) {
      state.kind = constant.GAME_PLAYER_DEFEATED;
      state.changed_at = state.frames;
      state.cannon.state.kind = constant.CANNON_DYING;
      state.cannon.state.changed_at = state.frames;
    }
  }
};

export const proc = (game, state) => {
  reset_alive_checker();
  iterate_all_invaders(check_one_invader, state);

  invader_reached_ground(game, state);

  const { first: first_invader_idx } = get_alive_idx(state);
  const on_first_invader_moving = state.invaders.current == first_invader_idx;
  if (on_edge(state) && on_first_invader_moving) {
    state.invaders.direction_right = !state.invaders.direction_right;
    iterate_all_invaders(update_one_invader, state, true);
  } else {
    iterate_all_invaders(update_one_invader, state, false);
  }

  const current = state.invaders.current;
  move(state, state.invaders.array[current]);

  if (state.kind == constant.GAME_PLAYING && state.invaders.number_of_alive == 0) {
    state.kind = constant.GAME_PLAYER_WON;
    state.changed_at = state.frames;
    return;
  }

  next_invader_idx(state);
};

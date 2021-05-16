const constant = require('./constant.js');

const move_ufo = (game, state) => {
  let ufo = state.ufo;

  if (ufo.state.kind == constant.UFO_ALIVE) {

    if (ufo.type == 0) {
      ufo.x += constant.config.ufo.speed.x;

      if (ufo.x > constant.config.ufo.initial.x[ufo.type + 1]) {
        ufo.state.kind = constant.UFO_DISABLED;
        ufo.state.changed_at = state.frames;
      }

    } else {
      ufo.x -= constant.config.ufo.speed.x;

      if (ufo.x < constant.config.ufo.initial.x[ufo.type - 1]) {
        ufo.state.kind = constant.UFO_DISABLED;
        ufo.state.changed_at = state.frames;
      }
    }
  }
};

const update_ufo = (game, state) => {
  let ufo = state.ufo;

  switch (ufo.state.kind) {
  case constant.UFO_DISABLED:
    if (state.frames >= ufo.state.changed_at + constant.config.ufo.interval) {
      ufo.state.kind = constant.UFO_ALIVE;
      ufo.state.changed_at = state.frames;
      ufo.type = (ufo.type + 1) % constant.ufo.length;
      ufo.x = constant.config.ufo.initial.x[ufo.type];
      ufo.char = constant.ufo[ufo.type];
    }
    break;

  case constant.UFO_DYING:
    if (state.frames - ufo.state.changed_at % 10 == 0) {
      ufo.current_char = (ufo.current_char + 1) % ufo.char.length;
    }

    if (state.frames > ufo.state.changed_at + 15) {
      ufo.state.kind = constant.UFO_DISABLED;
      ufo.state.changed_at = state.frames;
    }

    break;
  }
};

const detect_hit_by_cannon_shot = (game, state) => {
  let shot = state.cannon.shot;
  let ufo = state.ufo;

  if (shot.state.kind != constant.CANNON_SHOT_MOVING) return;
  if (ufo.state.kind != constant.UFO_ALIVE) return;

  const shot_hit_x = shot.x + constant.config.cannon.shot.hit.offset.x;
  const shot_hit_y = shot.y;
  const ufo_hit = {
    x: ufo.x + constant.config.ufo.hit.offset.x,
    y: ufo.y + constant.config.ufo.hit.offset.y,
    w: constant.config.ufo.hit.size.w,
    h: constant.config.ufo.hit.size.h,
  };

  const in_ufo_x = ufo_hit.x < shot_hit_x && shot_hit_x < ufo_hit.x + ufo_hit.w;
  const in_ufo_y = ufo_hit.y < shot_hit_y && shot_hit_y < ufo_hit.y + ufo_hit.h;

  if (in_ufo_x && in_ufo_y) {
    shot.state.kind = constant.CANNON_SHOT_DYING;
    shot.state.changed_at = state.frames;
    ufo.state.kind = constant.UFO_DYING;
    ufo.state.changed_at = state.frames;
    state.score += ufo.score.table[ufo.score.ptr];
  }
};

export const proc = (game, state) => {
  move_ufo(game, state);
  detect_hit_by_cannon_shot(game, state);
  update_ufo(game, state);
};

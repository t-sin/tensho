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
  }
};

export const proc = (game, state) => {
  move_ufo(game, state);
  update_ufo(game, state);
};

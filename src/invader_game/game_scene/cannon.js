const constant = require('./constant.js');

const move_cannon = (game, state) => {
  if (state.cannon.state.kind == constant.CANNON_ALIVE) {
    if (game.input.left && state.cannon.x > constant.config.edge.left - 5) {
      state.cannon.x -= constant.config.cannon.speed.x;
    }

    if (game.input.right && state.cannon.x < constant.config.edge.right - 5) {
      state.cannon.x += constant.config.cannon.speed.x;
    }
  }
};

const update_cannon = (game, state) => {
  if (state.cannon.state.kind == constant.CANNON_DYING) {
    if (state.frames > state.cannon.state.changed_at + 80) {
      if (state.cannon.life == 0) {
        state.kind = constant.GAME_PLAYER_DEFEATED;
        state.changed_at = state.frames;
      }
      state.cannon.state.kind = constant.CANNON_ALIVE;
    }

    if (state.frames % 8 == 0 || false) {
      state.cannon.current_char++;
      state.cannon.current_char %= state.cannon.char.length;
    }
  }
};

export const proc = (game, state) => {
  move_cannon(game, state);
  update_cannon(game, state);
};

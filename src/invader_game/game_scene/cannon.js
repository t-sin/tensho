const constant = require('./constant.js');

const move_cannon = (game, state) => {
  if (game.input.left && state.cannon.x > constant.config.edge.left - 5) {
    state.cannon.x -= constant.config.cannon.speed.x;
  }

  if (game.input.right && state.cannon.x < constant.config.edge.right - 5) {
    state.cannon.x += constant.config.cannon.speed.x;
  }
};

export const proc = (game, state) => {
  move_cannon(game, state);
};

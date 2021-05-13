const constant = require('./constant.js');
const state = require('./state.js');
const draw = require('./draw.js');

export const make_game_scene = (game) => {
  game.conf = constant.config;
  let game_state = state.setup_state();

  const fn = () => {
    draw.draw(game, game_state);
    //proc(game, game_state);

    //window.requestAnimationFrame(fn);
  };
  return fn;
};

const constant = require('./constant.js')
const state = require('./state.js')

export const make_game_scene = (game) => {
  game.conf = constant.config;
  let game_state = state.setup_state(game);

  const fn = () => {
    //draw(game, game_state);
    //proc(game, game_state);

    window.requestAnimationFrame(fn);
  };
  return fn;
};

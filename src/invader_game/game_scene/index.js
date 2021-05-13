const constant = require('./constant.js');
const state = require('./state.js');
const draw = require('./draw.js');
//const cannon = require('./cannon.js');
const invader = require('./invader.js');

export const make_game_scene = (game) => {
  let game_state = state.setup_state();

  const fn = () => {
    draw.proc(game, game_state);
    invader.proc(game, game_state);
    //proc(game, game_state);

    //window.requestAnimationFrame(fn);
  };
  return fn;
};

const constant = require('./constant.js');
const state = require('./state.js');
const draw = require('./draw.js');
const cannon = require('./cannon.js');
const invader = require('./invader.js');

export const make_game_scene = (game) => {
  let game_state = state.setup_state();

  const frame_fn = () => {
    draw.proc(game, game_state);
    cannon.proc(game, game_state);
    invader.proc(game, game_state);
    game_state.frames++;

    window.requestAnimationFrame(frame_fn);
  };
  return frame_fn;
};

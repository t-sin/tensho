const constant = require('./constant.js');
const state = require('./state.js');
const draw = require('./draw.js');
const cannon = require('./cannon.js');
const invader = require('./invader.js');
const shot = require('./shot.js');

const proc = (game, state) => {

  switch (state.kind) {
  case constant.GAME_INITIALIZING:
    state.kind = constant.GAME_PLAYING;
    break;

  case constant.GAME_PLAYING:
    draw.proc(game, state);

    cannon.proc(game, state);
    invader.proc(game, state);
    shot.proc(game, state);
    break;

  case constant.PLAYDER_WON:
    break;

  case constant.PLAYDER_DEFEATED:
    break;
  }

  state.frames++;
};

export const make_game_scene = (game) => {
  let game_state = state.setup_state();

  const frame_fn = () => {
    proc(game, game_state);
    window.requestAnimationFrame(frame_fn);
  };

  return frame_fn;
};

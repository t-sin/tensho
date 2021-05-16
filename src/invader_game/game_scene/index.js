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
    if (state.cannon.state.kind == constant.CANNON_ALIVE) {
      invader.proc(game, state);
    }
    shot.proc(game, state);
    break;

  case constant.GAME_PLAYER_WON:
    break;

  case constant.GAME_PLAYER_DEFEATED:
    const message = 'G  A  M  E    O  V  E  R';

    game.ctx.fillStyle = '#eee';
    game.ctx.fillRect(210, 230, 200, 28);

    game.ctx.font = '20px Noto Sans JP';
    game.ctx.fillStyle = '#000';
    const elapsed = state.frames - state.changed_at;
    const m = message.slice(0, Math.floor(elapsed / 20));
    game.ctx.fillText(m, 210 + 10, 230 + 23);
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

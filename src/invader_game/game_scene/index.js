const constant = require('./constant.js');
const state = require('./state.js');
const draw = require('./draw.js');
const cannon = require('./cannon.js');
const invader = require('./invader.js');
const shot = require('./shot.js');
const ufo = require('./ufo.js');

const proc = (game, game_state) => {
  switch (game_state.kind) {
  case constant.GAME_INITIALIZING:
    draw.proc(game, game_state);
    invader.init(game, game_state);
    break;

  case constant.GAME_PLAYING:
    draw.proc(game, game_state);

    cannon.proc(game, game_state);
    if (game_state.cannon.state.kind == constant.CANNON_ALIVE) {
      invader.proc(game, game_state);
    }
    ufo.proc(game, game_state);
    shot.proc(game, game_state);
    break;

  case constant.GAME_PLAYER_WON:
    draw.proc(game, game_state);

    invader.proc(game, game_state);
    shot.proc(game, game_state);

    if (game_state.frames > game_state.changed_at + 100) {
      let new_state = state.setup_state();
      new_state.cannon.life = game_state.cannon.life;
      // new_state.score = game_state.score;
      new_state.kind = constant.GAME_INITIALIZING;
      return new_state;
    }

    break;

  case constant.GAME_PLAYER_DEFEATED:
    const message = 'G  A  M  E    O  V  E  R';

    game.ctx.fillStyle = '#eee';
    game.ctx.fillRect(210, 230, 200, 28);

    game.ctx.font = '20px Noto Sans JP';
    game.ctx.fillStyle = '#000';
    const elapsed = game_state.frames - game_state.changed_at;
    const m = message.slice(0, Math.floor(elapsed / 10));
    game.ctx.fillText(m, 210 + 10, 230 + 23);

    if (game_state.frames > game_state.changed_at + 300) {
      game_state.go_title = true;
    }

    break;
  }

  game_state.frames++;
  return null;
};

export const make_scene = (game) => {
  game.state = state.setup_state();

  const frame_fn = () => {
    let new_state = proc(game, game.state);
    if (new_state != null) {
      game.state = new_state;
    }

    if (game.state.go_title) {
      game.go_title_scene(game);
    }
  };

  return frame_fn;
};

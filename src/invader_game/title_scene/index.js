const logo = require('./logo.js');


const char1 = '一二三四五六七八九文字渦';

const setup_state = () => {
  let state = {
    frames: 0,
    char: char1,
    char_pos: 1,
    disp_v: 1,
    ready: false,
  };

  return state;
};

const nf = new Intl.NumberFormat("ja-JP-u-nu-hanidec", {minimumIntegerDigits: 5, useGrouping: false});

const draw = (game, state) => {
  game.ctx.clearRect(0, 0, game.canvas.width, game.canvas.height);
  const { ox, oy } = { ox: 60, oy: 50 };
  game.ctx.font = '6px Noto Serif JP';
  game.ctx.fillStyle = '#000';

  for (let j = 0; j < logo.data.length; j++) {
    for (let i = 0; i < logo.data[0].length; i++) {
      const v = logo.data[j][i];
      if (v == 0) continue;
      if (state.disp_v != -1 && v != state.disp_v) continue;

      let ch = state.char[state.char_pos];

      const { x, y } = {
        x: ox + i * 6,
        y: oy + j * 6,
      };
      game.ctx.fillText(ch, x, y);
    }
  }

  if (state.ready) {
    game.ctx.font = '15px Noto Serif JP';
    game.ctx.fillText(`I d e o g r a p h i c   S p a c e   I n v a d e r s`, 170, 330);

    game.ctx.font = '15px Noto Serif JP';
    game.ctx.fillText(`最高得点　${nf.format(game.hiscore)}`, 250, 380);
    if (Math.sin(state.frames / 15) > 0) {
      game.ctx.fillText(`Press J key`, 250, 400);
    }
  }
};

const scene1 = 5 * 11 * 2;
const scene2 = 5 * 10;

const proc = (game, state) => {
  if (state.frames < scene1) {
    if (state.frames % 5 == 0) {
      state.disp_v = (state.disp_v + 1) % 11;
    }
  }

  if (state.frames >= scene1 && state.frames < scene1 + scene2) {
    state.disp_v = -1;
    if (state.frames % 5 == 0) {
      //state.disp_v = state.disp_v == -1 ? 0 : -1;
      state.char_pos = (state.char_pos + 1) % char1.length;
    }
  }

  if (state.frames >= scene1 + scene2) {
    state.ready = true;
    if (game.input.shot) {
      return true;
    }
  }

  state.frames++;
  return false;
};

export const make_scene = (game) => {
  game.state = setup_state();

  const frame_fn = () => {
    draw(game, game.state);
    const next = proc(game, game.state)

    if (next) {
      game.go_game_scene(game);
    }
  };

  return frame_fn;
};

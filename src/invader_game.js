const setup_state = () => {
  let state = {};

  // initialize invaders
  state.invaders = []
  const topleft_x = 120;
  const topleft_y = 100;
  for (let y = 0; y < 5; y++) {
    let row = [];
    for (let x = 0; x < 11; x++) {
      const invader = {
        x: topleft_x + 35 * x,
        y: topleft_y + 35 * y,
        ch: '閏闖闡闕闊'[y],
        enable: true,
      };
      row.push(invader);
    }
    state.invaders.push(row);
  }
  return state;
};

const draw_ground = (game, state) => {
  game.ctx.strokeStyle = '#444';
  game.ctx.lineWidth = 1;
  game.ctx.beginPath();
  game.ctx.moveTo(60, 440.5);
  game.ctx.lineTo(580, 440.5);
  game.ctx.stroke();
};

const draw_canon = (game, state) => {
  game.ctx.font = '25px Noto Sans JP';
  game.ctx.fillStyle = '#000';
  game.ctx.fillText('凸', 320, 430);
};

const draw_torchka = (game, state) => {
  game.ctx.font = '40px Noto Sans JP';
  game.ctx.fillStyle = '#000';
  for (let n = 0; n < 4; n++) {
    game.ctx.fillText('門', 120 + 120 * n, 380);
  }
};

const draw_invaders = (game, state) => {
  game.ctx.font = '25px Noto Sans JP';
  game.ctx.fillStyle = '#000';
  for (let row of state.invaders) {
    for (let invader of row) {
      if (invader.enable) {
        game.ctx.fillText(invader.ch, invader.x, invader.y);
      }
    }
  }
};

const draw_ufo = (game, state) => {
  game.ctx.font = '18px Noto Sans JP';
  game.ctx.fillStyle = '#000';
  game.ctx.fillText('円城', 100, 50);
};

const draw = (game, state) => {
  game.ctx.clearRect(0, 0, game.canvas.width, game.canvas.height);
  draw_ground(game, state);
  draw_canon(game, state);
  draw_torchka(game, state);
  draw_invaders(game, state);
  draw_ufo(game, state);
};

export const make_invader_scene = (game) => {
  let state = setup_state();

  const proc = () => {
    draw(game, state);

    window.requestAnimationFrame(proc);
  };
  return proc;
};

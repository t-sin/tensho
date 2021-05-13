const constant = require('./constant.js');

const draw_ground = (game, state) => {
  game.ctx.strokeStyle = '#444';
  game.ctx.lineWidth = 1;
  game.ctx.beginPath();
  const y = game.conf.edge_bottom + 0.5;
  game.ctx.moveTo(60, y);
  game.ctx.lineTo(580, y);
  game.ctx.stroke();
};

const draw_cannon = (game, state) => {
  game.ctx.font = '25px Noto Sans JP';
  game.ctx.fillStyle = '#000';
  game.ctx.fillText('凸', state.cannon.x - 5, state.cannon.y);

  if (game.debug) {
    const { x, y } = constant.config.cannon.hit.offset;
    game.ctx.fillStyle = 'rgba(255, 0, 0, 0.2)';
    game.ctx.fillRect(
      state.cannon.x - x, state.cannon.y - y,
      constant.config.cannon.hit.width, 5);
  }
};

const draw_cannon_shot = (game, state) => {
  game.ctx.font = '25px Noto Sans JP';
  game.ctx.fillStyle = '#000';
  const cx = state.cannon.shot.x - 5;
  const cy = state.cannon.shot.y + 25;

  switch (state.cannon.shot.state.kind) {
    case constant.CANNON_SHOT_MOVING:
      game.ctx.fillText('｜', cx, cy);
      break;
    case constant.CANNON_SHOT_DYING:
      game.ctx.fillText('⺣', cx, cy);
      break;
  }
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

  for (let row of state.invaders.array) {
    for (let invader of row) {
      game.ctx.fillStyle = '#000';
      if (invader.state.kind == constant.INVADER_ALIVE) {
        console.log(invader);
        const ch = invader.char[invader.current_char];
        game.ctx.fillText(ch, invader.x, invader.y);
        game.ctx.fillStyle = 'rgba(255, 0, 0, 0.2)';

        if (game.debug) {
          const { x, y } = constant.config.cannon.hit.offset;
          game.ctx.fillRect(invader.x + x, invader.y, constant.config.cannon.hit.width, 5);
        }

      } else if (invader.state == constant.INVADER_DYING) {
        let ch;
        if (state.frames < invader.started_at + 5) {
          ch = '＊';
        } else {
          ch = '⁂';
        }
        game.ctx.fillText(ch, invader.x, invader.y);
      }
    }
  }
};

const draw_ufo = (game, state) => {
  game.ctx.font = '18px Noto Sans JP';
  game.ctx.fillStyle = '#000';
  //game.ctx.fillText('円城', 100, 50);
};

const draw_debug = (game, state) => {
  game.ctx.strokeStyle = 'rgba(255, 0, 0, 0.2)';

  game.ctx.beginPath();
  game.ctx.moveTo(constant.config.edge.right + 0.5, 0);
  game.ctx.lineTo(constant.config.edge.right + 0.5, 500);
  game.ctx.stroke();

  game.ctx.beginPath();
  game.ctx.moveTo(constant.config.edge.left + 0.5, 0);
  game.ctx.lineTo(constant.config.edge.left + 0.5, 500);
  game.ctx.stroke();

  game.ctx.font = '12px Noto Sans JP';
  game.ctx.fillStyle = 'rgba(255, 0, 0, 1)';
  game.ctx.fillText(`key: left=${game.input.left}
right=${game.input.right}
shot=${game.input.shot}`, 0, 10);

  game.ctx.fillText(`num=${state.number_of_invaders}`, 570, 10);
};

export const draw = (game, state) => {
  game.ctx.clearRect(0, 0, game.canvas.width, game.canvas.height);
  draw_ground(game, state);
  draw_cannon(game, state);
  draw_cannon_shot(game, state);
  draw_torchka(game, state);
  draw_invaders(game, state);
  draw_ufo(game, state);

  if (game.debug) {
    draw_debug(game, state);
  }
};

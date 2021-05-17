const constant = require('./constant.js');

const draw_ground = (game, state) => {
  game.ctx.strokeStyle = '#444';
  game.ctx.lineWidth = 1;
  game.ctx.beginPath();
  const y = constant.config.edge.bottom + 0.5;
  game.ctx.moveTo(60, y);
  game.ctx.lineTo(580, y);
  game.ctx.stroke();
};

const draw_cannon = (game, state) => {
  game.ctx.font = '25px Noto Sans JP';
  game.ctx.fillStyle = '#000';

  let ch;
  if (state.cannon.state.kind == constant.CANNON_ALIVE) {
    ch = constant.cannon_alive_anim_pattern;
  } else if (state.cannon.state.kind == constant.CANNON_DYING) {
    ch = constant.cannon_dying_anim_pattern[state.cannon.current_char];
  }

  game.ctx.fillText(ch, state.cannon.x - 5, state.cannon.y);

  if (game.debug) {
    const { x, y } = constant.cannon.hit.offset;
    game.ctx.fillStyle = 'rgba(255, 0, 0, 0.2)';
    game.ctx.fillRect(
      state.cannon.x + constant.cannon.hit.offset.x,
      state.cannon.y - constant.cannon.hit.offset.y,
      constant.cannon.hit.width, 25);
  }
};

const draw_cannon_shot = (game, state) => {
  game.ctx.font = '25px Noto Sans JP';
  game.ctx.fillStyle = '#000';
  const cx = state.cannon.shot.x - 5;
  const cy = state.cannon.shot.y + 10;

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
  game.ctx.font = '3px Noto Sans JP';
  game.ctx.fillStyle = '#000';

  for (let torchka of state.torchka.array) {
    for (let row of torchka) {
      for (let dot of row) {
        if (game.debug) {
          game.ctx.fillStyle = '#000';
        }

        const ch = constant.torchka_pattern[dot.j][dot.i];
        game.ctx.fillText(ch, dot.x, dot.y);
        game.ctx.fillText(ch, dot.x, dot.y);

        if (game.debug) {
          game.ctx.fillStyle = 'rgba(255, 0, 0, 0.2)';
          game.ctx.fillRect(dot.x, dot.y - 3, 3, 3);
        }
      }
    }
  }
};

const draw_invaders = (game, state) => {
  game.ctx.font = '25px Noto Sans JP';

  for (let invader of state.invaders.array) {
    game.ctx.fillStyle = '#000';
    if (invader.state.kind == constant.INVADER_ALIVE) {
      const ch = invader.char[invader.current_char];
      game.ctx.fillText(ch, invader.x, invader.y);

      if (game.debug) {
        game.ctx.fillStyle = 'rgba(255, 0, 0, 0.2)';
        const { x, y } = constant.invaders.hit.offset;
        game.ctx.fillRect(invader.x + x, invader.y - y, constant.cannon.hit.width, 25);
      }

    } else if (invader.state.kind == constant.INVADER_DYING) {
      let ch;
      if (state.frames < invader.state.changed_at + 8) {
        ch = '＊';
      } else {
        ch = '⁂';
      }
      game.ctx.fillText(ch, invader.x, invader.y);
    }
  }
};

const draw_invader_shots = (game, state) => {
  game.ctx.font = '25px Noto Sans JP';
  game.ctx.fillStyle = '#000';

  for (let shot of state.invaders.shot) {
    let ch;
    const { x, y } = constant.invaders.shot.hit.offset;
    let sx = shot.x;
    let sy = shot.y + 10;

    if (shot.state.kind == constant.INVADER_SHOT_MOVING) {
      ch = shot.char[shot.current_char];
      sx += x;

    } else if (shot.state.kind == constant.INVADER_SHOT_DYING) {
      ch = '⺌';
    } else {
      ch = '';
    }

    game.ctx.fillText(ch, sx, sy);
  }
};

const draw_ufo = (game, state) => {
  const ufo = state.ufo;
  let { x, y } = ufo;
  let s;

  switch (ufo.state.kind) {
  case constant.UFO_ALIVE:
    s = constant.ufo.str[ufo.type];

    if (game.debug) {
      game.ctx.fillStyle = 'rgba(255, 0, 0, 0.2)';
      const { x: ox , y: oy } = constant.ufo.hit.offset;
      const { w, h } = constant.ufo.hit.size;
      game.ctx.fillRect(x + ox, y + oy, w, h);
    }

    break;

  case constant.UFO_DYING:
    s = constant.ufo_dying_anim_pattern;
    break;

  default:
    s = '';
  }

  game.ctx.font = '18px Noto Sans JP';
  game.ctx.fillStyle = '#000';
  game.ctx.fillText(s, x, y);
};

const nf = new Intl.NumberFormat("ja-JP-u-nu-hanidec", {minimumIntegerDigits: 5, useGrouping: false});
const draw_ui = (game, state) => {
  game.ctx.font = '23px Noto Sans JP';
  game.ctx.fillStyle = '#000';
  game.ctx.fillText('凸', constant.config.edge.left, constant.config.edge.bottom + 25);
  game.ctx.font = '18px Noto Sans JP';
  let s = ` × ${state.cannon.life}`;
  game.ctx.fillText(s, constant.config.edge.left + 30, constant.config.edge.bottom + 25);

  const score = nf.format(state.score);
  const hiscore = nf.format(game.hiscore);

  s = `得点 ${score}　最高得点 ${hiscore}`
  game.ctx.fillText(s, constant.config.edge.right - 320, constant.config.edge.bottom + 25);
};

const draw_debug = (game, state) => {
  game.ctx.strokeStyle = 'rgba(255, 0, 0, 0.2)';

  game.ctx.beginPath();
  game.ctx.moveTo(constant.config.edge.left, constant.config.edge.top + 0.5);
  game.ctx.lineTo(constant.config.edge.right, constant.config.edge.top + 0.5);
  game.ctx.stroke();

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

  game.ctx.fillText(`num=${state.invaders.number_of_alive} frames=${state.frames}`, 500, 10);

  const left = state.debug.invaders.alive.most_left;
  const right = state.debug.invaders.alive.most_right;
  const bottom = state.debug.invaders.alive.most_bottom;
  if (left == null) {
    game.ctx.fillText(`most_left=null`, 0, 22);
  } else {
    game.ctx.fillText(`most_left=(${left.i}, ${left.j})`, 0, 22);
  }
  if (right == null) {
    game.ctx.fillText(`most_right=null`, 0, 34);
  } else {
    game.ctx.fillText(`most_right=(${right.i}, ${right.j})`, 0, 34);
  }
  if (bottom == null) {
    game.ctx.fillText(`most_bottom=null`, 0, 46);
  } else {
    game.ctx.fillText(`most_bottom=(${bottom.i}, ${bottom.j})`, 0, 46);
  }

  let s = state.debug.invaders.alive.lefts.reduce((acc, e) => (
    acc + (e == null ? 'null, ' : `(${e.i} ${e.j}) `)
  ), 'lefts=[') + ']';
  game.ctx.fillText(s, 0, 58);
  s = state.debug.invaders.alive.rights.reduce((acc, e) => (
    acc + (e == null ? 'null, ' : `(${e.i} ${e.j}) `)
  ), 'rights=[') + ']';
  game.ctx.fillText(s, 0, 70);
  s = state.debug.invaders.alive.bottoms.reduce((acc, e) => (
    acc + (e == null ? 'null, ' : `(${e.i} ${e.j}) `)
  ), 'bottoms=[') + ']';
  game.ctx.fillText(s, 0, 82);
};

export const proc = (game, state) => {
  game.ctx.clearRect(0, 0, game.canvas.width, game.canvas.height);
  draw_ground(game, state);
  draw_cannon(game, state);
  draw_cannon_shot(game, state);
  draw_torchka(game, state);
  draw_invaders(game, state);
  draw_invader_shots(game, state);
  draw_ufo(game, state);
  draw_ui(game, state);

  if (game.debug) {
    draw_debug(game, state);
  }
};

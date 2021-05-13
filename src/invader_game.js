const setup_state = (game) => {
  let state = {
    frame_count: 1,
  };

  // initialize invaders
  state.invader_index = { x: 0, y: 0 };
  state.invaders = []
  state.move_to_right = true;
  state.number_of_invaders = 0;

  for (let y = 0; y < game.conf.rows; y++) {
    let row = [];
    for (let x = 0; x < game.conf.columns; x++) {
      const invader = {
        x: game.conf.initial_topleft_x + game.conf.initial_space_x * x,
        y: game.conf.initial_topleft_y + game.conf.initial_space_y * (5 - y),
        ch: '閏闖闡闕闊'[y],
        enabled: true,
      };
      row.push(invader);
      state.number_of_invaders++;
    }
    state.invaders.push(row);
  }
  return state;
};

const current_invader = (state) => {
  const { x, y } = state.invader_index;
  return state.invaders[y][x];
};

const is_last_invader = (game, state) => {
  const { x, y } = state.invader_index;
  return x == game.conf.columns - 1 && y == game.conf.rows - 1;
};

const move_all_invaders_down = (game, state) => {
  state.invaders.flat().forEach((i) => { i.y += game.conf.invader_move_speed_y });
};

const most_right_x = (game, state) => {
  for (let y = 0; y < game.conf.rows; y++) {
    for (let x = game.conf.columns - 1; x >= 0; x--) {
      if (state.invaders[y][x].enabled) {
        return state.invaders[y][x].x;
      }
    }
  }
};

const most_left_x = (game, state) => {
  for (let y = game.conf.rows - 1; y >= 0; y--) {
    for (let x = 0; x < game.conf.columns; x++) {
      if (state.invaders[y][x].enabled) {
        return state.invaders[y][x].x;
      }
    }
  }
};

const move_invader = (game, state) => {
  let invader = current_invader(state);

  if (state.move_to_right) {
    invader.x += game.conf.invader_move_speed_x;
    const x = most_right_x(game, state);

    if (is_last_invader(game, state) && x + 15 > game.conf.edge_right) {
      state.move_to_right = false;
      move_all_invaders_down(game, state);
    }

  } else {
    invader.x -= game.conf.invader_move_speed_x;
    const x = most_left_x(game, state);
    if (is_last_invader(game, state) && x + 5 < game.conf.edge_left) {
      state.move_to_right = true;
      move_all_invaders_down(game, state);
    }
  }
};

const update_invader_index = (game, state) => {
  const next_x = state.invader_index.x + 1;

  if (next_x < game.conf.columns) {
    state.invader_index.x = next_x;
  } else {
    state.invader_index.x = 0;
    state.invader_index.y = (state.invader_index.y + 1) % game.conf.rows;
  }
};

const proceed_invader_index = (game, state) => {
  if (current_invader(state).enabled) {
    update_invader_index(game, state);
  }

  while (!current_invader(state).enabled) {
    if (state.number_of_invaders <= 0) {
      break;
    }
    update_invader_index(game, state);
  }
};

const proc = (game, state) => {
  if (state.frame_count % game.conf.move_per_frames == 0) {
    move_invader(game, state);
    proceed_invader_index(game, state);
  }

  state.frame_count++;
};

const draw_ground = (game, state) => {
  game.ctx.strokeStyle = '#444';
  game.ctx.lineWidth = 1;
  game.ctx.beginPath();
  game.ctx.moveTo(60, 440.5);
  game.ctx.lineTo(580, 440.5);
  game.ctx.stroke();
};

const draw_cannon = (game, state) => {
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
      if (invader.enabled) {
        game.ctx.fillText(invader.ch, invader.x, invader.y);
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
  game.ctx.moveTo(game.conf.edge_right + 0.5, 0);
  game.ctx.lineTo(game.conf.edge_right + 0.5, 500);
  game.ctx.stroke();

  game.ctx.beginPath();
  game.ctx.moveTo(game.conf.edge_left + 0.5, 0);
  game.ctx.lineTo(game.conf.edge_left + 0.5, 500);
  game.ctx.stroke();

  game.ctx.font = '12px Noto Sans JP';
  game.ctx.fillStyle = 'rgba(255, 0, 0, 1)';
  game.ctx.fillText(`key: left=${game.input.left} right=${game.input.right} space=${game.input.space}`, 0, 10);
};

const draw = (game, state) => {
  game.ctx.clearRect(0, 0, game.canvas.width, game.canvas.height);
  draw_ground(game, state);
  draw_cannon(game, state);
  draw_torchka(game, state);
  draw_invaders(game, state);
  draw_ufo(game, state);

  if (game.debug) {
    draw_debug(game, state);
  }
};

export const make_invader_scene = (game) => {
  let state = setup_state(game);

  const fn = () => {
    draw(game, state);
    proc(game, state);

    window.requestAnimationFrame(fn);
  };
  return fn;
};

const CANNON_SHOT_DISABLED = 'disable';
const CANNON_SHOT_MOVING = 'moving';
const CANNON_SHOT_DYING = 'dying';
const INVADER_DISABLED = 'disabled';
const INVADER_ALIVE = 'alive';
const INVADER_DYING = 'dying';

const invader_anim_pattern = [
  "余全",
  "余全",
  "余全",
  "余全",
  "余全",
];

const setup_state = (game) => {
  let state = {
    frame_count: 1,
  };

  // initialize cannon
  state.cannon_x = game.conf.initial_cannon_x;
  state.cannon_shot = { x: 0, y: 0, state: CANNON_SHOT_DISABLED, on_state: 0 };

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
        char: invader_anim_pattern[y],
        current_char: 0,
        state: INVADER_ALIVE,
        started_at: 0,
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
      if (state.invaders[y][x].state == INVADER_ALIVE) {
        return state.invaders[y][x].x;
      }
    }
  }
};

const most_left_x = (game, state) => {
  for (let y = game.conf.rows - 1; y >= 0; y--) {
    for (let x = 0; x < game.conf.columns; x++) {
      if (state.invaders[y][x].state == INVADER_ALIVE) {
        return state.invaders[y][x].x;
      }
    }
  }
};

const move_invader = (game, state) => {
  let invader = current_invader(state);

  invader.current_char = (invader.current_char + 1) % invader.char.length;

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
  if (current_invader(state).state == INVADER_ALIVE) {
    update_invader_index(game, state);
  }

  while (current_invader(state).state != INVADER_ALIVE) {
    if (state.number_of_invaders <= 0) {
      break;
    }
    update_invader_index(game, state);
  }
};

const proc_dying_invaders = (game, state) => {
  for (let y = 0; y < game.conf.rows; y++) {
    for (let x = 0; x < game.conf.columns; x++) {
      let invader = state.invaders[y][x];

      if (invader.state == INVADER_DYING) {
        if (state.frame_count > invader.started_at + 8) {
          invader.state = INVADER_DISABLED;
        }
      }
    }
  }
};

const move_cannon = (game, state) => {
  if (game.input.left) {
    state.cannon_x -= game.conf.cannon_speed_x;
  }

  if (game.input.right) {
    state.cannon_x += game.conf.cannon_speed_x;
  }
};

const move_cannon_shot = (game, state) => {
  let shot = state.cannon_shot;
  if (game.input.shot && shot.state == CANNON_SHOT_DISABLED) {
    shot.x = state.cannon_x;
    shot.y = game.conf.initial_cannon_y - 35;
    shot.state = CANNON_SHOT_MOVING;
  }

  switch (shot.state) {
    case CANNON_SHOT_MOVING:
    shot.y -= 10;
    if (shot.y < game.conf.edge_top - 35) {
      shot.state = CANNON_SHOT_DYING;
      shot.on_state = state.frame_count;
    }
    break;

    case CANNON_SHOT_DYING:
      if (state.frame_count > shot.on_state + 10) {
        shot.state = CANNON_SHOT_DISABLED;
      }
    break;
  }
};

const proc = (game, state) => {
  move_cannon(game, state);
  move_cannon_shot(game, state);

  // dying test
  //if (state.frame_count == 100) {
  //  state.invaders[2][5].state = INVADER_DYING;
  //  state.invaders[2][5].started_at = state.frame_count;
  //}

  proc_dying_invaders(game, state);
  if (state.frame_count % game.conf.invader_move_per_frames == 0) {
    move_invader(game, state);
    proceed_invader_index(game, state);
  }

  state.frame_count++;
};

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
  game.ctx.fillText('凸', state.cannon_x - 5, game.conf.initial_cannon_y);
};

const draw_cannon_shot = (game, state) => {
  game.ctx.font = '25px Noto Sans JP';
  game.ctx.fillStyle = '#000';
  const x = state.cannon_shot.x - 5;
  const y = state.cannon_shot.y + 25;

  switch (state.cannon_shot.state) {
    case CANNON_SHOT_MOVING:
      game.ctx.fillText('｜', x, y);
      break;
    case CANNON_SHOT_DYING:
      game.ctx.fillText('⺣', x, y);
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
  game.ctx.fillStyle = '#000';

  for (let row of state.invaders) {
    for (let invader of row) {
      if (invader.state == INVADER_ALIVE) {
        game.ctx.fillText(invader.char[invader.current_char], invader.x, invader.y);

      } else if (invader.state == INVADER_DYING) {
        let ch;
        if (state.frame_count < invader.started_at + 5) {
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
  game.ctx.moveTo(game.conf.edge_right + 0.5, 0);
  game.ctx.lineTo(game.conf.edge_right + 0.5, 500);
  game.ctx.stroke();

  game.ctx.beginPath();
  game.ctx.moveTo(game.conf.edge_left + 0.5, 0);
  game.ctx.lineTo(game.conf.edge_left + 0.5, 500);
  game.ctx.stroke();

  game.ctx.font = '12px Noto Sans JP';
  game.ctx.fillStyle = 'rgba(255, 0, 0, 1)';
  game.ctx.fillText(`key: left=${game.input.left} right=${game.input.right} space=${game.input.shot}`, 0, 10);
};

const draw = (game, state) => {
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

export const make_invader_scene = (game) => {
  let state = setup_state(game);

  const fn = () => {
    draw(game, state);
    proc(game, state);

    window.requestAnimationFrame(fn);
  };
  return fn;
};

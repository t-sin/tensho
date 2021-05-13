const constant = require('./constant.js');

export const setup_state = (game) => {
  let state = {
    frames: 1,
  };

  state.cannon = {
    x: game.conf.cannon.initial.x,
    y: game.conf.cannon.initial.y,
    shot: {
      x: 0, y: 0,
      state: {
        kind: constant.CANNON_SHOT_DISABLED,
        changed_at: 0,
      },
    },
  };

  state.invaders = {
    array: [],
    number_of_alive: 0,
    current: { i: 0, j: 0 },
    direction_right: true,
  };

  const ix = game.conf.invaders.initial.topleft.x;
  const iy = game.conf.invaders.initial.topleft.y;

  for (let j = 0; j < game.conf.rows; j++) {
    let row = [];
    for (let i = 0; i < game.conf.columns; i++) {
      const invader = {
        x: ix + game.conf.invaders.initial.offset.x * i,
        y: iy + game.conf.invaders.initial.offset.y * (5 - j),
        char: constant.invader_anim_pattern[j],
        current_char: 0,
        state: {
          kind: constant.INVADER_ALIVE,
          changed_at: 0,
        },
      };
      row.push(invader);
      state.invaders.number_of_alive++;
    }
    state.invaders.array.push(row);
  }

  console.table(state);
  return state;
};

const constant = require('./constant.js');

export const setup_state = () => {
  let state = {
    frames: 1,
  };

  state.cannon = {
    x: constant.config.cannon.initial.x,
    y: constant.config.cannon.initial.y,
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

  const ix = constant.config.invaders.initial.topleft.x;
  const iy = constant.config.invaders.initial.topleft.y;

  for (let j = 0; j < constant.config.rows; j++) {
    for (let i = 0; i < constant.config.columns; i++) {
      const invader = {
        x: ix + constant.config.invaders.initial.offset.x * i,
        y: iy + constant.config.invaders.initial.offset.y * (5 - j),
        char: constant.invader_anim_pattern[j],
        current_char: 0,
        state: {
          kind: constant.INVADER_ALIVE,
          changed_at: 0,
        },
      };
      state.invaders.array.push(invader);
      state.invaders.number_of_alive++;
    }

  }

  console.table(state);
  return state;
};

export const current_invader = (state) => {
  const { i, j } = state.invaders.current;
  return state.invaders.array[j][i];
};

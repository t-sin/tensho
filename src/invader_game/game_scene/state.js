const constant = require('./constant.js');

export const setup_state = () => {
  let state = {
    frames: 1,
    score: 0,

    kind: constant.GAME_INITIALIZING,
    changed_at: 0,

    go_title: false,
  };

  state.ufo = {
    x: 0, y: constant.ufo.initial.y,
    type: 1,
    score: {
      ptr: -1,
      table: constant.score.ufo,
    },
    current_char: 0,
    state: {
      kind: constant.UFO_DISABLED,
      changed_at: 0,
    },
  };

  state.cannon = {
    life: 3,
    x: constant.cannon.initial.x,
    y: constant.cannon.initial.y,
    char: constant.cannon_alive_anim_pattern,
    current_char: 0,
    state: {
      kind: constant.CANNON_ALIVE,
      changed_at: 0,
    },
    shot: {
      x: 0, y: 0,
      state: {
        kind: constant.CANNON_SHOT_DISABLED,
        changed_at: 0,
      },
    },
  };

  state.torchka = {
    array: [],
  };

  state.invaders = {
    array: [],
    number_of_alive: 0,
    current: 0,
    direction_right: true,
    shot: [],
  };

  const ix = constant.invaders.initial.topleft.x;
  const iy = constant.invaders.initial.topleft.y;

  for (let j = 0; j < constant.config.rows; j++) {
    for (let i = 0; i < constant.config.columns; i++) {
      const n = Math.floor(Math.random() * constant.invader_shot_anim_pattern.length);
      const invader = {
        x: ix + constant.invaders.initial.offset.x * i,
        y: iy + constant.invaders.initial.offset.y * (5 - j),
        char: constant.invader_anim_pattern[j],
        current_char: 0,
        state: {
          kind: constant.INVADER_DISABLED,
          changed_at: 0,
        },
        to_shot: Math.floor(Math.random() * 200 + 50),
      };
      state.invaders.array.push(invader);

      if (j == 0) {
        const shot = {
          x: 0, y: 0,
          char: constant.invader_shot_anim_pattern[n],
          current_char: 0,
          state: {
            kind: constant.INVADER_SHOT_DISABLED,
            changed_at: 0,
          },
        };
        state.invaders.shot.push(shot);
      }
    }
  }

  state.debug = {
    invaders: {
      alive: {
        most_left: { i: -1, j: -1 },
        most_right: { i: -1, j: -1 },
        lefts: [],
        rights: [],
        bottoms: [],
      }
    }
  };

  return state;
};

export const current_invader = (state) => {
  const { i, j } = state.invaders.current;
  return state.invaders.array[j][i];
};

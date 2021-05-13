const constant = require('./constant.js');

const move_cannon = (game, state) => {
  if (game.input.left && state.cannon.x > constant.config.edge.left - 5) {
    state.cannon.x -= constant.config.cannon.speed.x;
  }

  if (game.input.right && state.cannon.x < constant.config.edge.right - 5) {
    state.cannon.x += constant.config.cannon.speed.x;
  }
};

const move_cannon_shot = (game, state) => {
  let shot = state.cannon.shot;
  if (game.input.shot && shot.state.kind == constant.CANNON_SHOT_DISABLED) {
    shot.x = state.cannon.x;
    shot.y = state.cannon.y - 35;
    shot.state.kind = constant.CANNON_SHOT_MOVING;
  }

  switch (shot.state.kind) {
    case constant.CANNON_SHOT_MOVING:
    shot.y -= 10;
    if (shot.y < constant.config.edge.top - 35) {
      shot.state.kind = constant.CANNON_SHOT_DYING;
      shot.state.changed_at = state.frames;
    }
    break;

    case constant.CANNON_SHOT_DYING:
      if (state.frames > shot.state.changed_at + 10) {
        shot.state.kind = constant.CANNON_SHOT_DISABLED;
      }
    break;
  }
};

export const proc = (game, state) => {
  move_cannon(game, state);
  move_cannon_shot(game, state);
};

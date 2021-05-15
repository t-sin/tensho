const constant = require('./constant.js');

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

const move_invader_shot = (game, state) => {
  for (let shot of state.invaders.shot) {
    if (shot.state.kind == constant.INVADER_SHOT_MOVING) {
      shot.y += 4;

      if (state.frames % 5 == 0) {
        shot.current_char++;
        shot.current_char %= shot.char.length;
      }

      if (shot.y > constant.config.edge.bottom) {
        shot.state.kind = constant.INVADER_SHOT_DISABLED;
      }
    }
  }
};

export const proc = (game, state) => {
  move_cannon_shot(game, state);
  move_invader_shot(game, state);
};

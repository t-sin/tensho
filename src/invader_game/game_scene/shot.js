const constant = require('./constant.js');

const move_cannon_shot = (game, state) => {
  let shot = state.cannon.shot;

  switch (shot.state.kind) {
    case constant.CANNON_SHOT_MOVING:
    if (game.input.shot && shot.state.kind == constant.CANNON_SHOT_DISABLED) {
      shot.x = state.cannon.x;
      shot.y = state.cannon.y - 35;
      shot.state.kind = constant.CANNON_SHOT_MOVING;
    }

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

      if (shot.y > constant.config.edge.bottom - constant.config.invaders.shot.hit.offset.y) {
        shot.state.kind = constant.INVADER_SHOT_DISABLED;
      }
    }
  }
};

const detect_hit_invader_shot = (game, state) => {
  let cannon = state.cannon;
  for (let shot of state.invaders.shot) {
    const shot_hit_x = shot.x + constant.config.invaders.shot.hit.offset.x;
    const shot_hit_y = shot.y;
    const cannon_hit = {
      x1: cannon.x + constant.config.cannon.hit.offset.x,
      x2: cannon.x + constant.config.cannon.hit.offset.x + constant.config.cannon.hit.width,
      y1: cannon.y - constant.config.cannon.hit.offset.y,
      y2: cannon.y - constant.config.cannon.hit.offset.y + 25,
    };

    const in_cannon_x = cannon_hit.x1 < shot_hit_x && shot_hit_x < cannon_hit.x2;
    const in_cannon_y = cannon_hit.y1 < shot_hit_y && shot_hit_y < cannon_hit.y2;
    const hit = in_cannon_x && in_cannon_y;
    console.log(in_cannon_x, in_cannon_y);

    if (hit) {
      shot.state.kind = constant.INVADER_SHOT_DISABLED;
      cannon.state.kind = constant.CANNON_DYING;
      cannon.char = constant.cannon_dying_anim_pattern;
      cannon.state.changed_at = state.frames;
    }
  }
};

export const proc = (game, state) => {
  move_cannon_shot(game, state);
  move_invader_shot(game, state);
  detect_hit_invader_shot(game, state);
};

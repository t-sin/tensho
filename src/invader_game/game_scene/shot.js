const constant = require('./constant.js');

const move_cannon_shot = (game, state) => {
  const cannon = state.cannon;
  let shot = state.cannon.shot;

  switch (shot.state.kind) {
  case constant.CANNON_SHOT_DISABLED:
    if (game.input.shot && cannon.state.kind == constant.CANNON_ALIVE) {
      shot.x = state.cannon.x;
      shot.y = state.cannon.y - 35;
      shot.state.kind = constant.CANNON_SHOT_MOVING;
      state.ufo.score.ptr = (state.ufo.score.ptr + 1) % state.ufo.score.table.length;
    }
    break;

  case constant.CANNON_SHOT_MOVING:
    shot.y -= 10;
    if (shot.y < constant.config.edge.top) {
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
    switch (shot.state.kind) {
    case constant.INVADER_SHOT_MOVING:
      shot.y += 4;

      if (state.frames % 5 == 0) {
        shot.current_char++;
        shot.current_char %= shot.char.length;
      }

      if (shot.y -  constant.invaders.shot.hit.offset.y > constant.config.edge.bottom) {
        shot.state.kind = constant.INVADER_SHOT_DISABLED;
      }
      break;

    case constant.INVADER_SHOT_DYING:
      if (state.frames > shot.state.changed_at + 10) {
        shot.state.kind = constant.INVADER_SHOT_DISABLED;
      }
      break;
    }
  }
};

const kill_cannon = (state, cannon, shot) => {
      shot.state.kind = constant.INVADER_SHOT_DISABLED;
      cannon.state.kind = constant.CANNON_DYING;
      cannon.char = constant.cannon_dying_anim_pattern;
      cannon.state.changed_at = state.frames;
      cannon.life--;
};

const detect_hit_invader_shot = (game, state) => {
  let cannon = state.cannon;
  for (let shot of state.invaders.shot) {
    if (shot.state.kind == constant.INVADER_SHOT_DISABLED) {
      continue;
    }

    const shot_hit_x = shot.x + constant.invaders.shot.hit.offset.x;
    const shot_hit_y = shot.y;
    const cannon_hit = {
      x1: cannon.x + constant.cannon.hit.offset.x,
      x2: cannon.x + constant.cannon.hit.offset.x + constant.cannon.hit.size.w,
      y1: cannon.y + constant.cannon.hit.offset.y,
      y2: cannon.y + constant.cannon.hit.offset.y + constant.cannon.hit.size.h,
    };

    const hit_x = cannon_hit.x1 < shot_hit_x && shot_hit_x < cannon_hit.x2;
    const hit_y = cannon_hit.y1 < shot_hit_y && shot_hit_y < cannon_hit.y2;

    if (hit_x && hit_y) {
      kill_cannon(state, cannon, shot);
    }
  }
};

const detect_hit_with_invader_and_cannon_shot = (state) => {
  let cannon_shot = state.cannon.shot;
  if (cannon_shot.state.kind != constant.CANNON_SHOT_MOVING) {
    return;
  }

  for (let invader_shot of state.invaders.shot) {
    if (invader_shot.state.kind != constant.INVADER_SHOT_MOVING) {
      continue;
    }

    const hit_x = Math.abs(cannon_shot.x - (invader_shot.x + 10)) < 10;
    const hit_y = Math.abs(cannon_shot.y - invader_shot.y) < 6;

    if (hit_x && hit_y) {
      cannon_shot.state.kind = constant.CANNON_SHOT_DYING;
      cannon_shot.state.changed_at = state.frames;
      invader_shot.state.kind = constant.INVADER_SHOT_DYING;
      invader_shot.state.changed_at = state.frames;
    }
  }
};

export const proc = (game, state) => {
  move_cannon_shot(game, state);
  move_invader_shot(game, state);
  detect_hit_with_invader_and_cannon_shot(state);
  detect_hit_invader_shot(game, state);
};

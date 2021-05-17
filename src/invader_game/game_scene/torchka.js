const constant = require('./constant.js');

const iterate_torchka_dots = (state, fn) => {
  for (let torchka of state.torchka.array) {
    for (let row of torchka) {
      for (let dot of row) {
        fn(state, dot);
      }
    }
  }
}

const detect_hit_with_invaders = (state, dot) => {
};

const detect_hit_invader_shot = (state, dot) => {
  const cdot = constant.torchka.dot;
  if (!dot.enabled) {
    return;
  }

  for (let shot of state.invaders.shot) {
    if (shot.state.kind != constant.INVADER_SHOT_MOVING) {
      continue;
    }

    const shot_hit = {
      x: shot.x + constant.invaders.shot.hit.offset.x,
      y: shot.y,
      w: 2,
      h: 20,
    };
    const dot_hit = {
      x: dot.x + cdot.offset.x,
      y: dot.y + cdot.offset.y,
      w: cdot.size.w,
      h: cdot.size.h,
    };

    const hit_x = dot_hit.x < shot_hit.x && shot_hit.x < dot_hit.x + dot_hit.w;
    const hit_y = dot_hit.y < shot_hit.y && shot_hit.y < dot_hit.y + dot_hit.h;

    if (hit_x && hit_y) {
      shot.state.kind = constant.INVADER_SHOT_DYING;
      shot.state.changed_at = state.frames;
      dot.enabled = false;
    }
  }
};

const detect_hit_cannon_shot = (state, dot) => {
  const cdot = constant.torchka.dot;
  if (!dot.enabled) {
    return;
  }

  let shot = state.cannon.shot;
  if (shot.state.kind != constant.CANNON_SHOT_MOVING) {
    return;
  }

  const shot_hit = {
    x: shot.x + constant.cannon.shot.hit.offset.x,
    y: shot.y,
    w: 2,
    h: 20,
  };
  const dot_hit = {
    x: dot.x + cdot.offset.x,
    y: dot.y + cdot.offset.y,
    w: cdot.size.w,
    h: cdot.size.h,
  };

  const hit_x = dot_hit.x < shot_hit.x && shot_hit.x < dot_hit.x + dot_hit.w;
  const hit_y = dot_hit.y < shot_hit.y && shot_hit.y < dot_hit.y + dot_hit.h;

  if (hit_x && hit_y) {
    shot.state.kind = constant.CANNON_SHOT_DYING;
    shot.state.changed_at = state.frames;
    dot.enabled = false;
  }
};

const detect_hit = (state, dot) => {
  detect_hit_with_invaders(state, dot);
  detect_hit_invader_shot(state, dot);
  detect_hit_cannon_shot(state, dot);
};

export const proc = (game, state) => {
  iterate_torchka_dots(state, detect_hit);
};

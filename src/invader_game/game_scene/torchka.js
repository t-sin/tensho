const constant = require('./constant.js');

const iterate_torchka_dots = (state, in_area_fn, collide_fn) => {
  for (let n = 0; n < state.torchka.array.length; n++) {
    let torchka = state.torchka.array[n];
    const topleft = constant.torchka.toplefts[n];
    const box = {
      x: topleft.x,
      y: topleft.y,
      w: torchka[0].length * constant.torchka.dot.size.w,
      h: torchka.length * constant.torchka.dot.size.h * constant.torchka.dot.scale.y + 20,
    };

    if (!in_area_fn(state, box)) {
      continue;
    }

    for (let row of torchka) {
      for (let dot of row) {
        collide_fn(state, dot);
      }
    }
  }
}

const invader_shot_in_box = (state, box) => {
  let result = false;
  for (let shot of state.invaders.shot) {
    if (shot.state.kind != constant.INVADER_SHOT_MOVING) {
      continue;
    }

    const shot_hit = {
      x: shot.x + constant.invaders.shot.hit.offset.x,
      y: shot.y,
    };

    const in_x = box.x < shot_hit.x && shot_hit.x < box.x + box.w;
    const in_y = box.y < shot_hit.y && shot_hit.y < box.y + box.h;

    result |= in_x && in_y;
  }

  return result;
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

const cannon_shot_in_box = (state, box) => {
  let shot = state.cannon.shot;
  if (shot.state.kind != constant.INVADER_SHOT_MOVING) {
    return false;
  }

  const shot_hit = {
    x: shot.x + constant.cannon.shot.hit.offset.x,
    y: shot.y,
  };

  const in_x = box.x < shot_hit.x && shot_hit.x < box.x + box.w;
  const in_y = box.y < shot_hit.y && shot_hit.y < box.y + box.h;

  return in_x && in_y;
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

const in_box = (state, box) => {
  return invader_shot_in_box(state, box) || cannon_shot_in_box(state, box);
};

const collide = (state, dot) => {
  // this has done in invader.js because of use bounding box with each invader
  //detect_hit_with_invaders(state, dot);
  detect_hit_invader_shot(state, dot);
  detect_hit_cannon_shot(state, dot);
};

export const proc = (game, state) => {
  iterate_torchka_dots(state, in_box, collide);
};

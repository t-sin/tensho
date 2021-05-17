const constant = require('./constant.js');

const detect_hit_with_invaders = (state) => {
};

const detect_hit_invader_shot = (state) => {
};

const detect_hit_cannon_shot = (state) => {
};

export const proc = (game, state) => {
  detect_hit_with_invaders(state);
  detect_hit_invader_shot(state);
  detect_hit_cannon_shot(state);
};

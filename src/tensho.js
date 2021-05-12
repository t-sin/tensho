const invader = require('./invader_game.js');

const setup = () => {
  const canvas = document.getElementById('tensho-game');
  const ctx = canvas.getContext('2d');

  let game = {
    canvas: canvas,
    ctx: ctx,
    scene: null,
  };
  game.scene = invader.make_invader_scene(game);
  return game;
};

setup().scene();

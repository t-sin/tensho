const game_scene = require('./game_scene/');

const setup = () => {
  const canvas = document.getElementById('tensho-game');
  const ctx = canvas.getContext('2d');

  let input = {
    left: false,
    right: false,
    shot: false,
  };
  document.addEventListener('keydown', (e) => {
    switch (e.code) {
      case 'KeyH':
        input.left = true;
        break;
      case 'KeyL':
        input.right = true;
        break;
      case 'KeyS':
        input.shot = true;
        break;
    }
  });
  document.addEventListener('keyup', (e) => {
    switch (e.code) {
      case 'KeyH':
        input.left = false;
        break;
      case 'KeyL':
        input.right = false;
        break;
      case 'KeyS':
        input.shot = false;
        break;
    }
  });

  let game = {
    canvas: canvas,
    ctx: ctx,
    scene: null,
    debug: true,
    input: input,
  };
  game.scene = game_scene.make_game_scene(game);
  return game;
};

export const start = () => {
  setup().scene();
};

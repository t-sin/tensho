const invader = require('./invader_game.js');

const setup = () => {
  const canvas = document.getElementById('tensho-game');
  const ctx = canvas.getContext('2d');

  let input = {
    space: false,
    left: false,
    right: false,
  };
  document.addEventListener('keydown', (e) => {
    switch (e.code) {
      case 'KeyH':
        input.left = true;
        break;
      case 'KeyL':
        input.right = true;
        break;
      case 'Space':
        input.space = true;
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
      case 'Space':
        input.space = false;
        break;
    }
  });

  let game = {
    canvas: canvas,
    ctx: ctx,
    scene: null,
    debug: true,
    input: input,
    conf: {
      initial_topleft_x: 120,
      initial_topleft_y: 100,
      initial_space_x: 35,
      initial_space_y: 30,
      edge_left: 70,
      edge_right: 570,
      rows: 5,
      columns: 11,
      invader_move_speed_x: 5,
      invader_move_speed_y: 20,
      invader_move_per_frames: 2,
    },
  };
  game.scene = invader.make_invader_scene(game);
  return game;
};

setup().scene();

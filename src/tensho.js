const invader = require('./invader_game.js');

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
      case 'KeyA':
        input.left = true;
        break;
      case 'KeyD':
        input.right = true;
        break;
      case 'KeyJ':
        input.shot = true;
        break;
    }
  });
  document.addEventListener('keyup', (e) => {
    switch (e.code) {
      case 'KeyA':
        input.left = false;
        break;
      case 'KeyD':
        input.right = false;
        break;
      case 'KeyJ':
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
    conf: {
      initial_topleft_x: 120,
      initial_topleft_y: 100,
      initial_space_x: 35,
      initial_space_y: 30,
      initial_cannon_x: 320,
      initial_cannon_y: 430,
      edge_top: 50,
      edge_bottom: 440,
      edge_left: 70,
      edge_right: 570,
      rows: 5,
      columns: 11,
      cannon_speed_x: 5,
      invader_move_speed_x: 5,
      invader_move_speed_y: 20,
      invader_move_per_frames: 2,
    },
  };
  game.scene = invader.make_invader_scene(game);
  return game;
};

setup().scene();

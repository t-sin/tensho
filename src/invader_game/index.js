const game_scene = require('./game_scene/');
const title_scene = require('./title_scene/');

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
    input: input,
    debug: true,

    scene: null,
    state: null,
    hiscore: 0,

    go_title_scene: (game) => {
      game.scene = title_scene.make_scene(game);
    },
    go_game_scene: (game) => {
      game.scene = game_scene.make_scene(game);
    },
  };

  game.go_title_scene(game);
  return game;
};

export const start = () => {
  let game = setup();

  const frame_fn = () => {
    if (game.scene != null) {
      game.scene();
    }

    window.requestAnimationFrame(frame_fn);
  }

  frame_fn();
};

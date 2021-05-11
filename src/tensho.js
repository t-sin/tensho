const make_invader_scene = (game) => {
  const proc = () => {
    window.requestAnimationFrame(proc);
  };
  return proc;
};

const setup = () => {
  const canvas = document.getElementById('tensho-game');
  const ctx = canvas.getContext('2d');

  let game = {
    canvas: canvas,
    ctx: ctx,
    scene: null,
  };
  game.scene = make_invader_scene(game);
  return game;
};

setup().scene();

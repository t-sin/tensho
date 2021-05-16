const setup_state = () => {
  const state = {
    frames: 0,
  };

  return state;
};

const draw = (game, state) => {
  game.ctx.clearRect(0, 0, game.canvas.width, game.canvas.height);
};

const proc = (game, state) => {
  return true;
};

export const make_scene = (game) => {
  game.state = setup_state();

  const frame_fn = () => {
    draw(game, game.state);
    const next = proc(game, game.state)

    if (next) {
      game.go_game_scene(game);
    }
  };

  return frame_fn;
};

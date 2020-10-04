import { Game } from "./game";
import { Remedy, Bolt, Augment } from "./cards";
import { init } from "./ui";

let game = new Game();

game.start();

game.deck = [
  new Remedy,
  new Bolt,
  new Augment,
];

game.spell.cards = game.deck;

init(
  game,
  document.getElementById("root")
);

window.game = game;

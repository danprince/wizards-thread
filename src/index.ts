import { Game } from "./game";
import * as Cards from "./cards";
import { Scrabbler } from "./monsters";
import { init } from "./ui";
import { StartTurnAction } from "./actions";

let game = new Game();

game.start();

game.deck = [];

for (let Card of Object.values(Cards)) {
  game.deck.push(new Card);
}

game.monster = new Scrabbler();

game.addActionBottom(new StartTurnAction());

init(
  game,
  document.getElementById("root")
);

window.game = game;

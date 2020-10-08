import { Game } from "./game";
import { Remedy, Bolt, Augment, Burst, Hypothesis, Propel, Antithesis, Synthesis, Justify, Mystify, Purify, Amplify, Siphon, Again, Supernova, Salvation, Awaken, Obstacle, Fatigue, Confused, Wormhole, Loop, End } from "./cards";
import { Scrabbler } from "./monsters";
import { init } from "./ui";
import { StartTurnAction } from "./actions";

let game = new Game();

game.start();

game.deck = [
  new Remedy,
  new Bolt,
  new Augment,
  new Burst,
  new Propel,
  new Hypothesis,
  new Antithesis,
  new Synthesis,
  new Justify,
  new Mystify,
  new Purify,
  new Amplify,
  new Siphon,
  new Again,
  new Supernova,
  new Salvation,
  new Awaken,
  new Obstacle,
  new Fatigue,
  new Confused,
  new Wormhole,
  new Loop,
  new End,
];

game.monster = new Scrabbler();

game.addActionBottom(new StartTurnAction());

init(
  game,
  document.getElementById("root")
);

window.game = game;

import { Game, Monster } from "./game";
import { WretchedClaws } from "./cards";

export class Scrabbler extends Monster {
  name = "Scrabbler";
  maxHealth = 20;
  health = 20;

  turns = 0;

  onTurnStart(game: Game) {
    this.turns += 1;

    for (let i = 0; i < this.turns; i++) {
      game.addToSpell(new WretchedClaws, i);
    }
  }
}

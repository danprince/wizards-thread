import { Game, Monster } from "./game";
import { DamageAction } from "./actions";

export class Scrabbler extends Monster {
  name = "Scrabbler";
  maxHealth = 20;
  health = 20;
  attackDamage = 5;

  update(game: Game) {
    game.addActionBottom(new DamageAction(game.player, this.attackDamage));
  }
}

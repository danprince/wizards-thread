import { Game, Card } from "./game";
import { HealAction, DamageAction, ResetMightAction, ModifyMightAction } from "./actions";

export class Remedy extends Card {
  id = "remedy";
  name = "Remedy";
  description = "Heal 1 HP";
  cost = 1;

  play(game: Game) {
    game.addActionTop(new HealAction(game.player, 1));
  }
}

export class Bolt extends Card {
  id = "bolt";
  name = "Bolt";
  description = "Deal 1 damage";
  cost = 1;

  play(game: Game) {
    game.addActionTop(new DamageAction(game.monster, 1));
  }
}

export class Augment extends Card {
  id = "augment";
  name = "Augment";
  description = "+1 might";
  cost = 1;

  play(game: Game) {
    game.addActionTop(new ModifyMightAction(1));
  }
}

export class Burst extends Card {
  id = "burst";
  name = "Burst";
  description = "Deal might damage and reset might";
  cost = 2;

  play(game: Game) {
    game.addActionTop(new DamageAction(game.monster, game.player.might));
    game.addActionTop(new ResetMightAction());
  }
}

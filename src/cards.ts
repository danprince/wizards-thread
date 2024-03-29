import { Game, Card, CardType, CardRarity } from "./game";

import {
  HealAction,
  DamageAction,
  ResetMightAction,
  ModifyMightAction,
  JumpToCardAction,
  ModifyManaAction,
  MultiplyMightAction,
  ShuffleSpellAction,
  LoopAction,
  PlayCardAction,
  BanishCardAction,
} from "./actions";

export class Remedy extends Card {
  id = "remedy";
  name = "Remedy";
  description = "Gain 1 $health";
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
  description = "Gain 1 $might";
  cost = 1;

  play(game: Game) {
    game.addActionTop(new ModifyMightAction(1));
  }
}

export class Burst extends Card {
  id = "burst";
  name = "Burst";
  description = "Do $might damage.\nReset $might";
  cost = 2;

  play(game: Game) {
    game.addActionTop(new DamageAction(game.monster, game.player.might));
    game.addActionTop(new ResetMightAction());
  }
}

export class Jump extends Card {
  id = "jump";
  name = "Jump";
  description = "Skip the next card";
  cost = 1;

  play(game: Game) {
    game.addActionTop(new JumpToCardAction(game.cursor + 1));
  }
}

export class Propel extends Card {
  id = "propel";
  name = "Propel";
  description = "Skip $might cards";
  cost = 1;

  play(game: Game) {
    if (game.player.might > 0) {
      game.addActionTop(new JumpToCardAction(game.cursor + game.player.might));
    }
  }
}

export class Hypothesis extends Card {
  id = "hypothesis";
  name = "Hypothesis";
  description = "If $mana is even:\nGain 2 $mana";
  cost = 1;

  play(game: Game) {
    if (game.player.mana % 2 === 0) {
      game.addActionTop(new ModifyManaAction(2));
    }
  }
}

export class Antithesis extends Card {
  id = "antithesis";
  name = "Antithesis";
  description = "If $mana is even:\nDo 2 dmg";
  cost = 1;

  play(game: Game) {
    if (game.player.mana % 2 === 0) {
      game.addActionTop(new DamageAction(game.monster, 2));
    }
  }
}

export class Synthesis extends Card {
  id = "synthesis";
  name = "Synthesis";
  description = "If $mana is even:\nGain 2 $health";
  cost = 1;

  play(game: Game) {
    if (game.player.mana % 2 === 0) {
      game.addActionTop(new HealAction(game.player, 2));
    }
  }
}

export class Justify extends Card {
  id = "justify";
  name = "Justify";
  description = "If $might is even:\nGain 2 $might";
  cost = 1;

  play(game: Game) {
    game.addActionTop(new ModifyMightAction(2));
  }
}

export class Mystify extends Card {
  id = "mystify";
  name = "Mystify";
  description = "If $might is even:\nGain 2 $mana";
  cost = 1;

  play(game: Game) {
    game.addActionTop(new ModifyManaAction(2));
  }
}

export class Purify extends Card {
  id = "purify";
  name = "Purify";
  description = "If $might is even:\nGain 2 $health";
  cost = 2;

  play(game: Game) {
    game.addActionTop(new HealAction(game.player, 2));
  }
}

export class Amplify extends Card {
  id = "amplify";
  name = "Amplify";
  description = "If $might is even:\nGain 2x $might";
  cost = 3;
  rarity = CardRarity.Rare;

  play(game: Game) {
    game.addActionTop(new MultiplyMightAction(2));
  }
}

export class Siphon extends Card {
  id = "siphon";
  name = "Siphon";
  description = "Convert $might to $health";
  cost = 3;

  play(game: Game) {
    let amount = game.player.might;
    game.addActionTop(new HealAction(game.player, amount));
    game.addActionTop(new ResetMightAction());
  }
}

export class Again extends Card {
  id = "again";
  name = "Again";
  description = "Play the previous card again";
  cost = 1;

  play(game: Game) {
    game.addActionTop(new PlayCardAction(game.previousCardPlayed));
  }
}

export class Supernova extends Card {
  id = "supernova";
  name = "Supernova";
  description = "Deal $might damage";
  cost = 3;

  play(game: Game) {
    game.addActionTop(new DamageAction(game.monster, game.player.might));
  }
}

export class Salvation extends Card {
  id = "salvation";
  name = "Salvation";
  description = "Heal for $might\n Reset $might";
  cost = 3;

  play(game: Game) {
    game.addActionTop(new HealAction(game.player, game.player.might));
    game.addActionTop(new ResetMightAction());
  }
}

export class Awaken extends Card {
  id = "awaken";
  name = "Awaken";
  description = "Add $might to $mana\n Reset $might";
  cost = 3;

  play(game: Game) {
    game.addActionTop(new ModifyManaAction(game.player.might));
    game.addActionTop(new ResetMightAction());
  }
}

export class Obstacle extends Card {
  id = "obstacle";
  name = "Obstacle";
  description = "The spell ends here";
  cost = 99;
  type = CardType.Hex;
  forced = true;

  play() {}
}

export class Fatigue extends Card {
  id = "fatigue";
  name = "Fatigue";
  description = "Nothing happens";
  cost = 1;
  type = CardType.Hex;
  forced = true;

  play() {}
}

export class Confused extends Card {
  id = "confused";
  name = "Confused";
  description = "Shuffle the spell and continue";
  cost = 0;
  type = CardType.Hex;
  forced = true;

  play(game: Game) {
    game.addActionTop(new ShuffleSpellAction());
  }
}

export class Wormhole extends Card {
  id = "wormhole";
  name = "Wormhole";
  description = "Jump to a random card";
  cost = 1;
  type = CardType.Hex;
  forced = true;

  play(game: Game) {
    let cursor = Math.floor(Math.random() * game.spell.length);
    game.addActionTop(new JumpToCardAction(cursor));
  }
}

export class Loop extends Card {
  id = "loop";
  name = "Loop";
  description = "Start a loop";
  cost = 0;

  play() {}
}

export class End extends Card {
  id = "end"
  name = "End"
  description = "Return to the previous loop card"
  cost = 1

  play(game: Game) {
    game.addActionTop(new LoopAction());
  }
}

export class WretchedClaws extends Card {
  id = "wretched_claws"
  name = "Wretched Claws"
  description = "Slash you for 3 damage"
  cost = 0
  type = CardType.Enemy
  forced = true

  play(game: Game) {
    game.addActionTop(new DamageAction(game.player, 3));
  }
}

export class Begone extends Card {
  id = "begone"
  name = "Begone"
  description = "Banish the next card"
  cost = 1

  play(game: Game) {
    // Cursor is already over next card ready for the next turn
    game.addActionTop(new BanishCardAction(game.cursor));
  }
}

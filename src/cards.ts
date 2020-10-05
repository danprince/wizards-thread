import { Game, Card } from "./game";

import {
  HealAction,
  DamageAction,
  ResetMightAction,
  ModifyMightAction,
  JumpToCardAction,
  ModifyManaAction,
  MultiplyMightAction,
  ShuffleSpellAction
} from "./actions";

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

export class Jump extends Card {
  id = "jump";
  name = "Jump";
  description = "Skip the next card";
  cost = 1;

  play(game: Game) {
    game.addActionTop(new JumpToCardAction(game.spell.cursor + 1));
  }
}

export class Propel extends Card {
  id = "propel";
  name = "Propel";
  description = "Skip might cards";
  cost = 1;

  play(game: Game) {
    game.addActionTop(new JumpToCardAction(game.player.might));
  }
}

export class Hypothesis extends Card {
  id = "hypothesis";
  name = "Hypothesis";
  description = "If mana is even, +2 mana";
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
  description = "If mana is even, +2 damage";
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
  description = "If mana is even, +2 health";
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
  description = "If might is even, +2 might";
  cost = 1;

  play(game: Game) {
    game.addActionTop(new ModifyMightAction(2));
  }
}

export class Mystify extends Card {
  id = "mystify";
  name = "Mystify";
  description = "If might is even, +2 mana";
  cost = 1;

  play(game: Game) {
    game.addActionTop(new ModifyManaAction(2));
  }
}

export class Purify extends Card {
  id = "purify";
  name = "Purify";
  description = "If might is even, +2 health";
  cost = 2;

  play(game: Game) {
    game.addActionTop(new HealAction(game.player, 2));
  }
}

export class Amplify extends Card {
  id = "amplify";
  name = "Amplify";
  description = "If might is even, x2 might";
  cost = 3;

  play(game: Game) {
    game.addActionTop(new MultiplyMightAction(2));
  }
}

export class Siphon extends Card {
  id = "siphon";
  name = "Siphon";
  description = "Convert might to HP";
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
    // TODO:
  }
}

export class Supernova extends Card {
  id = "supernova";
  name = "Supernova";
  description = "Deal might damage";
  cost = 3;

  play(game: Game) {
    game.addActionTop(new DamageAction(game.monster, game.player.might));
  }
}

export class Salvation extends Card {
  id = "salvation";
  name = "Salvation";
  description = "Heal for might and reset might";
  cost = 3;

  play(game: Game) {
    game.addActionTop(new HealAction(game.player, game.player.might));
    game.addActionTop(new ResetMightAction());
  }
}

export class Awaken extends Card {
  id = "awaken";
  name = "Awaken";
  description = "Add might to mana and reset might";
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

  play(game: Game) {
  }
}

export class Fatigue extends Card {
  id = "fatigue";
  name = "Fatigue";
  description = "Nothing happens";
  cost = 1;

  play(game: Game) {
  }
}

export class Confusion extends Card {
  id = "confusion";
  name = "Confusion";
  description = "Shuffle the spell and continue";
  cost = 0;

  play(game: Game) {
    game.addActionTop(new ShuffleSpellAction());
  }
}

export class Wormhole extends Card {
  id = "wormhole";
  name = "Wormhole";
  description = "Continue the spell from a random card";
  cost = 1;

  play(game: Game) {
    let cursor = Math.floor(Math.random() * game.spell.cards.length);
    game.addActionTop(new JumpToCardAction(cursor));
  }
}

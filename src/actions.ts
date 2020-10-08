import { Game, Card, Action, Creature, GameState } from "./game";
import { RNG } from "silmarils";

export class WaitAction extends Action {
  constructor(public duration: number) {
    super();
  }

  update() {
    return new Promise(resolve => setTimeout(resolve, this.duration));
  }
}

export class HealAction extends Action {
  static allowedStates = [GameState.Casting];

  constructor(public target: Creature, public amount: number) {
    super();
  }

  update() {
    this.target.modifyHealth(this.amount);
  }
}

export class DamageAction extends Action {
  static allowedStates = [GameState.Casting];

  constructor(public target: Creature, public amount: number) {
    super();
  }

  update() {
    this.target.damage(this.amount);
  }
}

export class CastSpellAction extends Action {
  static allowedStates = [GameState.Drafting];

  update(game: Game) {
    game.castSpell();
    game.addActionBottom(new TransitionAction(GameState.Casting));
    game.addActionBottom(new WaitAction(500));
    game.addActionBottom(new PlayNextCardAction());
  }
}

export class TransitionAction extends Action {
  constructor(public state: GameState) {
    super();
  }

  update(game: Game) {
    game.transition(this.state);
  }
}

export class StartTurnAction extends Action {
  static allowedStates = [GameState.Initializing];

  update(game: Game) {
    game.addActionBottom(new TransitionAction(GameState.Drafting));
    game.resetSpell();
    game.monster.onTurnStart(game);
  }
}

export class EndTurnAction extends Action {
  update(game: Game) {
    game.clearActions();
    game.monster.onTurnEnd(game);
    game.addActionBottom(new WaitAction(800));
    game.addActionBottom(new StartTurnAction());
  }
}

export class PlayNextCardAction extends Action {
  static allowedStates = [GameState.Casting];

  update(game: Game) {
    if (game.isSpellFinished()) {
      game.addActionBottom(new EndTurnAction());
      return;
    }

    let card = game.getCurrentCard();

    if (card) {
      // Check whether the player can afford to cast this
      if (!game.player.hasMana(card.cost)) {
        console.log(`%cNOT ENOUGH MANA`, "color: orangered; background: pink; font-weight: bold");
        game.addActionBottom(new EndTurnAction());
        return;
      }

      // Pay for the card
      game.addActionBottom(new ModifyManaAction(-card.cost));
    }

    // Advance the casting cursor
    game.addActionBottom(new JumpToCardAction(game.cursor + 1));

    if (card) {
      // Play the card
      game.addActionBottom(new PlayCardAction(card));
    }

    // Pause before moving to the next card
    game.addActionBottom(new WaitAction(800));

    // Play the next card
    game.addActionBottom(new PlayNextCardAction);
  }
}

export class PlayCardAction extends Action {
  static allowedStates = [GameState.Casting];

  constructor(public card: Card) {
    super();
  }

  update(game: Game) {
    console.groupCollapsed(`%cPLAY%c ${this.card.name}`, "color: blue; background: lightcyan; font-weight: bold", "font-weight: bold");
    console.log(this.card);
    this.card.play(game);
    game.previousCardPlayed = this.card;
    console.groupEnd();
  }
}

export class JumpToCardAction extends Action {
  static allowedStates = [GameState.Casting];

  constructor(public index: number) {
    super();
  }

  update(game: Game) {
    return game.setCastingIndex(this.index);
  }
}

export class ModifyHealthAction extends Action {
  constructor(public target: Creature, public amount: number) {
    super();
  }

  update() {
    this.target.modifyHealth(this.amount);
  }
}

export class ModifyManaAction extends Action {
  constructor(public amount: number) {
    super();
  }

  update(game: Game) {
    game.player.modifyMana(this.amount);
  }
}

export class ModifyMightAction extends Action {
  constructor(public amount: number) {
    super();
  }

  update(game: Game) {
    game.player.modifyMight(this.amount);
  }
}

export class MultiplyMightAction extends Action {
  constructor(public factor: number) {
    super();
  }

  update(game: Game) {
    game.player.setMight(game.player.might * this.factor);
  }
}


export class SetHealthAction extends Action {
  constructor(public target: Creature, public amount: number) {
    super();
  }

  update() {
    this.target.setHealth(this.amount);
  }
}

export class SetManaAction extends Action {
  constructor(public amount: number) {
    super();
  }

  update(game: Game) {
    game.player.setMana(this.amount);
  }
}

export class SetMightAction extends Action {
  constructor(public amount: number) {
    super();
  }

  update(game: Game) {
    game.player.setMight(this.amount);
  }
}

export class ResetMightAction extends Action {
  update(game: Game) {
    game.player.setMight(0);
  }
}

export class ShuffleSpellAction extends Action {
  update(game: Game) {
    RNG.shuffle(game.spell);
  }
}

export class LoopAction extends Action {
  update(game: Game) {
    for (let cursor = game.cursor; cursor >= 0; cursor--) {
      let card = game.spell[cursor];

      if (card && card.id === "loop") {
        game.addActionTop(new JumpToCardAction(cursor));
        break;
      }
    }
  }
}

export class BanishCardAction extends Action {
  constructor(public index: number) {
    super();
  }

  update(game: Game) {
    let card = game.spell[this.index];

    if (card) {
      game.removeFromSpell(card)
      game.addToEther(card);
    }
  }
}

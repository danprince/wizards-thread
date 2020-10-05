import { Game, Card, Action, Creature, State } from "./game";

export class WaitAction extends Action {
  constructor(public duration: number) {
    super();
  }

  update() {
    return new Promise(resolve => setTimeout(resolve, this.duration));
  }
}

export class HealAction extends Action {
  static allowedStates = [State.Casting, State.Reacting];

  constructor(public target: Creature, public amount: number) {
    super();
  }

  update() {
    this.target.modifyHealth(this.amount);
  }
}

export class DamageAction extends Action {
  static allowedStates = [State.Casting, State.Reacting];

  constructor(public target: Creature, public amount: number) {
    super();
  }

  update() {
    this.target.damage(this.amount);
  }
}

export class CastSpellAction extends Action {
  static allowedStates = [State.Drafting];

  update(game: Game) {
    game.player.resetMana();
    game.spell.reset();
    game.addActionBottom(new TransitionAction(State.Casting));
    game.addActionBottom(new WaitAction(500));
    game.addActionBottom(new PlayNextCardAction());
  }
}

export class EndSpellAction extends Action {
  static allowedStates = [State.Casting];

  update(game: Game) {
    game.clearActions();
    game.addActionBottom(new TransitionAction(State.Reacting));
    game.addActionBottom(new MonsterTakeTurnAction());
  }
}

export class MonsterTakeTurnAction extends Action {
  update(game: Game) {
    game.monster.update(game);
    game.addActionBottom(new WaitAction(800));
    game.addActionBottom(new TransitionAction(State.Drafting));
  }
}

export class TransitionAction extends Action {
  constructor(public state: State) {
    super();
  }

  update(game: Game) {
    game.transition(this.state);
  }
}

export class PlayNextCardAction extends Action {
  static allowedStates = [State.Casting];

  update(game: Game) {
    if (game.spell.isFinished()) {
      game.addActionBottom(new EndSpellAction());
      return;
    }

    let card = game.spell.getCurrentCard();

    // Check whether the player can afford to cast this
    if (!game.player.hasMana(card.cost)) {
      console.log(`%cNOT ENOUGH MANA`, "color: orangered; background: pink; font-weight: bold");
      game.addActionBottom(new EndSpellAction());
      return;
    }

    // Pay for the card
    game.addActionBottom(new ModifyManaAction(-card.cost));

    // Advance the casting cursor
    game.addActionBottom(new JumpToCardAction(game.spell.cursor + 1));

    // Play the card
    game.addActionBottom(new PlayCardAction(card));

    // Pause before moving to the next card
    game.addActionBottom(new WaitAction(800));

    // Play the next card
    game.addActionBottom(new PlayNextCardAction);
  }
}

export class PlayCardAction extends Action {
  static allowedStates = [State.Casting];

  constructor(public card: Card) {
    super();
  }

  update(game: Game) {
    console.groupCollapsed(`%cPLAY%c ${this.card.name}`, "color: blue; background: lightcyan; font-weight: bold", "font-weight: bold");
    console.log(this.card);
    this.card.play(game);
    game.spell.previousCardPlayed = this.card;
    console.groupEnd();
  }
}

export class JumpToCardAction extends Action {
  static allowedStates = [State.Casting];

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
    game.spell.shuffle();
  }
}

export class LoopAction extends Action {
  update(game: Game) {
    for (let cursor = game.spell.cursor; cursor >= 0; cursor--) {
      let card = game.spell.cards[cursor];

      if (card && card.id === "loop") {
        game.addActionTop(new JumpToCardAction(cursor));
        break;
      }
    }
  }
}

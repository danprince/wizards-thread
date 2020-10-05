import { RNG } from "silmarils";

export enum State {
  Drafting = "Drafting",
  Casting = "Casting",
  Reacting = "Reacting",
}

export class Game {
  player = new Player();
  monster = new Monster();
  spell = new Spell();
  deck: Card[] = [];
  state: State = State.Drafting;

  private actions: Action[] = [];

  transition(state: State) {
    this.state = state;
    console.log(`%cTRANSITION%c ${state}`, "color: blueviolet; background: lavender; font-weight: bold", "");
  }

  addActionTop(action: Action) {
    this.actions.unshift(action);
  }

  addActionBottom(action: Action) {
    this.actions.push(action);
  }

  clearActions() {
    this.actions = [];
  }

  private subscribers: {
    update: (() => any)[],
  } = {
    update: [],
  }

  onUpdate(callback: () => any) {
    this.subscribers.update.push(callback);

    return () => {
      let index = this.subscribers.update.indexOf(callback);
      this.subscribers.update.splice(index, 1);
    };
  }

  /**
   * Process the next action from the queue.
   */
  private async update() {
    if (this.actions.length === 0) {
      return;
    }

    let action = this.actions.shift();

    if (action.allowedStates && !action.allowedStates.includes(this.state)) {
      console.warn(`%cIGNORED%c ${action.type}%c not allowed in %c${this.state}%c state!`, "color: red; background: mistyrose; font-weight: bold", "font-weight: bold", "", "font-weight: bold", "", action);
      return;
    }

    console.debug(`%cACTION`, "color: green; background: lightgreen; font-weight: bold", action);

    await action.update(this);

    for (let callback of this.subscribers.update) {
      callback();
    }
  }

  async start() {
    while (true) {
      await this.update();
      await new Promise(requestAnimationFrame);
    }
  }

  setCastingIndex(index: number) {
    this.spell.cursor = index;
  }
}

export class Spell {
  cards: Card[] = [];
  cursor: number = 0;
  previousCardPlayed: Card = null;

  getCurrentCard(): Card {
    return this.cards[this.cursor];
  }

  isFinished() {
    return this.cursor >= this.cards.length;
  }

  reset() {
    this.cursor = 0;
  }

  shuffle() {
    let cards: Card[] = [];

    for (let i = 0; i < this.cards.length; i++) {
      let j = Math.floor(Math.random() * this.cards.length);
      cards[i] = this.cards[j];
      cards[j] = this.cards[i];
    }

    this.cards = cards;
  }
}

export abstract class Card {
  abstract id: string;
  abstract name: string;
  abstract description: string;
  abstract cost: number;

  uid: number;

  constructor() {
    this.uid = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);

  }

  abstract play(game: Game): any
}

export abstract class Action {
  static readonly allowedStates?: State[]
  readonly type: string;

  get allowedStates() {
    return (this.constructor as typeof Action).allowedStates;
  }

  constructor() {
    this.type = this.constructor.name;
  }

  abstract update(game: Game): any
}

export class Creature {
  health: number;
  maxHealth = 10;

  modifyHealth(amount: number) {
    this.setHealth(this.health + amount);
  }

  setHealth(health: number) {
    this.health = Math.max(0, Math.min(health, this.maxHealth));
  }

  damage(amount: number) {
    this.modifyHealth(-amount);
  }
}

export class Player extends Creature {
  health = 10;

  baseMana = 10;
  mana = this.baseMana;

  might = 0;

  modifyMana(amount: number) {
    this.mana += amount;
  }

  resetMana() {
    this.mana = this.baseMana;
  }

  setMana(mana: number) {
    this.mana = mana;
  }

  modifyMight(amount: number) {
    this.might += amount;
  }

  setMight(might: number) {
    this.might = might;
  }

  hasMana(amount = 1) {
    return this.mana >= amount;
  }
}

export abstract class Monster extends Creature {
  health = 20;
  maxHealth = 20;

  abstract update(game: Game): any;
}

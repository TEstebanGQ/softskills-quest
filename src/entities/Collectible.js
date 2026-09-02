import { Entity } from './Entity.js';

export class Collectible extends Entity {
  constructor(x, y, symbol = '{}', points = 100, gateId = null, isRedCoin = false) {
    super(x, y, 24, 24, 'collectible');
    this.symbol = symbol;
    this.points = points;
    this.gateId = gateId;
    this.isRedCoin = isRedCoin || Boolean(gateId); // Gate keys are Red Coins!
  }
}

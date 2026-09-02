import { Entity } from './Entity.js';

export class Flagpole extends Entity {
  constructor(x, y, height = 240) {
    super(x, y, 32, height, 'flagpole');
    this.flagY = y + 16;
    this.initialFlagY = y + 16;
    this.isSliding = false;
    this.hasReachedBottom = false;
  }

  startSlide() {
    this.isSliding = true;
  }

  update(dt) {
    if (this.isSliding && !this.hasReachedBottom) {
      this.flagY += 200 * dt;
      if (this.flagY >= this.y + this.height - 48) {
        this.flagY = this.y + this.height - 48;
        this.hasReachedBottom = true;
      }
    }
  }
}

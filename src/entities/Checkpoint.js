import { Entity } from './Entity.js';

export class Checkpoint extends Entity {
  constructor(x, y, label, checkpointKey, isGoal = false) {
    super(x, y, 40, 60, 'checkpoint');
    this.label = label; // e.g. "25%", "50%", "75%", "META"
    this.checkpointKey = checkpointKey; // e.g. "checkpoint_25", "checkpoint_50_testimonio", etc.
    this.isGoal = isGoal;
    this.reached = false;
  }
}

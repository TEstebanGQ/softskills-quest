import { Entity } from './Entity.js';

export class NPC extends Entity {
  constructor(x, y, options = {}) {
    super(x, y, 32, 40, 'npc');
    this.name = options.name || 'Compañero Dev';
    this.roleShort = options.roleShort || 'DEV';
    this.roleColor = options.roleColor || '#ec4899';
    this.checkpointKey = options.checkpointKey || 'checkpoint_50_testimonio';
    this.dialogueTriggered = false;
    this.hasInteractiveDialogue = options.hasInteractiveDialogue || false;
    this.dialogueChoices = options.dialogueChoices || null;
  }
}

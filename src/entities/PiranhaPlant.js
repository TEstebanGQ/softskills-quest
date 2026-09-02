import { Entity } from './Entity.js';

export class PiranhaPlant extends Entity {
  constructor(pipeX, pipeY) {
    // 32px wide, 44px tall, centered on a 64px pipe (pipeX + 16)
    super(pipeX + 16, pipeY + 8, 32, 44, 'piranha_plant');
    this.pipeX = pipeX;
    this.pipeY = pipeY;
    this.minY = pipeY - 44; // Fully extended out of pipe
    this.maxY = pipeY + 8;  // Hidden inside pipe

    this.state = 'hidden'; // 'hidden' | 'rising' | 'biting' | 'lowering' | 'cooldown'
    this.nearTimer = 0;
    this.biteTimer = 0;
    this.cooldownTimer = 0;
    this.jawOpen = false;
  }

  update(dt, player) {
    if (!this.active || !player) return;

    const playerDistX = Math.abs((player.x + player.width / 2) - (this.pipeX + 32));
    const playerStandingOnPipe = (
      player.x + player.width > this.pipeX - 6 &&
      player.x < this.pipeX + 70 &&
      Math.abs((player.y + player.height) - this.pipeY) < 10
    );

    switch (this.state) {
      case 'hidden':
        this.y = this.maxY;
        // If player is nearby (within 170px) and not standing right on pipe top
        if (playerDistX < 170 && !playerStandingOnPipe) {
          this.nearTimer += dt;
          if (this.nearTimer >= 0.5) {
            this.state = 'rising';
            this.nearTimer = 0;
          }
        } else {
          this.nearTimer = 0;
        }
        break;

      case 'rising':
        this.y -= 110 * dt;
        if (this.y <= this.minY) {
          this.y = this.minY;
          this.state = 'biting';
          this.biteTimer = 0;
        }
        break;

      case 'biting':
        this.y = this.minY;
        this.biteTimer += dt;
        this.jawOpen = Math.sin(this.biteTimer * 16) > 0;
        if (this.biteTimer >= 1.0) {
          this.state = 'lowering';
        }
        break;

      case 'lowering':
        this.y += 110 * dt;
        if (this.y >= this.maxY) {
          this.y = this.maxY;
          this.state = 'cooldown';
          this.cooldownTimer = 0;
        }
        break;

      case 'cooldown':
        this.y = this.maxY;
        this.cooldownTimer += dt;
        if (this.cooldownTimer >= 3.0) {
          this.state = 'hidden';
          this.nearTimer = 0;
        }
        break;
    }
  }
}

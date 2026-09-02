import { Entity } from './Entity.js';

export class Thwomp extends Entity {
  constructor(x, startY = 120, groundY = 520, triggerDistance = 140) {
    // 44px wide, 54px high spiked stone face
    super(x, startY, 44, 54, 'thwomp');
    this.startX = x;
    this.startY = startY;
    this.groundY = groundY;
    this.triggerDistance = triggerDistance;

    this.state = 'idle'; // 'idle' | 'shaking' | 'slamming' | 'grounded' | 'rising'
    this.shakeTimer = 0;
    this.restTimer = 0;
    this.cooldownTimer = 0;
    this.shakeOffset = 0;
    this.isAngry = false;
  }

  update(dt, player) {
    if (!this.active) return;

    switch (this.state) {
      case 'idle':
        this.y = this.startY;
        this.shakeOffset = 0;
        this.isAngry = false;

        if (this.cooldownTimer > 0) {
          this.cooldownTimer -= dt;
          return;
        }

        if (player) {
          const distX = Math.abs((player.x + player.width / 2) - (this.x + this.width / 2));
          // If player is within trigger range and beneath Thwomp
          if (distX <= this.triggerDistance && player.y + player.height > this.startY + 20) {
            this.state = 'shaking';
            this.shakeTimer = 0;
            this.isAngry = true;
          }
        }
        break;

      case 'shaking':
        this.shakeTimer += dt;
        this.shakeOffset = Math.sin(this.shakeTimer * 50) * 4;

        if (this.shakeTimer >= 0.3) {
          this.shakeOffset = 0;
          this.state = 'slamming';
          this.vy = 200;
        }
        break;

      case 'slamming':
        this.vy += 2200 * dt;
        if (this.vy > 950) this.vy = 950;
        this.y += this.vy * dt;

        const maxFloorY = this.groundY - this.height;
        if (this.y >= maxFloorY) {
          this.y = maxFloorY;
          this.vy = 0;
          this.state = 'grounded';
          this.restTimer = 0;
        }
        break;

      case 'grounded':
        this.restTimer += dt;
        if (this.restTimer >= 1.0) {
          this.state = 'rising';
        }
        break;

      case 'rising':
        this.y -= 80 * dt;
        if (this.y <= this.startY) {
          this.y = this.startY;
          this.state = 'idle';
          this.cooldownTimer = 0.8;
        }
        break;
    }
  }
}

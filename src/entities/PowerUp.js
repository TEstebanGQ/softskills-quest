import { Entity } from './Entity.js';

export class PowerUp extends Entity {
  constructor(x, y, type = 'focus') {
    super(x, y, 24, 24, 'powerup');
    this.powerUpType = type; // Focus Boost / Coffee Energy
    this.targetY = y - 28;
    this.isEmerging = true;
    this.emergeSpeed = 45;
    this.vx = 90;
    this.vy = 0;
    this.gravity = 700;
  }

  updatePhysics(dt, platforms) {
    if (this.isEmerging) {
      // Emerge smoothly upwards from the '?' block
      this.y -= this.emergeSpeed * dt;
      if (this.y <= this.targetY) {
        this.y = this.targetY;
        this.isEmerging = false;
      }
      return;
    }

    // Normal forward marching physics
    this.vy += this.gravity * dt;
    this.x += this.vx * dt;
    this.y += this.vy * dt;

    for (const p of platforms) {
      if (!p.active || p.isPassable) continue;
      if (this.intersects(p)) {
        if (this.vy > 0 && this.y + this.height - this.vy * dt <= p.y + 10) {
          this.y = p.y - this.height;
          this.vy = 0;
        } else if (this.vx > 0) {
          this.x = p.x - this.width;
          this.vx *= -1;
        } else if (this.vx < 0) {
          this.x = p.x + p.width;
          this.vx *= -1;
        }
      }
    }
  }
}

import { Entity } from './Entity.js';

export class EnemyBug extends Entity {
  constructor(x, y, range = 120, speed = 55) {
    super(x, y, 32, 28, 'enemy');
    this.startX = x;
    this.range = range;
    this.speed = speed;
    this.direction = -1; // Patrolling left initially
    this.vx = this.speed * this.direction;
    this.vy = 0;
    this.gravity = 800;
    this.isGrounded = false;
    this.isSquished = false;
    this.squishTimer = 0;
  }

  stomp() {
    this.isSquished = true;
    this.height = 10;
    this.y += 18;
    this.vx = 0;
    this.vy = 0;
    this.speed = 0;
  }

  update(dt, platforms = []) {
    if (this.isSquished) {
      this.squishTimer += dt;
      if (this.squishTimer > 0.4) {
        this.active = false;
      }
      return;
    }

    const timeStep = Math.min(dt, 0.05);

    // Gravity
    this.vy += this.gravity * timeStep;
    if (this.vy > 500) this.vy = 500;

    // 1. Horizontal movement with solid wall & pipe collision
    this.vx = this.speed * this.direction;
    this.x += this.vx * timeStep;

    for (const solid of platforms) {
      if (!solid.active || solid.isPassable) continue;
      if (solid.type === 'quality_gate' && solid.passed) continue;

      if (this.intersects(solid)) {
        if (this.direction > 0) {
          this.x = solid.x - this.width;
          this.direction = -1;
        } else if (this.direction < 0) {
          this.x = solid.x + solid.width;
          this.direction = 1;
        }
        break;
      }
    }

    // 2. Vertical floor collision
    this.y += this.vy * timeStep;
    this.isGrounded = false;

    for (const solid of platforms) {
      if (!solid.active || solid.isPassable) continue;
      if (solid.type === 'quality_gate' && solid.passed) continue;

      if (this.intersects(solid)) {
        if (this.vy >= 0) {
          this.y = solid.y - this.height;
          this.vy = 0;
          this.isGrounded = true;
        }
      }
    }

    // 3. Cliff / Pit edge detection (do not walk into transparent void)
    if (this.isGrounded && platforms.length > 0) {
      const checkX = this.direction > 0 ? this.x + this.width + 6 : this.x - 6;
      const checkY = this.y + this.height + 6;

      let groundAhead = false;
      for (const solid of platforms) {
        if (!solid.active || solid.isPassable) continue;
        if (
          checkX >= solid.x &&
          checkX <= solid.x + solid.width &&
          checkY >= solid.y &&
          checkY <= solid.y + solid.height + 14
        ) {
          groundAhead = true;
          break;
        }
      }

      if (!groundAhead) {
        this.direction *= -1;
      }
    }

    // Safety fallback range around start position
    if (Math.abs(this.x - this.startX) > this.range * 1.5) {
      this.direction *= -1;
    }
  }
}

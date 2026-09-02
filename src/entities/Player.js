import { Entity } from './Entity.js';
import { thingHittr } from '../core/ThingHittr.js';

export class Player extends Entity {
  constructor(x, y) {
    super(x, y, 32, 40, 'player');
    this.spawnX = x;
    this.spawnY = y;

    // FullScreenMario Exact Physics Constants
    this.accel = 900;            // Horizontal acceleration (px/s²)
    this.maxSpeed = 280;         // Maximum speed (px/s)
    this.friction = 750;         // Ground friction (px/s²)
    this.airControl = 600;       // Air acceleration (px/s²)
    this.skidDecel = 1800;       // Derrape / Skid deceleration (px/s²)
    this.jumpForce = -520;       // Jump impulse (-520 px/s)

    this.risingGravity = 1200;   // Ascending gravity while jump held (px/s²)
    this.cutGravity = 2800;      // Cut gravity when jump released (px/s²)
    this.fallGravity = 1800;     // Falling gravity (px/s²)
    this.terminalVelocity = 650; // Max fall speed (px/s)

    this.isGrounded = false;
    this.isJumping = false;
    this.isSkidding = false;
    this.facing = 'right';
    this.deaths = 0;
    this.score = 0;
    this.coins = 0;

    // Coyote Time (120ms tolerance)
    this.coyoteTimer = 0;
    this.maxCoyoteTime = 0.12;

    // Power-up state (Big Dev / Focus Boost)
    this.isPoweredUp = false;
    this.jumpHeld = false;
  }

  resetToSpawn() {
    this.x = this.spawnX;
    this.y = this.spawnY;
    this.vx = 0;
    this.vy = 0;
    this.isGrounded = false;
    this.isJumping = false;
    this.isSkidding = false;
    this.isPoweredUp = false;
    this.height = 40;
    this.deaths++;
  }

  setSpawn(x, y) {
    this.spawnX = x;
    this.spawnY = y;
  }

  powerUp() {
    this.isPoweredUp = true;
    this.height = 50;
    this.y -= 10;
    this.score += 500;
  }

  handleInput(input, dt = 0.016) {
    let jumpTriggered = false;
    const timeStep = Math.min(dt, 0.05);

    // Horizontal Acceleration, Derrape & Friction
    const moveAccel = this.isGrounded ? this.accel : this.airControl;
    this.isSkidding = false;

    if (input.left) {
      if (this.isGrounded && this.vx > 20) {
        // Skidding to left while moving right
        this.isSkidding = true;
        this.vx -= this.skidDecel * timeStep;
        if (this.vx < 0) this.vx = 0;
      } else {
        this.vx -= moveAccel * timeStep;
        if (this.vx < -this.maxSpeed) this.vx = -this.maxSpeed;
      }
      this.facing = 'left';
    } else if (input.right) {
      if (this.isGrounded && this.vx < -20) {
        // Skidding to right while moving left
        this.isSkidding = true;
        this.vx += this.skidDecel * timeStep;
        if (this.vx > 0) this.vx = 0;
      } else {
        this.vx += moveAccel * timeStep;
        if (this.vx > this.maxSpeed) this.vx = this.maxSpeed;
      }
      this.facing = 'right';
    } else {
      // Natural Ground Friction (750 px/s²)
      if (this.vx > 0) {
        this.vx = Math.max(0, this.vx - this.friction * timeStep);
      } else if (this.vx < 0) {
        this.vx = Math.min(0, this.vx + this.friction * timeStep);
      }
    }

    // Mario Variable Jump & Coyote Time (120ms)
    const canJump = this.isGrounded || (this.coyoteTimer > 0 && !this.isJumping);

    if (input.jump && canJump) {
      this.vy = this.jumpForce;
      this.isGrounded = false;
      this.isJumping = true;
      this.coyoteTimer = 0;
      jumpTriggered = true;
    }

    this.jumpHeld = Boolean(input.jump);

    return jumpTriggered;
  }

  updatePhysics(dt, platforms) {
    // Delegated to ThingHittr for axis-separated AABB resolution
    thingHittr.updatePlayerPhysics(this, dt, platforms);
  }
}

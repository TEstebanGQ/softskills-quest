import { Entity } from './Entity.js';

export class Platform extends Entity {
  constructor(x, y, width, height, options = {}) {
    super(x, y, width, height, options.type || 'platform');
    this.color = options.color || '#6366f1';
    this.isPassable = options.isPassable || false;
    this.label = options.label || null;
    this.passed = options.passed || false;
    this.gateId = options.gateId || null;
    this.requiredCoins = options.requiredCoins || 1;
    this.collectedCoins = options.collectedCoins || 0;

    // Moving Platform Properties: automatically active if type is moving_platform
    this.isMoving = options.isMoving ?? (this.type === 'moving_platform');
    this.moveType = options.moveType || 'horizontal'; // 'horizontal' | 'vertical'
    this.moveDistance = options.moveDistance || 70;
    this.moveSpeed = options.moveSpeed || 65;
    this.startX = x;
    this.startY = y;
    this.direction = 1;

    // Constrain visible range so it never goes off-screen or behind HUD
    this.minY = options.minY || Math.max(200, y - this.moveDistance);
    this.maxY = options.maxY || Math.min(450, y + this.moveDistance);
    this.minX = options.minX || (x - this.moveDistance);
    this.maxX = options.maxX || (x + this.moveDistance);

    // Falling / Donut Platform Properties
    this.isFallingPlatform = (this.type === 'falling_platform');
    this.isTriggered = false;
    this.steppedTimer = 0;
    this.isFalling = false;
    this.fallSpeed = 0;
    this.shakeOffset = 0;
    this.respawnTimer = 0;
  }

  stepOn() {
    if (this.isFallingPlatform && !this.isFalling && !this.isTriggered) {
      this.isTriggered = true;
      this.steppedTimer = 0;
    }
  }

  update(dt) {
    // 1. Moving Platform Motion
    if (this.isMoving) {
      if (this.moveType === 'horizontal') {
        this.x += this.moveSpeed * this.direction * dt;
        if (this.x >= this.maxX) {
          this.x = this.maxX;
          this.direction = -1;
        } else if (this.x <= this.minX) {
          this.x = this.minX;
          this.direction = 1;
        }
      } else {
        this.y += this.moveSpeed * this.direction * dt;
        if (this.y >= this.maxY) {
          this.y = this.maxY;
          this.direction = -1;
        } else if (this.y <= this.minY) {
          this.y = this.minY;
          this.direction = 1;
        }
      }
    }

    // 2. Falling / Donut Platform Logic
    if (this.isFallingPlatform) {
      if (this.isFalling) {
        this.fallSpeed += 1100 * dt;
        this.y += this.fallSpeed * dt;
        this.shakeOffset = 0;

        // When fallen below the screen, prepare respawn
        if (this.y > 800) {
          this.respawnTimer += dt;
          if (this.respawnTimer > 2.5) {
            this.x = this.startX;
            this.y = this.startY;
            this.isFalling = false;
            this.isTriggered = false;
            this.steppedTimer = 0;
            this.fallSpeed = 0;
            this.respawnTimer = 0;
          }
        }
      } else if (this.isTriggered) {
        this.steppedTimer += dt;
        // Shake visually during the 0.65-second countdown
        this.shakeOffset = Math.sin(this.steppedTimer * 42) * 4;

        if (this.steppedTimer >= 0.65) {
          this.isFalling = true;
          this.fallSpeed = 160;
        }
      }
    }
  }
}

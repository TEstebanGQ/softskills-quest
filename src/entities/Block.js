import { Entity } from './Entity.js';
import { audio } from '../core/AudioSystem.js';

export class Block extends Entity {
  constructor(x, y, width = 32, height = 32, type = 'brick') {
    super(x, y, width, height, type);
    this.initialY = y;
    this.bumpOffset = 0;
    this.bumpSpeed = 0;
    this.isHit = false;
    this.itemInside = null; // 'coin', 'powerup', or null
  }

  onHitFromBelow(player) {
    if (this.type === 'question_block' && !this.isHit) {
      this.isHit = true;
      this.bumpSpeed = -150;
      audio.playBlockHit();

      if (this.itemInside === 'powerup') {
        audio.playPowerUpAppears();
        if (this.onSpawnPowerUp) this.onSpawnPowerUp(this.x + 4, this.y - 32);
      } else {
        // Coin spawn
        player.coins++;
        player.score += 200;
        audio.playCoin();
      }
    } else if (this.type === 'brick') {
      this.bumpSpeed = -100;
      audio.playBlockHit();
    }
  }

  update(dt) {
    if (this.bumpSpeed !== 0 || this.bumpOffset !== 0) {
      this.bumpOffset += this.bumpSpeed * dt;
      this.bumpSpeed += 800 * dt;

      if (this.bumpOffset >= 0) {
        this.bumpOffset = 0;
        this.bumpSpeed = 0;
      }
      this.y = this.initialY + this.bumpOffset;
    }
  }
}

export class QuestionBlock extends Block {
  constructor(x, y, itemInside = 'coin') {
    super(x, y, 32, 32, 'question_block');
    this.itemInside = itemInside;
  }
}

export class PipeBlock extends Block {
  constructor(x, y, height = 64) {
    super(x, y, 48, height, 'pipe');
  }
}

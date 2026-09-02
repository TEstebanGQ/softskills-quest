/**
 * MapsCreatr - System for managing tiles and map objects ("Things")
 * inspired by FullScreenMario / MapsCreatr / EightBittr.
 *
 * Categorizes Things into:
 * - Solid (Platform, Block, Pipe, Gate)
 * - Character (Player, EnemyBug, NPC)
 * - Collectible (Coin, Quality Key, Focus Boost)
 * - Scenery (Clouds, Hills, Bushes, Flagpole)
 *
 * Based on NES 16x16 px scaled 4x (64x64 px canvas tiles)
 */
import { Platform } from '../entities/Platform.js';
import { Block, QuestionBlock, PipeBlock } from '../entities/Block.js';
import { EnemyBug } from '../entities/EnemyBug.js';
import { Collectible } from '../entities/Collectible.js';
import { Flagpole } from '../entities/Flagpole.js';
import { NPC } from '../entities/NPC.js';
import { Checkpoint } from '../entities/Checkpoint.js';

export const TILE_SIZE = 64; // NES 16px * 4 scale

export class MapsCreatr {
  constructor() {
    this.tileSize = TILE_SIZE;
  }

  /**
   * Helper to convert grid tile coordinates (col, row) to world pixels
   */
  gridToPx(col, row) {
    return {
      x: col * this.tileSize,
      y: row * this.tileSize
    };
  }

  /**
   * Instantiate Solids
   */
  createSolid(type, x, y, width, height, options = {}) {
    switch (type) {
      case 'pipe':
        return new PipeBlock(x, y, height || this.tileSize);
      case 'question_block':
        return new QuestionBlock(x, y, options.itemInside || 'coin');
      case 'brick':
        return new Block(x, y, width || 32, height || 32, 'brick');
      case 'platform':
      case 'ground':
      default:
        return new Platform(x, y, width, height, options);
    }
  }

  /**
   * Instantiate Characters
   */
  createCharacter(type, x, y, options = {}) {
    switch (type) {
      case 'enemy_bug':
        return new EnemyBug(x, y, options.range || 120, options.speed || 60);
      case 'npc':
        return new NPC(x, y, options);
      default:
        throw new Error(`Unknown character type: ${type}`);
    }
  }

  /**
   * Instantiate Collectibles
   */
  createCollectible(x, y, symbol, points = 100, gateId = null) {
    return new Collectible(x, y, symbol, points, gateId);
  }

  /**
   * Instantiate Flagpole
   */
  createFlagpole(x, y, height = 240) {
    return new Flagpole(x, y, height);
  }

  /**
   * Instantiate Checkpoint
   */
  createCheckpoint(x, y, label, key) {
    return new Checkpoint(x, y, label, key);
  }
}

export const mapsCreatr = new MapsCreatr();

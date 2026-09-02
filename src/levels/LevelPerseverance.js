import { LevelBase } from './LevelBase.js';
import { Platform } from '../entities/Platform.js';
import { QuestionBlock, PipeBlock, Block } from '../entities/Block.js';
import { Checkpoint } from '../entities/Checkpoint.js';
import { Flagpole } from '../entities/Flagpole.js';
import { NPC } from '../entities/NPC.js';
import { Collectible } from '../entities/Collectible.js';
import { EnemyBug } from '../entities/EnemyBug.js';

export class LevelPerseverance extends LevelBase {
  constructor() {
    super('perseverancia', 'Perseverancia: Refactorizando el Monolito', '#10b981', 55);
    this.themeType = 'desert';
  }

  initLevel() {
    super.initLevel();
    this.levelWidth = 3400;

    this.flagpole = new Flagpole(3250, 280, 240);

    // Desert World Layout inspired by SMB3 World 2 (Image 3):
    // Stepped Sandstone Pyramids, Elevated Coin Decks, and Quicksand Parkour
    this.platforms = [
      // 1. Starting Oasis Ground (0 to 480)
      new Platform(0, 520, 480, 80, { color: '#d97706', type: 'ground' }),
      new PipeBlock(320, 456, 64),
      new QuestionBlock(180, 360, 'powerup'),

      // Sandstone Stepped Pyramid (from Image 3!)
      new Block(380, 488, 32, 32, 'stone_block'),
      new Block(412, 456, 32, 64, 'stone_block'),

      // Chasm 1 (480 to 680) with Responsive Falling Donut Platform!
      new Platform(560, 420, 80, 20, { type: 'falling_platform' }),

      // 2. High Sandstone Platform & Stepping Mushroom
      new Platform(680, 390, 110, 20, { type: 'mushroom' }),

      // Chasm 2 (790 to 1020) with Gliding Horizontally Moving Platform!
      new Platform(860, 400, 90, 20, {
        type: 'moving_platform',
        moveType: 'horizontal',
        moveSpeed: 70,
        moveDistance: 60,
        minX: 810,
        maxX: 950
      }),

      // 3. Central Desert Island (1020 to 1560)
      new Platform(1020, 520, 540, 80, { color: '#d97706', type: 'ground' }),
      new PipeBlock(1400, 456, 64),

      // Elevated Sandstone Pyramid Deck for the Refactor Red Coin (from Image 3!)
      new Block(1100, 488, 32, 32, 'stone_block'),
      new Block(1132, 456, 32, 64, 'stone_block'),
      new Block(1164, 424, 32, 96, 'stone_block'),
      new Platform(1120, 340, 140, 24, { type: 'stone_block' }),

      // FULL-HEIGHT QUALITY GATE: REFACTOR
      new Platform(1540, 0, 20, 520, {
        type: 'quality_gate',
        label: 'GATE: REFACTOR',
        gateId: 'persev_gate'
      }),

      // Chasm 3 (1560 to 1960): Quicksand Sinkhole with 2 Falling Donut Platforms!
      new Platform(1640, 420, 70, 20, { type: 'falling_platform' }),
      new Platform(1780, 370, 70, 20, { type: 'falling_platform' }),

      // 4. Elevated Sandstone Rest Platform
      new Platform(1950, 330, 120, 24, { type: 'stone_block' }),

      // 5. Vertically Moving Platform (y=270..400)
      new Platform(2140, 340, 90, 20, {
        type: 'moving_platform',
        moveType: 'vertical',
        moveSpeed: 60,
        moveDistance: 50,
        minY: 270,
        maxY: 400
      }),

      // 6. High Sandstone Ledge
      new Platform(2300, 300, 130, 24, { type: 'stone_block' }),

      // 7. Final Desert Ground to Flagpole (2480 to 3400)
      new Platform(2480, 520, 920, 80, { color: '#d97706', type: 'ground' }),
      new PipeBlock(2720, 456, 64),
      new QuestionBlock(2920, 360, 'coin')
    ];

    this.platforms.forEach(p => {
      if (p.type === 'question_block') {
        p.onSpawnPowerUp = (x, y) => this.spawnPowerUp(x, y);
      }
    });

    // Abundant Coins & Red Coin (inspired by coin arrays in Image 3!)
    this.collectibles = [
      // Red Coin Switch atop the Sandstone Pyramid
      new Collectible(1190, 290, '★', 250, 'persev_gate', true),

      // Gold Coins
      new Collectible(120, 480, '$', 50),
      new Collectible(150, 480, '$', 50),
      new Collectible(330, 400, '$', 100), // Above Pipe 1
      new Collectible(590, 370, '$', 100), // Above Donut 1

      new Collectible(720, 340, '$', 100),
      new Collectible(900, 340, '$', 100), // Above Moving Platform

      // Coin Array on Pyramid (from Image 3!)
      new Collectible(1130, 250, '$', 100),
      new Collectible(1160, 250, '$', 100),
      new Collectible(1220, 250, '$', 100),

      new Collectible(1060, 480, '$', 50),
      new Collectible(1410, 400, '$', 100), // Above Pipe 2

      new Collectible(1670, 370, '$', 100), // Above Donut 2
      new Collectible(1810, 320, '$', 100), // Above Donut 3
      new Collectible(1990, 280, '$', 150),

      new Collectible(2180, 280, '$', 100),
      new Collectible(2350, 250, '$', 150),

      new Collectible(2530, 480, '$', 50),
      new Collectible(2560, 480, '$', 50),
      new Collectible(2730, 400, '$', 100), // Above Pipe 3
      new Collectible(2970, 480, '$', 50)
    ];

    this.enemies = [
      new EnemyBug(1080, 492, 100, 65),
      new EnemyBug(2560, 492, 110, 75),
      new EnemyBug(2820, 492, 130, 85)
    ];

    this.checkpoints = [
      new Checkpoint(1050, 460, '25%', 'checkpoint_25'),
      new Checkpoint(2350, 240, '75%', 'checkpoint_75_consejo')
    ];

    this.npcs = [
      new NPC(1260, 480, {
        name: 'Dev Senior Maria',
        roleShort: 'SR DEV',
        roleColor: '#059669',
        checkpointKey: 'checkpoint_50_testimonio'
      })
    ];
  }
}

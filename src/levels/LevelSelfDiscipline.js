import { LevelBase } from './LevelBase.js';
import { Platform } from '../entities/Platform.js';
import { QuestionBlock, PipeBlock, Block } from '../entities/Block.js';
import { Checkpoint } from '../entities/Checkpoint.js';
import { Flagpole } from '../entities/Flagpole.js';
import { NPC } from '../entities/NPC.js';
import { Collectible } from '../entities/Collectible.js';
import { EnemyBug } from '../entities/EnemyBug.js';

export class LevelSelfDiscipline extends LevelBase {
  constructor() {
    super('autodisciplina', 'Autodisciplina: La Rutina CI/CD', '#6366f1', 50);
    this.themeType = 'overworld';
  }

  initLevel() {
    super.initLevel();
    this.levelWidth = 3300;

    this.flagpole = new Flagpole(3150, 280, 240);

    // Dynamic SMB 1-1 / Mario Maker Layout: Ascending Brick Staircases, Pipe Gaps & Moving Platforms
    this.platforms = [
      // 1. Starting Ground (0 to 520)
      new Platform(0, 520, 520, 80, { color: '#22c55e', type: 'ground' }),

      // Classic Ascending Brick Staircase (from Image 1 design sheet!)
      new Block(180, 488, 32, 32, 'brick'),
      new Block(212, 456, 32, 64, 'brick'),
      new Block(244, 424, 32, 96, 'brick'),
      new QuestionBlock(280, 320, 'powerup'),

      // Pipe 1 (Elevated challenge)
      new PipeBlock(420, 456, 64),

      // Chasm 1 (520 to 720) with Responsive Falling Donut Platform!
      new Platform(590, 420, 80, 20, { type: 'falling_platform' }),

      // 2. Second Ground Island (720 to 1240)
      new Platform(720, 520, 520, 80, { color: '#22c55e', type: 'ground' }),

      // Stepped Mushroom and Brick Ledge for Linter Red Coin
      new Platform(840, 390, 110, 20, { type: 'mushroom' }),
      new Block(1000, 340, 32, 32, 'brick'),
      new QuestionBlock(1032, 340, 'coin'),
      new Block(1064, 340, 32, 32, 'brick'),

      // FULL-HEIGHT QUALITY GATE 1: LINTER
      new Platform(1220, 0, 20, 520, {
        type: 'quality_gate',
        label: 'GATE 1: LINTER',
        gateId: 'gate1'
      }),

      // Chasm 2 (1240 to 1480): Smooth Horizontally Moving Platform!
      new Platform(1320, 390, 90, 20, {
        type: 'moving_platform',
        moveType: 'horizontal',
        moveSpeed: 75,
        moveDistance: 60,
        minX: 1270,
        maxX: 1410
      }),

      // 3. Third Ground Island (1480 to 2060)
      new Platform(1480, 520, 580, 80, { color: '#22c55e', type: 'ground' }),
      new PipeBlock(1620, 456, 64),

      // Descending Brick Staircase & Parkour
      new Block(1760, 424, 32, 96, 'brick'),
      new Block(1792, 456, 32, 64, 'brick'),
      new Block(1824, 488, 32, 32, 'brick'),
      new Platform(1900, 350, 90, 20, { type: 'stone_block' }),

      // FULL-HEIGHT QUALITY GATE 2: TESTS
      new Platform(2040, 0, 20, 520, {
        type: 'quality_gate',
        label: 'GATE 2: TESTS',
        gateId: 'gate2'
      }),

      // Chasm 3 (2060 to 2320): Falling Donut Platform in tandem with Moving Platform
      new Platform(2130, 420, 70, 20, { type: 'falling_platform' }),
      new Platform(2220, 370, 80, 20, {
        type: 'moving_platform',
        moveType: 'vertical',
        moveSpeed: 60,
        moveDistance: 45,
        minY: 280,
        maxY: 410
      }),

      // 4. Final Ground (2320 to 3300) with End Staircase and Flagpole
      new Platform(2320, 520, 980, 80, { color: '#22c55e', type: 'ground' }),
      new PipeBlock(2550, 456, 64),

      // Final Victory Staircase leading to Flagpole (from Image 1!)
      new Block(2850, 488, 32, 32, 'brick'),
      new Block(2882, 456, 32, 64, 'brick'),
      new Block(2914, 424, 32, 96, 'brick'),
      new Block(2946, 392, 32, 128, 'brick')
    ];

    this.platforms.forEach(p => {
      if (p.type === 'question_block') {
        p.onSpawnPowerUp = (x, y) => this.spawnPowerUp(x, y);
      }
    });

    // Abundant Coins & Red Coins
    this.collectibles = [
      // Red Coin Switch 1 (Linter Key atop the Mushroom parkour)
      new Collectible(890, 330, '★', 250, 'gate1', true),
      // Red Coin Switch 2 (Tests Key atop the Stone parkour)
      new Collectible(1940, 290, '★', 250, 'gate2', true),

      // Gold Coins following the staircase arches
      new Collectible(210, 400, '$', 50),
      new Collectible(240, 370, '$', 50),
      new Collectible(280, 270, '$', 100),

      new Collectible(430, 400, '$', 100), // Above Pipe 1
      new Collectible(620, 370, '$', 100), // Above Donut 1

      new Collectible(760, 480, '$', 50),
      new Collectible(790, 480, '$', 50),
      new Collectible(1040, 280, '$', 100),

      new Collectible(1350, 330, '$', 100), // Above Moving Platform
      new Collectible(1520, 480, '$', 50),
      new Collectible(1550, 480, '$', 50),
      new Collectible(1630, 400, '$', 100), // Above Pipe 2

      new Collectible(2160, 370, '$', 100), // Above Donut 2
      new Collectible(2250, 310, '$', 100),

      new Collectible(2380, 480, '$', 50),
      new Collectible(2410, 480, '$', 50),
      new Collectible(2560, 400, '$', 100), // Above Pipe 3
      new Collectible(2950, 340, '$', 100)
    ];

    // Bugs patrolling
    this.enemies = [
      new EnemyBug(780, 492, 80, 55),
      new EnemyBug(1700, 492, 90, 65),
      new EnemyBug(2650, 492, 90, 75)
    ];

    // Checkpoints positioned safely
    this.checkpoints = [
      new Checkpoint(760, 460, '25%', 'checkpoint_25'),
      new Checkpoint(2400, 460, '75%', 'checkpoint_75_consejo')
    ];

    // Tech Lead Alex at 50%
    this.npcs = [
      new NPC(1700, 480, {
        name: 'Tech Lead Alex',
        roleShort: 'LEAD',
        roleColor: '#8b5cf6',
        checkpointKey: 'checkpoint_50_testimonio'
      })
    ];
  }

  onItemCollected(item) {
    super.onItemCollected(item);
  }
}

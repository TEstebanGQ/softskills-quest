import { LevelBase } from './LevelBase.js';
import { Platform } from '../entities/Platform.js';
import { QuestionBlock, PipeBlock, Block } from '../entities/Block.js';
import { Checkpoint } from '../entities/Checkpoint.js';
import { Flagpole } from '../entities/Flagpole.js';
import { NPC } from '../entities/NPC.js';
import { Collectible } from '../entities/Collectible.js';
import { EnemyBug } from '../entities/EnemyBug.js';
import { PiranhaPlant } from '../entities/PiranhaPlant.js';
import { Thwomp } from '../entities/Thwomp.js';

export class LevelPlanning extends LevelBase {
  constructor() {
    super('capacidad_planificacion', 'Capacidad de Planificación: Arquitectura de Blueprint', '#ec4899', 55);
    this.themeType = 'castle';
    this.blueprintPreviewShown = false;
    this.sprintPoints = 0;
  }

  initLevel() {
    super.initLevel();
    this.levelWidth = 3400;
    this.sprintPoints = 0;

    // Castle flagpole
    this.flagpole = new Flagpole(3250, 280, 240);

    // Castle Dungeon Layout inspired by SMW Donut Secret House (Image Reference):
    // Rafters, Thwomp Domino Corridor, Piranha Pipes, and Smooth Moving Platform Access
    this.platforms = [
      // 1. Starting Castle Ground (0 to 480)
      new Platform(0, 520, 480, 80, { color: '#475569', type: 'castle_stone' }),
      new PipeBlock(340, 456, 64), // Contains Piranha Plant 1!
      new QuestionBlock(180, 350, 'powerup'),

      // Stepped Battlement Stones leading to Rafters
      new Block(380, 488, 32, 32, 'castle_stone'),
      new Block(412, 456, 32, 64, 'castle_stone'),

      // Chasm 1 (480 to 680) with Responsive Falling Donut Platform!
      new Platform(560, 430, 80, 20, { type: 'falling_platform' }),

      // 2. High Castle Dungeon Rafters (Red Coin 1 Location)
      new Platform(640, 350, 130, 20, { type: 'stone_block' }),

      // Ground 2: Pre-Moving Platform Landing (760 to 1200)
      new Platform(760, 520, 440, 80, { color: '#475569', type: 'castle_stone' }),
      new PipeBlock(960, 456, 64), // Contains Piranha Plant 2!

      // Stepped Battlement approach so Mario easily steps onto the Moving Platform!
      new Block(1120, 488, 32, 32, 'castle_stone'),
      new Block(1152, 456, 32, 64, 'castle_stone'),
      new Platform(1184, 430, 60, 20, { type: 'stone_block' }),

      // Chasm 2 (1200 to 1480): Smooth Horizontally Moving Platform with Cloud Anchor!
      // Comfortably positioned at y=430 so Mario easily jumps onto it from y=430 ledge!
      new Platform(1290, 430, 90, 20, {
        type: 'moving_platform',
        moveType: 'horizontal',
        moveSpeed: 65,
        moveDistance: 60,
        minX: 1240,
        maxX: 1380
      }),

      // 3. Castle Domino Thwomp Corridor (1480 to 2060)
      new Platform(1480, 520, 580, 80, { color: '#475569', type: 'castle_stone' }),

      // Lowered Battlement Ledge before the Gate (Red Coin 4 Location)
      new Platform(1970, 425, 90, 20, { type: 'stone_block' }),

      // FULL-HEIGHT ARCHITECTURE GATE (Requires 4 Red Coins!)
      new Platform(2060, 0, 20, 520, {
        type: 'quality_gate',
        label: 'ARCH GATE',
        gateId: 'plan_gate',
        requiredCoins: 4
      }),

      // Chasm 3 (2080 to 2400) with 2 Falling Donut Platforms!
      new Platform(2160, 430, 70, 20, { type: 'falling_platform' }),
      new Platform(2290, 390, 70, 20, { type: 'falling_platform' }),

      // High Battlement Platform
      new Platform(2410, 360, 100, 24, { type: 'castle_stone' }),

      // 4. Final Flagpole Castle Keep (2520 to 3400)
      new Platform(2520, 520, 880, 80, { color: '#475569', type: 'castle_stone' }),
      new PipeBlock(2760, 456, 64),
      new QuestionBlock(2960, 360, 'coin')
    ];

    this.platforms.forEach(p => {
      if (p.type === 'question_block') {
        p.onSpawnPowerUp = (x, y) => this.spawnPowerUp(x, y);
      }
    });

    // Piranha Plants inside select pipes!
    this.piranhaPlants = [
      new PiranhaPlant(340, 456),
      new PiranhaPlant(960, 456)
    ];

    // Castle Thwomp Domino Run (4 Thwomps in a row with domino effect!)
    this.thwomps = [
      new Thwomp(1580, 120, 520, 130),
      new Thwomp(1700, 120, 520, 130),
      new Thwomp(1820, 120, 520, 130),
      new Thwomp(1940, 120, 520, 130)
    ];

    // 4 Red Coins strategically placed to open the Architecture Gate!
    this.collectibles = [
      // Red Coin 1: High Castle Rafters
      new Collectible(700, 300, '★', 250, 'plan_gate', true),
      // Red Coin 2: Riding the Moving Platform with the Cloud!
      new Collectible(1330, 370, '★', 250, 'plan_gate', true),
      // Red Coin 3: Nestled in the Thwomp Domino Run!
      new Collectible(1760, 470, '★', 250, 'plan_gate', true),
      // Red Coin 4: Atop the Battlement before the Gate!
      new Collectible(2015, 375, '★', 250, 'plan_gate', true),

      // Gold Coins
      new Collectible(120, 480, '$', 50),
      new Collectible(150, 480, '$', 50),
      new Collectible(220, 480, '$', 50),
      new Collectible(590, 380, '$', 100), // Above Donut 1

      new Collectible(820, 480, '$', 50),
      new Collectible(850, 480, '$', 50),

      new Collectible(1640, 470, '$', 100),
      new Collectible(1880, 470, '$', 100),

      new Collectible(2190, 380, '$', 100), // Above Donut 2
      new Collectible(2320, 340, '$', 100), // Above Donut 3
      new Collectible(2450, 310, '$', 150),

      new Collectible(2580, 480, '$', 50),
      new Collectible(2610, 480, '$', 50),
      new Collectible(2770, 400, '$', 100), // Above Pipe 3
      new Collectible(3000, 480, '$', 50)
    ];

    this.enemies = [
      new EnemyBug(840, 492, 90, 60),
      new EnemyBug(2640, 492, 100, 70),
      new EnemyBug(2850, 492, 120, 80)
    ];

    this.checkpoints = [
      new Checkpoint(780, 460, '25%', 'checkpoint_25'),
      new Checkpoint(2440, 300, '75%', 'checkpoint_75_consejo')
    ];

    this.npcs = [
      new NPC(880, 480, {
        name: 'Scrum Master Diego',
        roleShort: 'SCRUM',
        roleColor: '#ec4899',
        checkpointKey: 'checkpoint_50_testimonio'
      })
    ];
  }
}

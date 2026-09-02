import { LevelBase } from './LevelBase.js';
import { Platform } from '../entities/Platform.js';
import { QuestionBlock, PipeBlock, Block } from '../entities/Block.js';
import { Checkpoint } from '../entities/Checkpoint.js';
import { Flagpole } from '../entities/Flagpole.js';
import { NPC } from '../entities/NPC.js';
import { Collectible } from '../entities/Collectible.js';
import { EnemyBug } from '../entities/EnemyBug.js';
import { PiranhaPlant } from '../entities/PiranhaPlant.js';
import { audio } from '../core/AudioSystem.js';

export class LevelCreativity extends LevelBase {
  constructor() {
    super('creatividad_innovacion', 'Creatividad e Innovación: Fuera del Sandbox', '#06b6d4', 45);
    this.themeType = 'twilight';
    this.maxBridges = 8;
    this.bridgesCreated = 0;
  }

  initLevel() {
    super.initLevel();
    this.levelWidth = 3400;
    this.bridgesCreated = 0;

    this.flagpole = new Flagpole(3250, 280, 240);

    this.platforms = [
      // Section 1: Starting Island (0 to 450)
      new Platform(0, 520, 450, 80, { color: '#06b6d4', type: 'ground' }),
      new PipeBlock(320, 456, 64),
      new QuestionBlock(160, 350, 'powerup'),

      // Chasm 1 (450 to 650) with Compact 60px Falling Donut Platform!
      new Platform(530, 420, 60, 20, { type: 'falling_platform' }),

      // Section 2: Pre-Abyss Launch Platform (650 to 1050)
      new Platform(650, 520, 400, 80, { color: '#06b6d4', type: 'ground' }),
      new PipeBlock(920, 456, 64),

      // Secret Upper Route for Red Coin 1
      new Platform(380, 330, 100, 20, { type: 'mushroom' }),
      new Platform(580, 270, 60, 20, { type: 'falling_platform' }),
      new Platform(780, 220, 90, 20, { type: 'stone_block' }),

      // =========================================================================
      // THE GREAT ABYSS (1050 to 1500 = 450px of PURE EMPTY VOID!)
      // Requires deploying <code_bridge/> with [B] in mid-air to reach Red Coin 2!
      // =========================================================================

      // Section 3: Safe Landing Island after the Great Abyss (1500 to 1850)
      new Platform(1500, 520, 350, 80, { color: '#06b6d4', type: 'ground' }),
      // Elevated Mushroom Ledge for Red Coin 3 before the Gate!
      new Platform(1660, 390, 90, 20, { type: 'mushroom' }),

      // FULL-HEIGHT INNOVATION GATE (Requires 3 Red Coins!)
      new Platform(1850, 0, 20, 520, {
        type: 'quality_gate',
        label: 'INNOVATION GATE',
        gateId: 'create_gate',
        requiredCoins: 3
      }),

      // Chasm 2 (1870 to 2280) with Moving Platform with Cloud Anchor!
      new Platform(2040, 390, 80, 20, {
        type: 'moving_platform',
        moveType: 'horizontal',
        moveSpeed: 65,
        moveDistance: 50,
        minX: 1990,
        maxX: 2110
      }),

      // Section 4: Final Flagpole Ground (2280 to 3400)
      new Platform(2280, 520, 1120, 80, { color: '#06b6d4', type: 'ground' }),
      new PipeBlock(2600, 456, 64),
      new QuestionBlock(2850, 350, 'coin')
    ];

    this.platforms.forEach(p => {
      if (p.type === 'question_block') {
        p.onSpawnPowerUp = (x, y) => this.spawnPowerUp(x, y);
      }
    });

    // Piranha Plants in select pipes!
    this.piranhaPlants = [
      new PiranhaPlant(320, 456),
      new PiranhaPlant(920, 456)
    ];

    // 3 Red Coins Required for the Innovation Gate (ALL located BEFORE the Gate!)
    this.collectibles = [
      // Red Coin 1: Secret in Upper Aerial Route (x=820)
      new Collectible(820, 170, '★', 300, 'create_gate', true),

      // Red Coin 2: Suspended over the Great Abyss (x=1270, requires <code_bridge/> to collect!)
      new Collectible(1270, 340, '★', 300, 'create_gate', true),

      // Red Coin 3: Atop the Island 3 Mushroom Ledge before the Gate! (x=1690)
      new Collectible(1690, 320, '★', 300, 'create_gate', true),

      // Gold Coins
      new Collectible(120, 480, '$', 50),
      new Collectible(150, 480, '$', 50),
      new Collectible(430, 270, '$', 100),
      new Collectible(550, 370, '$', 100), // Above Donut 1

      new Collectible(720, 480, '$', 50),
      new Collectible(750, 480, '$', 50),

      new Collectible(1180, 380, '💡', 200),
      new Collectible(1360, 380, '💡', 200),

      new Collectible(1550, 480, '$', 50),
      new Collectible(1580, 480, '$', 50),

      new Collectible(2340, 480, '$', 50),
      new Collectible(2370, 480, '$', 50),
      new Collectible(2610, 400, '$', 100), // Above Pipe 3
      new Collectible(2900, 480, '$', 50)
    ];

    this.enemies = [
      new EnemyBug(760, 492, 90, 60),
      new EnemyBug(1600, 492, 100, 65),
      new EnemyBug(2750, 492, 110, 75)
    ];

    this.checkpoints = [
      new Checkpoint(700, 460, '25%', 'checkpoint_25'),
      new Checkpoint(2340, 460, '75%', 'checkpoint_75_consejo')
    ];

    this.npcs = [
      new NPC(1650, 480, {
        name: 'Frontend Architect Sofia',
        roleShort: 'ARCH',
        roleColor: '#06b6d4',
        checkpointKey: 'checkpoint_50_testimonio'
      })
    ];
  }

  spawnBridge(x, y) {
    if (this.bridgesCreated >= this.maxBridges) return false;

    const bridge = new Platform(x, y, 140, 20, {
      type: 'code_bridge',
      color: '#06b6d4',
      label: '<code_bridge/>',
      lifeTime: 12
    });

    this.platforms.push(bridge);
    this.bridgesCreated++;
    audio.playBlockHit();
    return true;
  }

  update(dt) {
    super.update(dt);

    for (let i = this.platforms.length - 1; i >= 0; i--) {
      const p = this.platforms[i];
      if (p.type === 'code_bridge') {
        p.lifeTime -= dt;
        if (p.lifeTime <= 0) {
          p.active = false;
          this.platforms.splice(i, 1);
        }
      }
    }
  }
}

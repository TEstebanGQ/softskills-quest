import { LevelBase } from './LevelBase.js';
import { Platform } from '../entities/Platform.js';
import { PipeBlock, QuestionBlock, Block } from '../entities/Block.js';
import { Collectible } from '../entities/Collectible.js';
import { NPC } from '../entities/NPC.js';
import { StorageSystem, LEVEL_ORDER } from '../core/StorageSystem.js';
import { audio } from '../core/AudioSystem.js';

export class LevelHub extends LevelBase {
  constructor(onWarpToLevel, onOpenLibrary, onLockedWarning) {
    super('hub_overworld', 'Overworld Hub: Mapa de Habilidades', '#38bdf8', 999);
    this.onWarpToLevel = onWarpToLevel;
    this.onOpenLibrary = onOpenLibrary;
    this.onLockedWarning = onLockedWarning;
    this.warpPipes = [];
  }

  initLevel() {
    super.initLevel();
    this.levelWidth = 2800;

    const saveState = StorageSystem.load();

    // Full continuous Overworld ground
    this.platforms = [
      new Platform(0, 520, 2800, 80, { color: '#22c55e', type: 'ground' }),

      // 5 Interactive Warp Pipes to the Worlds
      new PipeBlock(380, 456, 64),
      new PipeBlock(780, 456, 64),
      new PipeBlock(1180, 456, 64),
      new PipeBlock(1580, 456, 64),
      new PipeBlock(1980, 456, 64),

      // Library / Castle Pedestal
      new Platform(2350, 440, 200, 80, { type: 'stone_block' }),

      // Fun decor blocks & coins
      new QuestionBlock(250, 380, 'coin'),
      new Block(282, 380, 32, 32, 'brick'),
      new QuestionBlock(314, 380, 'powerup'),

      new QuestionBlock(1000, 380, 'coin'),
      new QuestionBlock(1400, 380, 'coin'),
      new QuestionBlock(1800, 380, 'coin')
    ];

    // Label each pipe and verify progressive unlock
    const pipeData = [
      { x: 380, key: 'autodisciplina', title: '1. DISCIPLINA' },
      { x: 780, key: 'perseverancia', title: '2. PERSEVERANCIA' },
      { x: 1180, key: 'asertividad', title: '3. ASERTIVIDAD' },
      { x: 1580, key: 'creatividad_innovacion', title: '4. CREATIVIDAD' },
      { x: 1980, key: 'capacidad_planificacion', title: '5. PLANIFICACIÓN' }
    ];

    this.warpPipes = [];
    pipeData.forEach(pData => {
      const pipeObj = this.platforms.find(p => p.type === 'pipe' && p.x === pData.x);
      const isUnlocked = StorageSystem.isLevelUnlocked(pData.key);
      const prog = saveState.completedLevels[pData.key];
      const starStr = prog ? '★'.repeat(prog.stars || 0) : '☆☆☆';

      if (pipeObj) {
        pipeObj.isLocked = !isUnlocked;
        if (isUnlocked) {
          pipeObj.hubLabel = `${pData.title} ${starStr}`;
        } else {
          pipeObj.hubLabel = `🔒 ${pData.title} (Bloqueado)`;
        }

        this.warpPipes.push({
          pipe: pipeObj,
          key: pData.key,
          title: pData.title,
          isUnlocked
        });
      }
    });

    this.platforms.forEach(p => {
      if (p.type === 'question_block') {
        p.onSpawnPowerUp = (x, y) => this.spawnPowerUp(x, y);
      }
    });

    this.collectibles = [
      new Collectible(392, 400, '$', 100),
      new Collectible(792, 400, '$', 100),
      new Collectible(1192, 400, '$', 100),
      new Collectible(1592, 400, '$', 100),
      new Collectible(1992, 400, '$', 100),

      new Collectible(550, 480, '$', 50),
      new Collectible(950, 480, '$', 50),
      new Collectible(1350, 480, '$', 50),
      new Collectible(1750, 480, '$', 50)
    ];

    this.npcs = [
      new NPC(2420, 400, {
        name: 'Mentor Dev (Biblioteca)',
        roleShort: 'LIB',
        roleColor: '#38bdf8',
        checkpointKey: 'library_npc'
      })
    ];
  }

  update(dt) {
    super.update(dt);

    if (!this.player) return;

    // Check Warp Pipe Entry: standing on pipe and pressing [Down]
    for (const wp of this.warpPipes) {
      const pipe = wp.pipe;
      const onPipeTop = Math.abs((this.player.y + this.player.height) - pipe.y) <= 8;
      const withinPipeX = this.player.x + this.player.width > pipe.x + 4 && this.player.x < pipe.x + pipe.width - 4;

      if (onPipeTop && withinPipeX) {
        if (this.engineInput && this.engineInput.down) {
          // Check if level is progressively unlocked
          if (!wp.isUnlocked) {
            audio.playFail();
            const req = StorageSystem.getUnlockRequirement(wp.key);
            if (this.onLockedWarning) {
              this.onLockedWarning(wp.title, req);
            }
            this.engineInput.down = false;
            break;
          }

          audio.playJump();
          if (this.onWarpToLevel) {
            this.onWarpToLevel(wp.key);
          }
          break;
        }
      }
    }

    // Check NPC Library interaction
    const libNpc = this.npcs[0];
    if (libNpc && this.player.intersects(libNpc)) {
      if (!this.libraryOpened) {
        this.libraryOpened = true;
        audio.playCoin();
        if (this.onOpenLibrary) {
          this.onOpenLibrary();
        }
        setTimeout(() => {
          this.libraryOpened = false;
        }, 1500);
      }
    }
  }
}

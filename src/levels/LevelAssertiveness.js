import { LevelBase } from './LevelBase.js';
import { Platform } from '../entities/Platform.js';
import { QuestionBlock, PipeBlock, Block } from '../entities/Block.js';
import { Checkpoint } from '../entities/Checkpoint.js';
import { Flagpole } from '../entities/Flagpole.js';
import { NPC } from '../entities/NPC.js';
import { Collectible } from '../entities/Collectible.js';
import { EnemyBug } from '../entities/EnemyBug.js';

export class LevelAssertiveness extends LevelBase {
  constructor() {
    super('asertividad', 'Asertividad: El Code Review de la Discordia', '#f59e0b', 50);
    this.themeType = 'underground';
  }

  initLevel() {
    super.initLevel();
    this.levelWidth = 3300;

    this.flagpole = new Flagpole(3150, 280, 240);

    // Underground Mine Layout inspired by SMB 1-2 Graph Paper (Image 2):
    // Stepped Pillar Formations, Cavern Ceiling Alcoves, and Subterranean Parkour
    this.platforms = [
      // 1. Starting Cavern Ground (0 to 500)
      new Platform(0, 520, 500, 80, { color: '#0284c7', type: 'ground' }),
      new PipeBlock(360, 456, 64),
      new QuestionBlock(180, 350, 'powerup'),

      // Stepped Underground Pillars (Heights 1, 2, 3 from Image 2!)
      new Block(220, 488, 32, 32, 'stone_block'),
      new Block(252, 456, 32, 64, 'stone_block'),
      new Block(284, 424, 32, 96, 'stone_block'),

      // Chasm 1 (500 to 700) with Falling Donut Platform!
      new Platform(580, 420, 80, 20, { type: 'falling_platform' }),

      // 2. Underground Alcove Island (700 to 1200)
      new Platform(700, 520, 500, 80, { color: '#0284c7', type: 'ground' }),
      new PipeBlock(1060, 456, 64),

      // Elevated Mine Beam Deck for Consensus Red Coin (with safe headroom y=360)
      new Platform(840, 360, 120, 20, { type: 'mushroom' }),

      // Cavern Ceiling Alcove with Stepped Pillars (from Image 2!)
      new Block(920, 488, 32, 32, 'stone_block'),
      new Block(952, 456, 32, 64, 'stone_block'),

      // Chasm 2 (1200 to 1460): Gliding Horizontally Moving Platform!
      new Platform(1280, 380, 90, 20, {
        type: 'moving_platform',
        moveType: 'horizontal',
        moveSpeed: 70,
        moveDistance: 60,
        minX: 1230,
        maxX: 1390
      }),

      // FULL-HEIGHT QUALITY GATE: CONSENSO PR
      new Platform(1460, 0, 20, 520, {
        type: 'quality_gate',
        label: 'GATE: REVIEW',
        gateId: 'assert_gate'
      }),

      // 3. Safe Meeting Cavern (1480 to 2000)
      new Platform(1480, 520, 520, 80, { color: '#0284c7', type: 'ground' }),

      // Chasm 3 (2000 to 2300) with 2 Falling Donut Platforms!
      new Platform(2070, 420, 70, 20, { type: 'falling_platform' }),
      new Platform(2200, 370, 70, 20, { type: 'falling_platform' }),

      // Floating Mine Stone Platform
      new Platform(2330, 340, 120, 24, { type: 'stone_block' }),

      // 4. Final Subterranean Ground to Flagpole (2480 to 3300)
      new Platform(2480, 520, 820, 80, { color: '#0284c7', type: 'ground' }),
      new PipeBlock(2720, 456, 64),
      new QuestionBlock(2900, 350, 'coin')
    ];

    this.platforms.forEach(p => {
      if (p.type === 'question_block') {
        p.onSpawnPowerUp = (x, y) => this.spawnPowerUp(x, y);
      }
    });

    // Abundant Underground Coins & Red Coin (following Image 2 alcove patterns!)
    this.collectibles = [
      // Red Coin Switch (Consensus / PR Approval Key)
      new Collectible(890, 300, '★', 250, 'assert_gate', true),

      // Gold Coins
      new Collectible(120, 480, '$', 50),
      new Collectible(150, 480, '$', 50),
      new Collectible(370, 400, '$', 100), // Above Pipe 1
      new Collectible(610, 370, '$', 100), // Above Donut 1

      // Coin row in alcove (from Image 2!)
      new Collectible(760, 480, '$', 50),
      new Collectible(790, 480, '$', 50),
      new Collectible(820, 480, '$', 50),
      new Collectible(1070, 400, '$', 100), // Above Pipe 2

      new Collectible(1330, 320, '$', 100), // Above Moving Platform
      new Collectible(1520, 480, '$', 50),
      new Collectible(1550, 480, '$', 50),

      new Collectible(2100, 370, '$', 100), // Above Donut 2
      new Collectible(2230, 320, '$', 100), // Above Donut 3
      new Collectible(2380, 290, '$', 150),

      new Collectible(2540, 480, '$', 50),
      new Collectible(2570, 480, '$', 50),
      new Collectible(2730, 400, '$', 100), // Above Pipe 3
      new Collectible(2970, 480, '$', 50)
    ];

    this.enemies = [
      new EnemyBug(780, 492, 80, 55),
      new EnemyBug(1620, 492, 90, 65),
      new EnemyBug(2620, 492, 100, 75)
    ];

    this.checkpoints = [
      new Checkpoint(740, 460, '25%', 'checkpoint_25'),
      new Checkpoint(2500, 460, '75%', 'checkpoint_75_consejo')
    ];

    // Team NPCs
    this.npcs = [
      new NPC(880, 480, {
        name: 'Tech Lead Laura',
        roleShort: 'LEAD',
        roleColor: '#8b5cf6',
        checkpointKey: 'checkpoint_50_testimonio',
        choices: [
          {
            text: "Opción A: 'No estoy de acuerdo, mi código funciona y no tengo por qué cambiarlo.'",
            isAssertive: false,
            feedback: "Reactivo y a la defensiva. Cierra el diálogo técnico y deteriora el clima de equipo."
          },
          {
            text: "Opción B: 'Entiendo tu punto sobre la complejidad ciclomática; propongo extraer este helper para mantenerlo testeable. ¿Qué opinas?'",
            isAssertive: true,
            feedback: "¡Excelente respuesta asertiva! Validas la observación del líder y ofreces una solución constructiva basada en principios técnicos."
          }
        ]
      }),
      new NPC(1780, 480, {
        name: 'Product Owner Carlos',
        roleShort: 'PO',
        roleColor: '#f59e0b',
        checkpointKey: 'checkpoint_50_testimonio',
        choices: [
          {
            text: "Opción A: 'Sí a todo, no te preocupes, lo entregamos mañana sin falta.'",
            isAssertive: false,
            feedback: "Falsa complacencia: genera deuda técnica oculta y burnout asegurado."
          },
          {
            text: "Opción B: 'Para incluir esta nueva funcionalidad con la calidad requerida, debemos postergar una tarea menor o ajustar la fecha dos días.'",
            isAssertive: true,
            feedback: "¡Perfecta negociación asertiva! Estableces límites claros con fundamentos y alternativas transparentes."
          }
        ]
      })
    ];
  }
}

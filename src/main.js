import messagesData from './content/messages.json';
import { GameEngine } from './core/GameEngine.js';
import { StorageSystem, LEVEL_ORDER, LEVEL_NAMES } from './core/StorageSystem.js';

import { LevelHub } from './levels/LevelHub.js';
import { LevelSelfDiscipline } from './levels/LevelSelfDiscipline.js';
import { LevelPerseverance } from './levels/LevelPerseverance.js';
import { LevelAssertiveness } from './levels/LevelAssertiveness.js';
import { LevelCreativity } from './levels/LevelCreativity.js';
import { LevelPlanning } from './levels/LevelPlanning.js';

import { GameOverlayUI } from './ui/GameOverlayUI.js';
import { ResultsUI } from './ui/ResultsUI.js';
import { audio } from './core/AudioSystem.js';

class AppController {
  constructor() {
    this.canvas = document.getElementById('game-canvas');
    this.uiLayer = document.getElementById('ui-layer');

    this.resizeCanvas();
    window.addEventListener('resize', () => this.resizeCanvas());

    this.engine = new GameEngine(this.canvas);
    this.messages = messagesData;

    this.overlayUI = new GameOverlayUI(
      this.uiLayer,
      () => this.showHub(),
      () => this.showResults(),
      (newName) => this.handleNameUpdated(newName)
    );

    this.resultsUI = new ResultsUI(
      this.uiLayer,
      this.messages,
      () => this.showHub()
    );

    this.hudInterval = null;

    // Check if player has set a name; if not, prompt on first load
    const savedName = StorageSystem.getPlayerName();
    if (!savedName || savedName === 'Dev') {
      this.showHub();
      setTimeout(() => {
        this.overlayUI.showNamePromptModal();
      }, 400);
    } else {
      this.showHub();
    }
  }

  handleNameUpdated(newName) {
    if (this.engine.currentLevel && this.engine.currentLevel.skillKey === 'hub_overworld') {
      this.showHub();
    }
  }

  resizeCanvas() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  showHub() {
    if (this.hudInterval) {
      clearInterval(this.hudInterval);
      this.hudInterval = null;
    }

    const hubLevel = new LevelHub(
      (skillKey) => this.startLevel(skillKey),
      () => this.showResults(),
      (title, req) => {
        this.overlayUI.setExtraHint(
          `⚠️ <strong>${title} BLOQUEADO:</strong> ${req}. ¡Supera el anterior con 2★ o más!`
        );
      }
    );

    this.engine.loadLevel(hubLevel, this.messages);
    this.overlayUI.showHUD(
      'MAPA DEL MUNDO: SOFT SKILLS QUEST',
      '#38bdf8',
      'OVERWORLD',
      true // isHub
    );

    this.overlayUI.setExtraHint(
      '🗺️ Camina hacia los 5 tubos verdes y pulsa <strong>[↓]</strong> para entrar al mundo desbloqueado'
    );

    this.engine.start();
    audio.playBGM('overworld');

    this.hudInterval = setInterval(() => {
      if (!this.engine.isRunning) return;
      if (hubLevel && hubLevel.player) {
        this.overlayUI.updateHUDStats(
          0,
          0,
          hubLevel.player.score,
          hubLevel.player.coins,
          3
        );
      }
    }, 100);
  }

  showResults() {
    this.engine.stop();
    audio.stopBGM();
    if (this.hudInterval) {
      clearInterval(this.hudInterval);
      this.hudInterval = null;
    }
    this.resultsUI.render();
  }

  startLevel(skillKey) {
    // Enforce progressive unlocking
    if (!StorageSystem.isLevelUnlocked(skillKey)) {
      const req = StorageSystem.getUnlockRequirement(skillKey);
      this.overlayUI.setExtraHint(`⚠️ <strong>NIVEL BLOQUEADO:</strong> ${req}`);
      return;
    }

    if (this.hudInterval) {
      clearInterval(this.hudInterval);
      this.hudInterval = null;
    }

    let levelInstance = null;
    let skillShort = 'DISCIPLINA';

    switch (skillKey) {
      case 'autodisciplina':
        levelInstance = new LevelSelfDiscipline();
        skillShort = 'DISCIPLINA';
        break;
      case 'perseverancia':
        levelInstance = new LevelPerseverance();
        skillShort = 'PERSEVERANCIA';
        break;
      case 'asertividad':
        levelInstance = new LevelAssertiveness();
        skillShort = 'ASERTIVIDAD';
        break;
      case 'creatividad_innovacion':
        levelInstance = new LevelCreativity();
        skillShort = 'CREATIVIDAD';
        break;
      case 'capacidad_planificacion':
        levelInstance = new LevelPlanning();
        skillShort = 'PLANIFICACIÓN';
        break;
      default:
        console.error('Unknown level skill key:', skillKey);
        return;
    }

    levelInstance.onMessageTrigger = (msgData) => {
      this.overlayUI.showCheckpointModal(msgData);
    };

    levelInstance.onLevelComplete = (resultData) => {
      audio.stopBGM();
      // Check if this completion unlocked the next level
      const currIdx = LEVEL_ORDER.indexOf(skillKey);
      const nextKey = currIdx >= 0 && currIdx < LEVEL_ORDER.length - 1 ? LEVEL_ORDER[currIdx + 1] : null;
      const nextUnlocked = nextKey ? StorageSystem.isLevelUnlocked(nextKey) : false;

      this.overlayUI.showLevelEndModal(
        { ...resultData, nextLevelUnlocked: nextUnlocked },
        () => this.startLevel(skillKey),
        () => {
          // If next is unlocked, proceed directly to next level! Otherwise return to Hub
          if (nextKey && nextUnlocked) {
            this.startLevel(nextKey);
          } else {
            this.showHub();
          }
        },
        () => this.showHub()
      );
    };

    this.engine.loadLevel(levelInstance, this.messages);
    this.overlayUI.showHUD(levelInstance.title, levelInstance.themeColor, skillShort, false);

    // Extra HUD hints for special levels
    if (skillKey === 'creatividad_innovacion') {
      this.overlayUI.setExtraHint('💡 Recoge las <strong>3 Monedas Rojas</strong> desplegando <code>&lt;code_bridge/&gt;</code> con <strong>[B]</strong> para abrir la puerta');
    } else if (skillKey === 'autodisciplina') {
      this.overlayUI.setExtraHint('🔑 Recoge las <strong>Monedas Rojas</strong> para desactivar las barreras láser de linter y tests');
    } else if (skillKey === 'capacidad_planificacion') {
      this.overlayUI.setExtraHint('🏰 Castillo: Recoge las <strong>4 Monedas Rojas</strong> y corre bajo el corredor de <strong>Thwomps</strong> para abrir la puerta');
    }

    const introMsg = this.messages[skillKey]?.intro || 'Reflexiona sobre esta habilidad mientras juegas el nivel.';
    StorageSystem.unlockMessage(skillKey, 'intro');

    // Blueprint preview for Level 5
    let extraAction = null;
    if (skillKey === 'capacidad_planificacion') {
      extraAction = {
        html: `
          <div class="blueprint-box">
            <h4>📐 VISTA PREVIA DEL BLUEPRINT ARQUITECTÓNICO</h4>
            <div class="blueprint-ascii">
              [SPAWN] ➔ [Pipe 1] ➔ [Moneda Roja Blueprint] ➔ [Puentes de Arquitectura] ➔ [Arch Gate Abierto] ➔ [BANDERÍN]
            </div>
            <p class="blueprint-tip">Planifica tus saltos en el calabozo del castillo y gestiona tus recursos para alcanzar la meta sin improvisaciones.</p>
          </div>
        `
      };
    }

    this.overlayUI.showIntroModal(
      levelInstance.title,
      skillShort,
      introMsg,
      () => {
        this.engine.start();
        audio.playBGM(skillKey);
      },
      extraAction
    );

    this.hudInterval = setInterval(() => {
      if (!this.engine.isRunning) return;
      if (levelInstance && levelInstance.player) {
        this.overlayUI.updateHUDStats(
          levelInstance.timeSpent,
          levelInstance.player.deaths,
          levelInstance.player.score,
          levelInstance.player.coins
        );
      }
    }, 100);
  }
}

window.addEventListener('DOMContentLoaded', () => {
  new AppController();
});

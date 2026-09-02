import { Renderer } from './Renderer.js';
import { audio } from './AudioSystem.js';

export class GameEngine {
  constructor(canvas) {
    this.canvas = canvas;
    this.renderer = new Renderer(canvas);

    this.currentLevel = null;
    this.cameraX = 0;
    this.isRunning = false;
    this.lastTime = 0;

    this.input = {
      left: false,
      right: false,
      jump: false,
      down: false,
      action: false
    };

    this.setupInput();
  }

  setupInput() {
    window.addEventListener('keydown', (e) => {
      const code = e.code || '';
      const key = (e.key || '').toLowerCase();

      if (code === 'ArrowLeft' || key === 'arrowleft' || key === 'a') {
        this.input.left = true;
        e.preventDefault();
      }
      if (code === 'ArrowRight' || key === 'arrowright' || key === 'd') {
        this.input.right = true;
        e.preventDefault();
      }
      if (code === 'ArrowDown' || key === 'arrowdown' || key === 's') {
        this.input.down = true;
        e.preventDefault();
      }
      if (code === 'ArrowUp' || key === 'arrowup' || key === 'w' || code === 'Space' || key === ' ') {
        if (!this.input.jump) {
          audio.init();
        }
        this.input.jump = true;
        e.preventDefault();
      }

      // Proactive Code Bridge Deployment for Level 4
      if ((code === 'KeyB' || key === 'b') && this.currentLevel && this.currentLevel.skillKey === 'creatividad_innovacion') {
        const p = this.currentLevel.player;
        if (p) {
          // Spawn right under feet extending forward
          const spawnX = p.facing === 'right' ? p.x - 10 : p.x - 110;
          const spawnY = Math.round(p.y + p.height);
          this.currentLevel.spawnBridge(spawnX, spawnY);
        }
      }
    });

    window.addEventListener('keyup', (e) => {
      const code = e.code || '';
      const key = (e.key || '').toLowerCase();

      if (code === 'ArrowLeft' || key === 'arrowleft' || key === 'a') {
        this.input.left = false;
      }
      if (code === 'ArrowRight' || key === 'arrowright' || key === 'd') {
        this.input.right = false;
      }
      if (code === 'ArrowDown' || key === 'arrowdown' || key === 's') {
        this.input.down = false;
      }
      if (code === 'ArrowUp' || key === 'arrowup' || key === 'w' || code === 'Space' || key === ' ') {
        this.input.jump = false;
      }
    });

    window.addEventListener('click', () => {
      window.focus();
    });
  }

  loadLevel(levelInstance, messagesContent) {
    this.currentLevel = levelInstance;
    if (messagesContent && messagesContent[levelInstance.skillKey]) {
      this.currentLevel.setMessages(messagesContent[levelInstance.skillKey]);
    }
    this.currentLevel.engineInput = this.input;
    this.currentLevel.initLevel();
    this.cameraX = 0;
  }

  start() {
    this.isRunning = true;
    this.lastTime = performance.now();
    requestAnimationFrame((t) => this.loop(t));
  }

  stop() {
    this.isRunning = false;
    this.input.left = false;
    this.input.right = false;
    this.input.jump = false;
    this.input.down = false;
  }

  loop(currentTime) {
    if (!this.isRunning) return;

    const dt = Math.min((currentTime - this.lastTime) / 1000, 0.05);
    this.lastTime = currentTime;

    if (this.currentLevel) {
      this.currentLevel.update(dt);
      this.renderer.updateAnimTime(dt);

      // Camera horizontal tracking
      if (this.currentLevel.player) {
        const targetCamX = this.currentLevel.player.x - this.canvas.width / 3;
        const maxCamX = Math.max(0, this.currentLevel.levelWidth - this.canvas.width);
        this.cameraX += (Math.max(0, Math.min(targetCamX, maxCamX)) - this.cameraX) * 0.1;
      }

      // Render frame with level theme
      this.renderer.clear();
      this.renderer.drawBackground(this.cameraX, this.currentLevel.themeColor, this.currentLevel.themeType);

      // Draw Piranha Plants BEHIND pipes (authentic NES/SNES layering)
      if (this.currentLevel.piranhaPlants) {
        this.currentLevel.piranhaPlants.forEach(pp => this.renderer.drawPiranhaPlant(pp, this.cameraX));
      }

      // Draw Blocks & Platforms (Pipes will cleanly mask the Piranha body inside the pipe!)
      this.currentLevel.platforms.forEach(p => this.renderer.drawBlock(p, this.cameraX));
      this.currentLevel.collectibles.filter(c => c.active).forEach(c => this.renderer.drawCollectible(c, this.cameraX));
      this.currentLevel.powerUps.filter(pu => pu.active).forEach(pu => this.renderer.drawPowerUp(pu, this.cameraX));
      this.currentLevel.enemies.filter(e => e.active).forEach(e => this.renderer.drawEnemy(e, this.cameraX));
      if (this.currentLevel.thwomps) {
        this.currentLevel.thwomps.forEach(tw => this.renderer.drawThwomp(tw, this.cameraX));
      }
      this.currentLevel.checkpoints.forEach(cp => this.renderer.drawCheckpoint(cp, this.cameraX));
      if (this.currentLevel.flagpole) this.renderer.drawFlagpole(this.currentLevel.flagpole, this.cameraX);
      this.currentLevel.npcs.forEach(npc => this.renderer.drawNPC(npc, this.cameraX));

      if (this.currentLevel.player) {
        this.renderer.drawPlayer(this.currentLevel.player, this.cameraX);
      }
    }

    requestAnimationFrame((t) => this.loop(t));
  }
}

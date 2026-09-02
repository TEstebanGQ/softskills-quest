import { Player } from '../entities/Player.js';
import { thingHittr } from '../core/ThingHittr.js';
import { audio } from '../core/AudioSystem.js';
import { StorageSystem } from '../core/StorageSystem.js';

export class LevelBase {
  constructor(skillKey, title, themeColor = '#6366f1', idealTimeSeconds = 60) {
    this.skillKey = skillKey;
    this.title = title;
    this.themeColor = themeColor;
    this.themeType = 'overworld';
    this.idealTimeSeconds = idealTimeSeconds;

    this.player = null;
    this.platforms = [];
    this.collectibles = [];
    this.enemies = [];
    this.piranhaPlants = [];
    this.thwomps = [];
    this.checkpoints = [];
    this.npcs = [];
    this.powerUps = [];
    this.flagpole = null;

    this.levelWidth = 3200;
    this.levelHeight = 600;
    this.timeSpent = 0;
    this.attempts = 1;
    this.isCompleted = false;
    this.isPaused = false;
    this.isFlagSliding = false;
    this.isVictoryWalking = false;
    this.victoryWalkTimer = 0;

    this.messages = {};
    this.onMessageTrigger = null;
    this.onLevelComplete = null;
  }

  setMessages(messagesForSkill) {
    this.messages = messagesForSkill || {};
  }

  initLevel() {
    this.player = new Player(100, 450);
    this.timeSpent = 0;
    this.isCompleted = false;
    this.isPaused = false;
    this.isFlagSliding = false;
    this.isVictoryWalking = false;
    this.victoryWalkTimer = 0;
    this.powerUps = [];
    this.piranhaPlants = [];
    this.thwomps = [];
  }

  spawnPowerUp(x, y) {
    import('../entities/PowerUp.js').then(({ PowerUp }) => {
      const p = new PowerUp(x, y);
      this.powerUps.push(p);
      audio.playPowerUp();
    });
  }

  update(dt) {
    if (this.isPaused || this.isCompleted) return;

    this.timeSpent += dt;

    // Update platforms / blocks / flagpole
    this.platforms.forEach(p => p.update(dt));

    // Update enemies with platform collisions & edge detection
    this.enemies.forEach(e => e.update(dt, this.platforms));

    // Update Piranha Plants & Thwomps
    this.piranhaPlants.forEach(pp => pp.update(dt, this.player));
    this.thwomps.forEach(tw => tw.update(dt, this.player));

    if (this.flagpole) this.flagpole.update(dt);

    // Update Power-ups
    this.powerUps.forEach(p => {
      if (p.active) {
        p.updatePhysics(dt, this.platforms);
        if (!p.isEmerging && this.player.intersects(p)) {
          p.active = false;
          this.player.powerUp();
          audio.playCoin();
        }
      }
    });

    // 1. Classic Mario Flagpole Sliding State
    if (this.isFlagSliding) {
      const bottomY = this.flagpole.y + this.flagpole.height - this.player.height - 10;
      if (this.player.y < bottomY) {
        this.player.y += 180 * dt;
        this.player.vx = 0;
      } else {
        this.player.y = bottomY;
        this.isFlagSliding = false;
        this.isVictoryWalking = true;
        this.victoryWalkTimer = 0;
      }
      return;
    }

    // 2. Classic Mario Victory Walk towards base
    if (this.isVictoryWalking) {
      this.player.facing = 'right';
      this.player.vx = 140;
      this.player.x += this.player.vx * dt;
      this.victoryWalkTimer += dt;
      if (this.victoryWalkTimer >= 1.2) {
        this.isVictoryWalking = false;
        this.player.vx = 0;
        this.handleGoalReached();
      }
      return;
    }

    // Player Physics & Controls
    const jumped = this.player.handleInput(this.engineInput, dt);
    if (jumped) audio.playJump();

    this.player.updatePhysics(dt, this.platforms);

    // Pitfall death check
    if (this.player.y > this.levelHeight + 100) {
      audio.playFail();
      this.player.resetToSpawn();
      this.attempts++;
    }

    // Check collisions with collectibles (Coins & Red Coins)
    this.collectibles.forEach(item => {
      if (item.active && this.player.intersects(item)) {
        item.active = false;
        this.player.score += item.points;
        this.player.coins++;
        audio.playCoin();
        this.onItemCollected(item);
      }
    });

    // Enemy Stomp vs Side Collision
    this.enemies.forEach(e => {
      if (e.active && !e.isSquished) {
        const collisionType = thingHittr.checkEnemyCollision(this.player, e);
        if (collisionType === 'stomp') {
          thingHittr.stompEnemy(this.player, e);
          audio.playStomp();
        } else if (collisionType === 'hit') {
          audio.playFail();
          this.player.resetToSpawn();
          this.attempts++;
        }
      }
    });

    // Piranha Plant Collision (Deadly when emerging)
    this.piranhaPlants.forEach(pp => {
      if (pp.active && pp.state !== 'hidden' && pp.state !== 'cooldown') {
        if (this.player.intersects(pp)) {
          audio.playFail();
          this.player.resetToSpawn();
          this.attempts++;
        }
      }
    });

    // Thwomp Collision (Deadly crushing contact)
    this.thwomps.forEach(tw => {
      if (tw.active && this.player.intersects(tw)) {
        audio.playFail();
        this.player.resetToSpawn();
        this.attempts++;
      }
    });

    // Check Flagpole collision
    if (this.flagpole && !this.isFlagSliding && !this.isVictoryWalking && this.player.intersects(this.flagpole)) {
      this.isFlagSliding = true;
      this.player.x = this.flagpole.x + 6;
      this.flagpole.startSlide();
      audio.playFlagpole();
    }

    // Check Checkpoints (25%, 50%, 75%)
    this.checkpoints.forEach(cp => {
      if (!cp.reached && this.player.intersects(cp)) {
        cp.reached = true;
        this.player.setSpawn(cp.x, cp.y - 20);
        audio.playCheckpoint();
        StorageSystem.unlockMessage(this.skillKey, cp.checkpointKey);

        if (cp.isGoal) {
          this.handleGoalReached();
        } else if (this.messages[cp.checkpointKey]) {
          this.triggerMessage(cp.checkpointKey, this.messages[cp.checkpointKey]);
        }
      }
    });

    // Check NPCs
    this.npcs.forEach(npc => {
      if (!npc.dialogueTriggered && this.player.intersects(npc)) {
        npc.dialogueTriggered = true;
        audio.playCoin();
        if (this.messages[npc.checkpointKey]) {
          this.triggerMessage(npc.checkpointKey, this.messages[npc.checkpointKey], npc);
        }
      }
    });
  }

  onItemCollected(item) {
    // Quality Gate Switch opening (supports multi-coin gates)
    if (item.gateId) {
      const gate = this.platforms.find(p => p.gateId === item.gateId);
      if (gate) {
        if (gate.requiredCoins && gate.requiredCoins > 1) {
          gate.collectedCoins = (gate.collectedCoins || 0) + 1;
          if (gate.collectedCoins >= gate.requiredCoins) {
            gate.passed = true;
            gate.isPassable = true;
            audio.playPowerUp();
          }
        } else {
          gate.passed = true;
          gate.isPassable = true;
          audio.playPowerUp();
        }
      }
    }
  }

  triggerMessage(momentKey, textContent, npcObj = null) {
    if (this.onMessageTrigger) {
      this.isPaused = true;
      this.onMessageTrigger({
        momentKey,
        title: this.getMomentTitle(momentKey),
        text: textContent,
        npc: npcObj,
        onClose: () => {
          this.isPaused = false;
        }
      });
    }
  }

  getMomentTitle(momentKey) {
    switch (momentKey) {
      case 'checkpoint_25': return '💪 Checkpoint 1 (25%) - Tono Coach';
      case 'checkpoint_50_testimonio': return '💬 Checkpoint 2 (50%) - Testimonio de Compañero';
      case 'checkpoint_75_consejo': return '💡 Checkpoint 3 (75%) - Consejo Práctico';
      case 'final_bajo_desempeno': return '🔄 Final de Nivel - Feedback Constructivo';
      case 'final_alto_desempeno': return '⭐ Final de Nivel - Refuerzo Positivo';
      default: return 'Mensaje del Nivel';
    }
  }

  handleGoalReached() {
    this.isCompleted = true;

    const isLowPerformance = (this.player.deaths > 2) || (this.timeSpent > this.idealTimeSeconds * 1.5);
    const performanceTier = isLowPerformance ? 'low' : 'high';
    const finalMessageKey = isLowPerformance ? 'final_bajo_desempeno' : 'final_alto_desempeno';
    const finalMessageText = this.messages[finalMessageKey];

    const stars = isLowPerformance ? (this.player.deaths > 4 ? 1 : 2) : 3;
    const finalScore = Math.max(100, 1000 + this.player.score + (this.player.coins * 50) - (this.player.deaths * 150) - Math.round(this.timeSpent * 5));

    if (isLowPerformance) {
      audio.playFail();
    } else {
      audio.playSuccess();
    }

    const summary = StorageSystem.saveLevelCompletion(this.skillKey, {
      score: finalScore,
      timeSeconds: Math.round(this.timeSpent),
      attempts: this.attempts + this.player.deaths,
      stars,
      performanceTier,
      finalMessageKey
    });

    if (this.onLevelComplete) {
      this.onLevelComplete({
        skillKey: this.skillKey,
        score: finalScore,
        timeSeconds: Math.round(this.timeSpent),
        deaths: this.player.deaths,
        stars,
        performanceTier,
        messageTitle: this.getMomentTitle(finalMessageKey),
        messageText: finalMessageText
      });
    }
  }
}

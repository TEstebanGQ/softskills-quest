import { audio } from '../core/AudioSystem.js';
import { StorageSystem } from '../core/StorageSystem.js';

export class GameOverlayUI {
  constructor(container, onBackToHub, onOpenLibrary, onNameChanged) {
    this.container = container;
    this.onBackToHub = onBackToHub;
    this.onOpenLibrary = onOpenLibrary;
    this.onNameChanged = onNameChanged;
    this.hudElement = null;
    this.modalElement = null;
    this.isHubMode = false;
    this.activeModalType = null; // 'intro' | 'checkpoint' | 'end' | 'name'

    this.setupKeyboardShortcuts();
  }

  setupKeyboardShortcuts() {
    window.addEventListener('keydown', (e) => {
      // If modal is active and visible, Space or Enter triggers primary button
      if (this.modalElement && !this.modalElement.classList.contains('hidden')) {
        const isSpace = e.code === 'Space' || e.key === ' ';
        const isEnter = e.code === 'Enter' || e.key === 'Enter';

        // Check if typing into an input field (e.g. name input)
        const activeInput = document.activeElement;
        const isTyping = activeInput && (activeInput.tagName === 'INPUT' || activeInput.tagName === 'TEXTAREA');

        if (isEnter && isTyping) {
          const submitBtn = this.modalElement.querySelector('#btn-save-name');
          if (submitBtn) {
            submitBtn.click();
            e.preventDefault();
            return;
          }
        }

        if ((isSpace && !isTyping) || isEnter) {
          // Look for primary action button to click
          const primaryBtn =
            this.modalElement.querySelector('#btn-start-play') ||
            this.modalElement.querySelector('#btn-close-modal') ||
            this.modalElement.querySelector('#btn-end-next') ||
            this.modalElement.querySelector('#btn-save-name');

          if (primaryBtn && primaryBtn.style.display !== 'none' && !primaryBtn.classList.contains('disabled')) {
            primaryBtn.click();
            e.preventDefault();
            e.stopPropagation();
          }
        }
      }
    });
  }

  showHUD(levelTitle, themeColor = '#6366f1', skillShort = 'DISCIPLINA', isHub = false) {
    this.isHubMode = isHub;
    const playerName = StorageSystem.getPlayerName();

    this.container.innerHTML = `
      <div class="hud-arcade-container">
        <div class="hud-quick-controls">
          <button id="btn-hud-name" class="hud-btn-retro" title="Cambiar Nombre de Jugador">👤 ${playerName}</button>
          ${isHub ? `
            <button id="btn-hud-library" class="hud-btn-retro hud-btn-highlight">🏛️ BIBLIOTECA (30)</button>
          ` : `
            <button id="btn-hud-back" class="hud-btn-retro">⬅ MAPA HUB</button>
          `}
          <button id="btn-hud-audio" class="hud-btn-retro">🔊 SONIDO</button>
        </div>

        <div class="hud-arcade-grid">
          <div class="hud-col">
            <span class="hud-label">JUGADOR</span>
            <span id="hud-player-tag" class="hud-value">${playerName.toUpperCase()}-DEV</span>
          </div>
          <div class="hud-col">
            <span class="hud-label">PUNTOS</span>
            <span id="hud-score" class="hud-value">000000</span>
          </div>
          <div class="hud-col">
            <span class="hud-label">MONEDAS</span>
            <span id="hud-coins" class="hud-value">x00</span>
          </div>
          <div class="hud-col">
            <span class="hud-label">HABILIDAD</span>
            <span id="hud-skill" class="hud-value" style="color: ${themeColor}">${skillShort.toUpperCase()}</span>
          </div>
          <div class="hud-col">
            <span class="hud-label">${isHub ? 'ZONA' : 'TIEMPO'}</span>
            <span id="hud-time" class="hud-value">${isHub ? 'HUB' : '320'}</span>
          </div>
          <div class="hud-col">
            <span class="hud-label">VIDAS</span>
            <span id="hud-lives" class="hud-value">x3</span>
          </div>
        </div>

        <div id="hud-extra-hint" class="hud-extra-hint"></div>
      </div>
      <div id="modal-layer" class="modal-overlay hidden"></div>
    `;

    this.hudElement = this.container.querySelector('.hud-arcade-container');
    this.modalElement = this.container.querySelector('#modal-layer');

    const nameBtn = this.container.querySelector('#btn-hud-name');
    if (nameBtn) {
      nameBtn.addEventListener('click', () => {
        this.showNamePromptModal();
      });
    }

    const backBtn = this.container.querySelector('#btn-hud-back');
    if (backBtn) {
      backBtn.addEventListener('click', () => {
        audio.playPickup();
        if (this.onBackToHub) this.onBackToHub();
      });
    }

    const libBtn = this.container.querySelector('#btn-hud-library');
    if (libBtn) {
      libBtn.addEventListener('click', () => {
        audio.playPickup();
        if (this.onOpenLibrary) this.onOpenLibrary();
      });
    }

    const audioBtn = this.container.querySelector('#btn-hud-audio');
    audioBtn.addEventListener('click', () => {
      const enabled = audio.toggleSound();
      audioBtn.textContent = enabled ? '🔊 SONIDO' : '🔇 MUDO';
    });
  }

  showNamePromptModal(onDone = null) {
    this.modalElement.classList.remove('hidden');
    this.activeModalType = 'name';
    const currentName = StorageSystem.getPlayerName();

    this.modalElement.innerHTML = `
      <div class="modal-card name-card">
        <div class="modal-badge">Perfil de Desarrollador</div>
        <h2>🎮 Nombre del Dev</h2>
        <div class="modal-content-box">
          <p class="modal-desc">Ingresa tu nombre o nickname para personalizar las reflexiones y el HUD:</p>
          <input 
            type="text" 
            id="player-name-input" 
            value="${currentName !== 'Dev' ? currentName : ''}" 
            placeholder="Tu Nombre (Ej: Alex, Laura, Dev)" 
            maxlength="16"
            style="
              width: 100%;
              padding: 0.8rem 1rem;
              margin-top: 0.8rem;
              background: rgba(15, 23, 42, 0.9);
              border: 2px solid #6366f1;
              border-radius: 8px;
              color: #f8fafc;
              font-family: var(--font-arcade);
              font-size: 0.9rem;
            "
          />
        </div>
        <div class="modal-controls">
          <button id="btn-save-name" class="btn btn-primary btn-large">
            Guardar y Continuar [SPACE ␣]
          </button>
        </div>
      </div>
    `;

    const input = this.modalElement.querySelector('#player-name-input');
    input.focus();

    const saveBtn = this.modalElement.querySelector('#btn-save-name');
    saveBtn.addEventListener('click', () => {
      const entered = input.value.trim() || 'Dev';
      StorageSystem.setPlayerName(entered);
      audio.playCoin();
      this.modalElement.classList.add('hidden');
      this.activeModalType = null;

      // Update name in HUD
      const nameBtn = this.container.querySelector('#btn-hud-name');
      if (nameBtn) nameBtn.textContent = `👤 ${entered}`;
      const tag = this.container.querySelector('#hud-player-tag');
      if (tag) tag.textContent = `${entered.toUpperCase()}-DEV`;

      if (onDone) onDone(entered);
      if (this.onNameChanged) this.onNameChanged(entered);
    });
  }

  setExtraHint(text) {
    const hintEl = this.container.querySelector('#hud-extra-hint');
    if (hintEl) {
      hintEl.innerHTML = text || '';
    }
  }

  updateHUDStats(timeSeconds, deaths, score, coins = 0, lives = 3) {
    const tEl = this.container.querySelector('#hud-time');
    const lEl = this.container.querySelector('#hud-lives');
    const sEl = this.container.querySelector('#hud-score');
    const cEl = this.container.querySelector('#hud-coins');

    if (!this.isHubMode && tEl) {
      tEl.textContent = String(Math.max(0, 400 - Math.round(timeSeconds))).padStart(3, '0');
    }
    if (lEl) lEl.textContent = `x${Math.max(1, 3 - deaths)}`;
    if (sEl) sEl.textContent = String(score).padStart(6, '0');
    if (cEl) cEl.textContent = `x${String(coins).padStart(2, '0')}`;
  }

  showIntroModal(title, skillName, introText, onStart, extraAction = null) {
    this.modalElement.classList.remove('hidden');
    this.activeModalType = 'intro';
    const playerName = StorageSystem.getPlayerName();

    this.modalElement.innerHTML = `
      <div class="modal-card intro-card">
        <div class="modal-badge">Momento 1 de 6 (Reflexión Inicial)</div>
        <h2>🚀 ${title}</h2>
        <div class="modal-content-box">
          <p style="color: #38bdf8; font-weight: 700; margin-bottom: 0.5rem;">Hola, ${playerName}:</p>
          <p class="modal-desc">${introText}</p>
        </div>
        ${extraAction ? `<div class="modal-blueprint-preview">${extraAction.html}</div>` : ''}
        <div class="modal-controls">
          <button id="btn-start-play" class="btn btn-primary btn-large">
            Comenzar Nivel [SPACE ␣] ▶
          </button>
        </div>
      </div>
    `;

    this.modalElement.querySelector('#btn-start-play').addEventListener('click', () => {
      this.modalElement.classList.add('hidden');
      this.activeModalType = null;
      audio.playCoin();
      if (onStart) onStart();
    });
  }

  showCheckpointModal(checkpointData) {
    const { momentKey, title, text, npc, onClose } = checkpointData;
    this.modalElement.classList.remove('hidden');
    this.activeModalType = 'checkpoint';
    const playerName = StorageSystem.getPlayerName();

    const hasChoices = npc && npc.choices && npc.choices.length > 0;

    this.modalElement.innerHTML = `
      <div class="modal-card">
        <div class="modal-badge">${title}</div>
        ${npc ? `<div class="npc-header">👤 <strong>${npc.name}</strong> para <strong>${playerName}</strong>:</div>` : ''}
        <div class="modal-content-box">
          <p>"${text}"</p>
        </div>

        ${hasChoices ? `
          <div class="dialogue-choices-box">
            <p class="choices-title">🗣️ ${playerName}, selecciona tu respuesta de comunicación asertiva:</p>
            <div class="choices-list">
              ${npc.choices.map((c, i) => `
                <button class="btn-choice" data-index="${i}">
                  ${c.text}
                </button>
              `).join('')}
            </div>
            <div id="choice-feedback" class="choice-feedback hidden"></div>
          </div>
        ` : ''}

        <div class="modal-controls">
          <button id="btn-close-modal" class="btn btn-primary" ${hasChoices ? 'style="display:none"' : ''}>
            Continuar [SPACE ␣] ➔
          </button>
        </div>
      </div>
    `;

    const closeBtn = this.modalElement.querySelector('#btn-close-modal');

    if (hasChoices) {
      const choiceBtns = this.modalElement.querySelectorAll('.btn-choice');
      const feedbackEl = this.modalElement.querySelector('#choice-feedback');

      choiceBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          const idx = parseInt(btn.getAttribute('data-index'), 10);
          const choice = npc.choices[idx];

          choiceBtns.forEach(b => b.classList.add('disabled'));
          btn.classList.add(choice.isAssertive ? 'choice-correct' : 'choice-incorrect');

          feedbackEl.classList.remove('hidden');
          feedbackEl.innerHTML = `
            <strong>${choice.isAssertive ? '✓ Excelente Elección Asertiva:' : '⚠️ Oportunidad de Aprendizaje:'}</strong>
            <p>${choice.feedback}</p>
          `;

          if (choice.isAssertive) {
            audio.playCoin();
          } else {
            audio.playFail();
          }

          closeBtn.style.display = 'inline-flex';
          closeBtn.focus();
        });
      });
    }

    closeBtn.addEventListener('click', () => {
      this.modalElement.classList.add('hidden');
      this.activeModalType = null;
      audio.playCoin();
      if (onClose) onClose();
    });
  }

  showLevelEndModal(resultData, onRetry, onNextLevel, onMenu) {
    const { score, timeSeconds, deaths, stars, performanceTier, messageTitle, messageText, nextLevelUnlocked } = resultData;
    this.modalElement.classList.remove('hidden');
    this.activeModalType = 'end';
    const playerName = StorageSystem.getPlayerName();

    const isHigh = performanceTier === 'high';
    const starDisplay = '⭐'.repeat(stars);

    this.modalElement.innerHTML = `
      <div class="modal-card end-card ${isHigh ? 'card-high-perf' : 'card-low-perf'}">
        <div class="modal-badge">${isHigh ? `🏆 ¡Gran Trabajo, ${playerName}!` : `🔄 ${playerName}, Oportunidad de Mejora`}</div>
        <div class="end-stars">${starDisplay}</div>
        <h2>Puntaje: ${score.toLocaleString()} pts</h2>

        <div class="end-stats-row">
          <span>⏱️ Tiempo: ${timeSeconds}s</span>
          <span>💀 Caídas: ${deaths}</span>
        </div>

        ${stars < 2 ? `
          <div style="background: rgba(239, 68, 68, 0.2); border: 1px solid #ef4444; border-radius: 8px; padding: 0.6rem; color: #fca5a5; font-size: 0.85rem;">
            ⚠️ Necesitas al menos <strong>2 Estrellas (2★)</strong> para desbloquear el siguiente mundo. ¡Intenta superarlo con menos caídas!
          </div>
        ` : (nextLevelUnlocked ? `
          <div style="background: rgba(34, 197, 94, 0.2); border: 1px solid #22c55e; border-radius: 8px; padding: 0.6rem; color: #86efac; font-size: 0.85rem;">
            🎉 ¡Completado con ${stars}★! El siguiente mundo ha sido <strong>DESBLOQUEADO</strong>.
          </div>
        ` : '')}

        <div class="modal-content-box end-message-box">
          <span class="message-tag">${messageTitle}</span>
          <p class="end-quote">"${messageText}"</p>
        </div>

        <div class="modal-controls flex-gap">
          <button id="btn-end-retry" class="btn btn-secondary">🔄 Reintentar</button>
          <button id="btn-end-menu" class="btn btn-secondary">🗺️ Mapa Hub</button>
          <button id="btn-end-next" class="btn btn-primary">Continuar [SPACE ␣]</button>
        </div>
      </div>
    `;

    this.modalElement.querySelector('#btn-end-retry').addEventListener('click', () => {
      this.modalElement.classList.add('hidden');
      this.activeModalType = null;
      if (onRetry) onRetry();
    });

    this.modalElement.querySelector('#btn-end-menu').addEventListener('click', () => {
      this.modalElement.classList.add('hidden');
      this.activeModalType = null;
      if (onMenu) onMenu();
    });

    this.modalElement.querySelector('#btn-end-next').addEventListener('click', () => {
      this.modalElement.classList.add('hidden');
      this.activeModalType = null;
      if (onNextLevel) onNextLevel();
    });
  }
}

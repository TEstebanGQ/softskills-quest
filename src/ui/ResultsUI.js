import { StorageSystem } from '../core/StorageSystem.js';
import { LEVEL_METADATA } from './MenuUI.js';
import { audio } from '../core/AudioSystem.js';

export class ResultsUI {
  constructor(container, allMessages, onBackToMenu) {
    this.container = container;
    this.allMessages = allMessages || {};
    this.onBackToMenu = onBackToMenu;
    this.activeFilterSkill = 'all';
  }

  render() {
    const saveState = StorageSystem.load();

    let unlockedMsgCount = 0;
    Object.values(saveState.messagesUnlocked).forEach(list => {
      unlockedMsgCount += list.length;
    });

    const momentsKeys = [
      { key: 'intro', label: '1. Intro' },
      { key: 'checkpoint_25', label: '2. Checkpoint 25%' },
      { key: 'checkpoint_50_testimonio', label: '3. NPC 50%' },
      { key: 'checkpoint_75_consejo', label: '4. Consejos 75%' },
      { key: 'final_bajo_desempeno', label: '5. Final Bajo Desempeño' },
      { key: 'final_alto_desempeno', label: '6. Final Alto Desempeño' }
    ];

    this.container.innerHTML = `
      <div class="results-wrapper">
        <header class="results-header">
          <div>
            <h1>📊 Dashboard de Desempeño & Biblioteca de Habilidades</h1>
            <p>Consolidado de progreso e itinerario de las 30 reflexiones de ingeniería de software</p>
          </div>
          <button id="btn-results-back" class="btn btn-primary">⬅ Volver al Menú</button>
        </header>

        <div class="metrics-grid">
          <div class="metric-card">
            <span class="metric-value">${saveState.stats.totalScore.toLocaleString()}</span>
            <span class="metric-label">Puntaje Global Acumulado</span>
          </div>
          <div class="metric-card">
            <span class="metric-value">${saveState.stats.levelsFinished} / 5</span>
            <span class="metric-label">Mapas Completados</span>
          </div>
          <div class="metric-card">
            <span class="metric-value">${unlockedMsgCount} / 30</span>
            <span class="metric-label">Mensajes Desbloqueados</span>
          </div>
          <div class="metric-card">
            <span class="metric-value">${saveState.stats.totalTimeSpent}s</span>
            <span class="metric-label">Tiempo Total en Juego</span>
          </div>
        </div>

        <div class="library-section">
          <h2>📚 Biblioteca de los 30 Mensajes por Habilidad (6 × 5)</h2>
          <div class="filter-bar">
            <button class="filter-btn active" data-filter="all">Todos (30)</button>
            ${LEVEL_METADATA.map(meta => `
              <button class="filter-btn" data-filter="${meta.key}">${meta.icon} ${meta.title.split('. ')[1]}</button>
            `).join('')}
          </div>

          <div class="messages-library-grid">
            ${LEVEL_METADATA.map(meta => {
              const skillMessages = this.allMessages[meta.key] || {};
              const unlockedList = saveState.messagesUnlocked[meta.key] || [];

              return `
                <div class="skill-group-card" data-skill="${meta.key}" style="--accent-color: ${meta.color}">
                  <div class="skill-group-header">
                    <h3>${meta.icon} ${meta.title}</h3>
                    <span class="unlocked-badge">${unlockedList.length} / 6 Vistas</span>
                  </div>
                  <div class="skill-moments-list">
                    ${momentsKeys.map(m => {
                      const text = skillMessages[m.key] || 'Mensaje no disponible';
                      const isUnlocked = unlockedList.includes(m.key);

                      return `
                        <div class="moment-box ${isUnlocked ? 'unlocked' : 'locked'}">
                          <div class="moment-header">
                            <span class="moment-label">${m.label}</span>
                            <span class="status-icon">${isUnlocked ? '🔓 Desbloqueado' : '🔒 Por explorar'}</span>
                          </div>
                          <p class="moment-text">
                            ${isUnlocked ? `"${text}"` : `<em>Juega el mapa de <strong>${meta.title}</strong> para desbloquear este mensaje.</em>`}
                          </p>
                        </div>
                      `;
                    }).join('')}
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <div class="results-footer">
          <button id="btn-reset-data" class="btn btn-danger-outline">🗑️ Reiniciar Progreso</button>
        </div>
      </div>
    `;

    // Event Listeners
    this.container.querySelector('#btn-results-back').addEventListener('click', () => {
      audio.playPickup();
      if (this.onBackToMenu) this.onBackToMenu();
    });

    const resetBtn = this.container.querySelector('#btn-reset-data');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        if (confirm('¿Estás seguro de reiniciar todo tu progreso y mensajes desbloqueados?')) {
          StorageSystem.resetProgress();
          this.render();
        }
      });
    }

    // Filters
    const filterBtns = this.container.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.getAttribute('data-filter');

        const groups = this.container.querySelectorAll('.skill-group-card');
        groups.forEach(g => {
          if (filter === 'all' || g.getAttribute('data-skill') === filter) {
            g.style.display = 'block';
          } else {
            g.style.display = 'none';
          }
        });
      });
    });
  }
}

import { StorageSystem } from '../core/StorageSystem.js';
import { audio } from '../core/AudioSystem.js';

export const LEVEL_METADATA = [
  {
    key: 'autodisciplina',
    title: '1. Autodisciplina',
    subtitle: 'La Rutina CI/CD & Gates de Calidad',
    icon: '⚡',
    color: '#6366f1',
    description: 'Aprende a mantener altos estándares de código y pruebas sin ceder ante la tentación de atajos destructivos.'
  },
  {
    key: 'perseverancia',
    title: '2. Perseverancia',
    subtitle: 'Refactorizando el Monolito',
    icon: '🛡️',
    color: '#10b981',
    description: 'Desarrolla resiliencia mental para depurar errores difíciles y sobreponerte a fallos impredecibles.'
  },
  {
    key: 'asertividad',
    title: '3. Asertividad',
    subtitle: 'El Code Review de la Discordia',
    icon: '💬',
    color: '#f59e0b',
    description: 'Comunica tus puntos de vista técnicos y establece límites con claridad, respeto y empatía hacia el equipo.'
  },
  {
    key: 'creatividad_innovacion',
    title: '4. Creatividad e Innovación',
    subtitle: 'Fuera del Sandbox',
    icon: '💡',
    color: '#06b6d4',
    description: 'Encuentra soluciones elegantes y rutas alternativas para resolver problemas técnicos complejos.'
  },
  {
    key: 'capacidad_planificacion',
    title: '5. Capacidad de Planificación',
    subtitle: 'Arquitectura de Blueprint',
    icon: '🗺️',
    color: '#ec4899',
    description: 'Analiza el terreno, desglosa requerimientos y gestiona recursos antes de ejecutar el sprint.'
  }
];

export class MenuUI {
  constructor(container, onSelectLevel, onViewResults) {
    this.container = container;
    this.onSelectLevel = onSelectLevel;
    this.onViewResults = onViewResults;
  }

  render() {
    const saveState = StorageSystem.load();
    const completedCount = Object.keys(saveState.completedLevels).length;

    let unlockedMsgCount = 0;
    Object.values(saveState.messagesUnlocked).forEach(list => {
      unlockedMsgCount += list.length;
    });

    this.container.innerHTML = `
      <div class="menu-wrapper">
        <header class="menu-header">
          <div class="brand">
            <div class="logo-icon">🚀</div>
            <div>
              <h1>SoftSkills Quest</h1>
              <p class="tagline">Plataforma Gamificada de Habilidades Blandas para Developers</p>
            </div>
          </div>
          <div class="header-actions">
            <button id="btn-results" class="btn btn-secondary">
              📊 Dashboard de Resultados (${completedCount}/5 Completados)
            </button>
          </div>
        </header>

        <div class="stats-banner">
          <div class="stat-pill">
            <span class="stat-label">Puntaje Total</span>
            <span class="stat-value">${saveState.stats.totalScore.toLocaleString()} pts</span>
          </div>
          <div class="stat-pill">
            <span class="stat-label">Niveles Superados</span>
            <span class="stat-value">${completedCount} de 5</span>
          </div>
          <div class="stat-pill">
            <span class="stat-label">Mensajes Desbloqueados</span>
            <span class="stat-value">${unlockedMsgCount} de 30</span>
          </div>
        </div>

        <h2 class="section-title">Selecciona un Mapa / Habilidad Blanda:</h2>

        <div class="level-cards-grid">
          ${LEVEL_METADATA.map(meta => {
            const prog = saveState.completedLevels[meta.key];
            const isCompleted = prog && prog.completed;
            const stars = prog ? '⭐'.repeat(prog.stars || 0) : '☆☆☆';

            return `
              <div class="level-card" data-key="${meta.key}" style="--accent-color: ${meta.color}">
                <div class="card-badge" style="background: ${meta.color}22; color: ${meta.color}">
                  ${meta.icon}
                </div>
                <div class="card-content">
                  <h3>${meta.title}</h3>
                  <div class="card-subtitle">${meta.subtitle}</div>
                  <p class="card-desc">${meta.description}</p>
                </div>
                <div class="card-footer">
                  <span class="stars">${stars}</span>
                  <button class="btn btn-play" style="background: ${meta.color}">
                    ${isCompleted ? 'Rejugar Nivel' : 'Iniciar Nivel'} ▶
                  </button>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;

    // Event handlers
    this.container.querySelectorAll('.level-card').forEach(card => {
      card.addEventListener('click', () => {
        const key = card.getAttribute('data-key');
        audio.playPickup();
        if (this.onSelectLevel) this.onSelectLevel(key);
      });
    });

    const resultsBtn = this.container.querySelector('#btn-results');
    if (resultsBtn) {
      resultsBtn.addEventListener('click', () => {
        audio.playPickup();
        if (this.onViewResults) this.onViewResults();
      });
    }
  }
}

# SoftSkills Quest — Juego de Habilidades Blandas para Developers

**SoftSkills Quest** es una plataforma gamificada en 2D desarrollada en HTML5 Canvas y JavaScript (ES Modules). Su objetivo es entrenar y reflexionar sobre 5 habilidades blandas esenciales para desarrolladores de software a través de niveles metáfora jugables y un sistema estructurado de 30 reflexiones/opiniones de ingeniería.

---

## 🎮 Habilidades & Niveles Incluidos (5 Niveles)

1. **Autodisciplina: La Rutina CI/CD & Gates de Calidad**
   - *Mecánica*: Ejecución de puertas de calidad obligatorias (linter, unit tests, build).
2. **Perseverancia: Refactorizando el Monolito**
   - *Mecánica*: Plataformas de precisión con respawn instantáneo sin penalización molesta.
3. **Asertividad: El Code Review de la Discordia**
   - *Mecánica*: Diálogos interactivos con compañeros de equipo (Product Owner, Senior Dev, QA).
4. **Creatividad e Innovación: Fuera del Sandbox**
   - *Mecánica*: Múltiples rutas y capacidad de spawnear puentes de código (`[B]`).
5. **Capacidad de Planificación: Arquitectura de Blueprint**
   - *Mecánica*: Inspección previa del terreno (modo plano) y gestión eficiente de recursos.

---

## 💬 Estructura de los 30 Mensajes (6 Momentos × 5 Niveles)

Todos los mensajes residen exclusivamente en `src/content/messages.json` y se activan dinámicamente en 6 momentos estándar por nivel:

1. **Pantalla de Introducción (Intro)**: Qué es la habilidad y su impacto en el rol.
2. **Checkpoint 1 (25%)**: Mensaje motivacional de coach.
3. **Checkpoint 2 (50%)**: Testimonio / dato curioso de un compañero NPC.
4. **Checkpoint 3 (75%)**: Consejo práctico aplicable al día a día dev.
5. **Final del Nivel (Bajo Desempeño)**: Feedback constructivo ante caídas/tiempo elevado.
6. **Final del Nivel (Alto Desempeño)**: Refuerzo positivo y frase memorable tras superar el nivel limpiamente.

---

## 🚀 Requisitos e Instalación Local

### Requisitos previos
- Node.js (versión 18 o superior)
- npm

### Pasos para ejecutar:

1. Clonar o abrir la carpeta del proyecto:
   ```bash
   cd Mario-Ser
   ```

2. Instalar dependencias:
   ```bash
   npm install
   ```

3. Ejecutar servidor de desarrollo local:
   ```bash
   npm run dev
   ```
   Abre la URL indicada en la consola (por defecto `http://localhost:3000`).

4. Para construir la versión de producción:
   ```bash
   npm run build
   ```

---

## 📂 Estructura de Carpetas del Proyecto

```
Mario-Ser/
├── index.html
├── package.json
├── vite.config.js
├── README.md
└── src/
    ├── main.js                 # Controlador principal y máquina de estados
    ├── index.css               # Estilos globales, glassmorphism y dark theme
    ├── content/
    │   └── messages.json       # Centralización de los 30 mensajes (5 niveles × 6 momentos)
    ├── core/
    │   ├── GameEngine.js       # Bucle de juego, físicas, colisiones AABB y cámara
    │   ├── AudioSystem.js      # Efectos de sonido retro con Web Audio API
    │   ├── StorageSystem.js    # Guardado de progreso en localStorage
    │   └── Renderer.js         # Renderizado gráfico procedural de héroe dev y mapa
    ├── entities/
    │   ├── Entity.js           # Clase base para objetos
    │   ├── Player.js           # Héroe desarrollador
    │   ├── Platform.js         # Plataformas estáticas, móviles y bloques de código
    │   ├── Checkpoint.js       # Banderas de control de momentos
    │   ├── NPC.js              # Compañeros de equipo interactivos
    │   ├── Collectible.js      # Snippets de código e ítems de energía
    │   └── EnemyBug.js         # Obstáculos / Bugs de software
    ├── levels/
    │   ├── LevelBase.js        # Clase base de nivel, evaluador de desempeño
    │   ├── LevelSelfDiscipline.js
    │   ├── LevelPerseverance.js
    │   ├── LevelAssertiveness.js
    │   ├── LevelCreativity.js
    │   └── LevelPlanning.js
    └── ui/
        ├── MenuUI.js           # Menú principal con las 5 tarjetas de nivel
        ├── GameOverlayUI.js    # HUD, modales de checkpoints e intro
        └── ResultsUI.js        # Dashboard final de resultados y biblioteca de mensajes
```

---

## 🛠️ Guía para Extender un Nuevo Nivel / Habilidad

Para agregar una 6ª habilidad (por ejemplo, `liderazgo_tecnico`):

1. **Añadir los 6 mensajes al JSON**:
   Edita `src/content/messages.json` y agrega la clave `liderazgo_tecnico`:
   ```json
   "liderazgo_tecnico": {
     "intro": "...",
     "checkpoint_25": "...",
     "checkpoint_50_testimonio": "...",
     "checkpoint_75_consejo": "...",
     "final_bajo_desempeno": "...",
     "final_alto_desempeno": "..."
   }
   ```

2. **Crear la clase del Nivel**:
   Crea `src/levels/LevelLeadership.js` heredando de `LevelBase`:
   ```javascript
   import { LevelBase } from './LevelBase.js';

   export class LevelLeadership extends LevelBase {
     constructor() {
       super('liderazgo_tecnico', 'Liderazgo Técnico', '#8b5cf6', 50);
     }
     initLevel() {
       super.initLevel();
       // Configurar plataformas, checkpoints y NPCs
     }
   }
   ```

3. **Registrar la tarjeta en la UI**:
   En `src/ui/MenuUI.js`, agrega el objeto de metadatos al arreglo `LEVEL_METADATA`.

4. **Instanciar en AppController**:
   En `src/main.js`, añade la opción en el `switch(skillKey)` para cargar la nueva clase.

---

## 👨‍💻 Autor

**Tomas Esteban Gonzalez Quintero** — *Desarrollador Full Stack*

- 🌐 [Portafolio Web](https://portafolio-tegq-web.netlify.app/)
- 🐙 [GitHub: @TEstebanGQ](https://github.com/TEstebanGQ)
- 💼 [LinkedIn](https://www.linkedin.com/in/tomas-esteban-gonzalez-quintero/)
- 📧 [Email](mailto:tomasestebangonzalezquintero@gmail.com)

---

<div align="center">
  <br/>
  <a href="https://github.com/TEstebanGQ">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/TEstebanGQ/TEstebanGQ/main/assets/logo_white.png">
      <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/TEstebanGQ/TEstebanGQ/main/assets/logo_clean.png">
      <img src="https://raw.githubusercontent.com/TEstebanGQ/TEstebanGQ/main/assets/logo_white.png" width="100" alt="TEGQ Brand Logo" />
    </picture>
  </a>
  <br/>
  <sub><b>© Tomas Esteban González Quintero — TEGQ</b></sub>
</div>

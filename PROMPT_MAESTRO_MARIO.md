# PROMPT MAESTRO: "SoftSkills Quest" — Plataforma de Habilidades Blandas con Motor y Estilo 100% Mario Bros

> **Instrucciones de uso:** Este prompt está diseñado para guiar el desarrollo integral de una plataforma gamificada para desarrolladores de software que replique con fidelidad absoluta (100%) el gameplay, físicas, sprites, interfaz y diseño de mapas de los repositorios de referencia **FullScreenMario** y **HTML5_Client (EightBittr/GameStartr)**, integrando un sistema educativo de habilidades blandas sin infringir derechos de autor de Nintendo.

---

```markdown
# Prompt para Desarrollo de Software — "SoftSkills Quest" (Motor Mario Bros 100% Auténtico)

## 1. ROL Y ARQUITECTURA TÉCNICA
Actúa como un equipo senior de Game Development (HTML5 Canvas + TypeScript/JavaScript) y UX especializado en ingeniería inversa de motores de plataformas 2D retro. Construirás **"SoftSkills Quest"**, un videojuego educativo y plataforma de productividad para desarrolladores de software basado rigurosamente en la arquitectura de:
- **FullScreenMario**: https://github.com/dapperAuteur/FullScreenMario.git
- **HTML5_Client**: https://github.com/PlayMario/HTML5_Client.git

### Arquitectura Modular Requerida (Inspirada en EightBittr/GameStartr):
1. **`GameEngine` (Core Loop)**: Bucle de renderizado desacoplado a 60 FPS con delta time fijo, interpolación de posiciones y cámara side-scroller continua.
2. **`ThingHittr` (Colisiones & Físicas)**: Detección AABB por ejes separados (X primero, Y después) con tolerancia de juntas (`groundTolerance = 8px`) para evitar tropiezos entre bloques contiguos, rebote en golpes desde abajo (`hitBottom`) y pisotón a enemigos (`stompEnemy`).
3. **`MapsCreatr` (Sistema de Mapas por Tiles)**: Grilla de mosaicos de 16×16 px NES escalada a 4x (tiles de 64×64 px en Canvas). Niveles definidos como matrices de objetos "Things" (Solid, Character, Collectible, Scenery).
4. **`AudioHoldr` (Web Audio API 8-Bit)**: Síntesis procedural de frecuencias idénticas al chip APU de la NES (ondas cuadradas para saltos/bloques, senoidales para monedas, diente de sierra para pisotones).

---

## 2. ESPECIFICACIONES DE DISEÑO VISUAL, SPRITES E INTERFAZ (100% ESTILO MARIO BROS)

### 2.1 Dirección de Arte Retro (8/16-Bit Pixel Art)
- **Renderizado Nítido**: Canvas con `ctx.imageSmoothingEnabled = false` y CSS `image-rendering: pixelated`.
- **Paleta de Colores Clásica**:
  - Cielo: Azul SMB `#5c94fc`.
  - Terreno y Colinas: Verde `#22c55e` con gradientes Parallax en capas independientes.
  - Nubes: Racimos pixelados blancos `#ffffff` con volumen inferior sombreado.
  - Ladrillos: Terracota `#b45309` con patrón cruzado de argamasa.
  - Bloques `?`: Dorado brillante pulsante `#f59e0b` con signo de interrogación centrado.
  - Tubos (Pipes): Verde esmeralda `#15803d` con borde reflectante y labio superior biselado.

### 2.2 Sprites y Personajes ("Things" Propios sin Copyright de Nintendo)
- **Héroe "Dev" (Protagonista)**:
  - Sprite humanoide retro en píxeles: gorra de programador, sudadera hoodie, gafas/visor y laptop en mano.
  - Ciclo de animación: Idle (1 frame), Correr (3 frames alternando piernas), Salto (frame con piernas recogidas), Bandera (adhesión y deslizamiento).
  - Estado Power-Up (*Big Dev*): Crece en escala (de 40px a 50px de altura) con cambio de color al consumir el Power-Up **☕ Coffee Energy / Focus Boost**.
- **Enemigos Estilo Goomba (`EnemyBug`)**:
  - Criaturas bípedas con forma de bicho de software que patrullan de lado a lado.
  - Animación de muerte: Al recibir un pisotón, se aplastan en un frame achatado de 10px de altura durante 400ms antes de desaparecer.
- **Power-Ups y Coleccionables**:
  - Monedas de código que rotan en el eje Y sobre sí mismas.
  - Ícono de Foco / Taza de Café que emerge suavemente hacia arriba desde el bloque `?` antes de adquirir física de avance.
- **Banderín de Meta (Flagpole Clásico)**:
  - Mástil plateado de 240px de altura con esfera dorada en la cima y base de piedra.
  - Al colisionar, el jugador se adhiere al mástil, la bandera desciende, suena la fanfarria de victoria y el héroe camina automáticamente hacia la base.

### 2.3 HUD Superior Arcade
- Tipografía retro monospace de 8-bits en la parte superior fija:
  ```
  MARIO-DEV          MONEDAS          HABILIDAD          TIEMPO          VIDAS
   002500             x12            DISCIPLINA           320             x1
  ```

---

## 3. FÍSICAS Y CONSTANTES EXACTAS DE FULLSCREENMARIO

| Parámetro | Valor de Motor | Comportamiento en Juego |
| :--- | :--- | :--- |
| **Aceleración Horizontal** | `900 px/s²` | Progresiva, permite inercia de frenado y derrape al cambiar de dirección. |
| **Velocidad Máxima** | `280 px/s` | Velocidad de caminata fluida que permite saltos de hasta 190 px de distancia. |
| **Fricción de Suelo** | `750 px/s²` | Detención natural sin resbalar excesivamente. |
| **Impulso de Salto** | `-520 px/s` | Salto inicial ágil equivalente a 4 bloques de altura. |
| **Gravedad Ascendente** | `1200 px/s²` | Aplicada mientras la tecla de salto se mantenga presionada. |
| **Gravedad de Corte** | `2800 px/s²` | Aplicada inmediatamente si se suelta la tecla de salto para controlar la altura. |
| **Gravedad de Caída** | `1800 px/s²` | Caída rápida para evitar sensación de "flotabilidad". |
| **Coyote Time** | `120 ms` | Permite saltar aún después de haber dejado el borde de una plataforma. |

---

## 4. ESTRUCTURA DE 5 NIVELES / MAPAS Y SUS METÁFORAS JUGABLES

El juego debe ofrecer **exactamente 5 niveles** en el menú principal, seleccionables en cualquier orden:

1. **Nivel 1 — Autodisciplina (La Rutina CI/CD)**:
   - *Diseño de Mapa*: Estilo Mundo 1-1 con tubos verdes, bloques `?` y puertas de calidad (`Linter Gate` y `Tests Gate`) que exigen recolectar las llaves de código antes de avanzar.
2. **Nivel 2 — Perseverancia (Refactorizando el Monolito)**:
   - *Diseño de Mapa*: Estilo Mundo 1-2 con plataformas móviles sobre abismos y respawn instantáneo sin penalización severa.
3. **Nivel 3 — Asertividad (El Code Review de la Discordia)**:
   - *Diseño de Mapa*: Estilo mundo con NPCs de equipo (Tech Lead, Product Owner) que presentan diálogos con decisiones de comunicación asertiva.
4. **Nivel 4 — Creatividad e Innovación (Fuera del Sandbox)**:
   - *Diseño de Mapa*: Rutas multinivel (ruta inferior clásica y ruta aérea secreta) con la habilidad de generar bloques de código temporales (`<code_bridge/>`) usando la tecla `[B]`.
5. **Nivel 5 — Capacidad de Planificación (Arquitectura de Blueprint)**:
   - *Diseño de Mapa*: Estilo castillo final con vista previa de blueprint previa al recorrido y gestión de recursos.

---

## 5. CENTRALIZACIÓN DE LOS 30 MENSAJES (`content/messages.json`)

Cada nivel debe activar **exactamente 6 momentos de mensaje** (5 niveles × 6 momentos = 30 mensajes únicos):
1. `intro`: Modal previo al nivel explicando qué es la habilidad para un desarrollador.
2. `checkpoint_25`: Mensaje motivacional de coach al 25% del mapa.
3. `checkpoint_50_testimonio`: Anécdota o dato realista contado por un NPC del equipo al 50%.
4. `checkpoint_75_consejo`: Consejo técnico aplicable a la rutina diaria de código al 75%.
5. `final_bajo_desempeno`: Feedback constructivo si el jugador tardó mucho o murió varias veces.
6. `final_alto_desempeno`: Cierre memorable y positivo si el jugador completó el nivel con rapidez y pocas muertes.

Los 30 textos deben estar centralizados exclusivamente en `src/content/messages.json`.

---

## 6. DASHBOARD DE PRODUCTIVIDAD Y RESULTADOS FINAL

- Dashboard con diseño moderno glassmorphism que consolida:
  - Puntaje total acumulado, estrellas obtenidas (1 a 3) y tiempos récord.
  - Galería interactiva con las **30 opiniones de desarrollo** organizadas por habilidad, permitiendo filtrar y releer los mensajes desbloqueados.
  - Persistencia total de progreso en `localStorage`.

---

## 7. CRITERIOS DE ACEPTACIÓN TÉCNICA
- [ ] El personaje responde de forma instantánea a las flechas/WASD y barra espaciadora sin congelarse en el suelo.
- [ ] Los bloques `?` rebotan y sueltan monedas o ítems al ser golpeados desde abajo.
- [ ] Los enemigos se aplastan con un salto encima y rebotan al personaje.
- [ ] El banderín de meta ejecuta la animación de deslizamiento y bandera antes del modal de fin de nivel.
- [ ] El archivo `content/messages.json` almacena las 30 opiniones completas en español.
- [ ] El proyecto corre con `npm run dev` o `npm start` en cualquier navegador moderno.
```

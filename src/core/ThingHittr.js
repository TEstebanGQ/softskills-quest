/**
 * ThingHittr - Handles physics integration and AABB collision resolution
 * inspired by FullScreenMario / GameStartr.
 * 
 * Implements:
 * - One-way (semi-solid) platforms for falling_platform, code_bridge, mushroom, and moving_platform
 * - Absolute reliable falling_platform trigger when standing on top
 * - Full-height Quality Gate barrier lines (prevents jumping over or bypassing)
 * - Bounded moving platforms and horizontal ride-along
 * - groundTolerance = 8px to prevent snagging between adjacent tiles
 * - Prevents pipe fling / kill bugs with precise horizontal overlap filtering
 * - hitBottom for bumping solid blocks (bricks, question blocks) from below
 * - stompEnemy for jumping on Goomba-style bugs
 */
export class ThingHittr {
  constructor() {
    this.groundTolerance = 8;
  }

  isSemiSolid(solid) {
    return (
      solid.type === 'falling_platform' ||
      solid.type === 'code_bridge' ||
      solid.type === 'mushroom' ||
      solid.type === 'moving_platform'
    );
  }

  /**
   * Updates player physics and collisions against platforms/solids
   */
  updatePlayerPhysics(player, dt, platforms) {
    const timeStep = Math.min(dt, 0.05);

    // Coyote time countdown
    if (player.isGrounded) {
      player.coyoteTimer = player.maxCoyoteTime;
    } else if (player.coyoteTimer > 0) {
      player.coyoteTimer -= timeStep;
    }

    // Dynamic SMB Gravity
    let currentGravity = player.fallGravity;
    if (player.vy < 0) {
      currentGravity = player.jumpHeld ? player.risingGravity : player.cutGravity;
    }

    player.vy += currentGravity * timeStep;
    if (player.vy > player.terminalVelocity) {
      player.vy = player.terminalVelocity;
    }

    // ----------------------------------------------------
    // AXIS 1: HORIZONTAL RESOLUTION (X)
    // ----------------------------------------------------
    player.x += player.vx * timeStep;

    for (const solid of platforms) {
      if (!solid.active || solid.isPassable) continue;

      // Semi-solid platforms DO NOT block horizontally
      if (this.isSemiSolid(solid)) continue;

      // If falling platform is already falling, never collide
      if (solid.isFalling) continue;

      // Full-Height Quality Gate Barrier Line
      if (solid.type === 'quality_gate') {
        if (solid.passed) continue; // 100% Passable when switch is active!
        if (player.intersects(solid)) {
          if (player.vx > 0) player.x = solid.x - player.width;
          else if (player.vx < 0) player.x = solid.x + solid.width;
          player.vx = 0;
          continue;
        }
      }

      if (player.intersects(solid)) {
        const playerBottom = player.y + player.height;
        const playerTop = player.y;
        const solidTop = solid.y;
        const solidBottom = solid.y + solid.height;

        const isNearTopEdge = (playerBottom - solidTop) <= this.groundTolerance;
        const isNearBottomEdge = (solidBottom - playerTop) <= 4;

        if (!isNearTopEdge && !isNearBottomEdge) {
          if (player.vx > 0) {
            player.x = solid.x - player.width;
            player.vx = 0;
          } else if (player.vx < 0) {
            player.x = solid.x + solid.width;
            player.vx = 0;
          }
        }
      }
    }

    // ----------------------------------------------------
    // AXIS 2: VERTICAL RESOLUTION (Y)
    // ----------------------------------------------------
    const prevBottom = player.y + player.height;
    player.y += player.vy * timeStep;
    player.isGrounded = false;

    for (const solid of platforms) {
      if (!solid.active || solid.isPassable) continue;

      // Quality Gate pass-through when opened
      if (solid.type === 'quality_gate') {
        if (solid.passed) continue;
      }

      // If falling platform is falling, do not collide
      if (solid.isFalling) continue;

      // Check meaningful horizontal overlap (at least 3px into the solid)
      const overlapX = Math.min(player.x + player.width, solid.x + solid.width) - Math.max(player.x, solid.x);
      if (overlapX <= 3) {
        continue;
      }

      const isSemi = this.isSemiSolid(solid);

      // Semi-solid platforms only collide when falling down onto the top surface
      if (isSemi) {
        const isLandingOnTop = (
          player.vy >= 0 &&
          prevBottom <= solid.y + 16 &&
          player.intersects(solid)
        );

        if (isLandingOnTop) {
          player.y = solid.y - player.height;
          player.vy = 0;
          player.isGrounded = true;
          player.isJumping = false;

          // Trigger Falling / Donut Platform countdown
          if (typeof solid.stepOn === 'function') {
            solid.stepOn();
          }

          // Ride along horizontally moving platform
          if (solid.isMoving && solid.moveType === 'horizontal') {
            player.x += solid.moveSpeed * solid.direction * timeStep;
          }
        }
        continue;
      }

      // Fully solid blocks (Ground, Bricks, Question Blocks, Pipes, Stone)
      if (player.intersects(solid)) {
        if (player.vy >= 0) {
          // Landing on top of solid
          player.y = solid.y - player.height;
          player.vy = 0;
          player.isGrounded = true;
          player.isJumping = false;
        } else if (player.vy < 0 && !solid.isPassable) {
          // Hitting solid from below
          if (solid.type === 'pipe') {
            player.vy = 20;
          } else {
            this.hitBottom(player, solid);
          }
        }
      }
    }

    // Safety Grounded Assertion: If standing directly on a falling platform, ensure stepOn()
    if (player.isGrounded) {
      for (const solid of platforms) {
        if (!solid.active || !solid.isFallingPlatform || solid.isFalling) continue;
        const playerBottom = player.y + player.height;
        const onTop = (
          Math.abs(playerBottom - solid.y) <= 4 &&
          player.x + player.width > solid.x + 2 &&
          player.x < solid.x + solid.width - 2
        );
        if (onTop) {
          solid.stepOn();
        }
      }
    }
  }

  /**
   * Player bumps a block from below
   */
  hitBottom(player, solid) {
    player.y = solid.y + solid.height;
    player.vy = 60;

    if (typeof solid.onHitFromBelow === 'function') {
      solid.onHitFromBelow(player);
    }
  }

  /**
   * Check collision between player and enemy
   */
  checkEnemyCollision(player, enemy) {
    if (!enemy.active || enemy.isSquished) return null;
    if (!player.intersects(enemy)) return null;

    const playerBottom = player.y + player.height;
    const enemyTop = enemy.y;

    if (player.vy > 0 && (playerBottom - player.vy * 0.05) <= enemyTop + 14) {
      return 'stomp';
    }

    return 'hit';
  }

  /**
   * Execute stomp on enemy
   */
  stompEnemy(player, enemy) {
    enemy.stomp();
    player.vy = -350;
    player.score += 200;
  }
}

export const thingHittr = new ThingHittr();

/**
 * Renderer - 8/16-Bit Pixel Art Retro Mario Bros Engine Renderer
 * Replicates FullScreenMario & Super Mario World aesthetics.
 * Supports:
 * - Moving platform pulley wire with smiling cute SMW white cloud at the top!
 * - Piranha Plants emerging from pipes with snapping jaws
 * - Thwomps with spiked stone bodies, angry faces, and ground slam dust
 * - Multiple Red Coins counter on Quality Gates
 * - Diverse backgrounds: overworld, desert, underground mine, twilight, castle
 */
export const GROUND_Y = 520;

export class Renderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.ctx.imageSmoothingEnabled = false;
    this.animTime = 0;
    this.currentTheme = 'overworld';
  }

  clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  drawBackground(cameraX, themeColor = '#6366f1', themeType = 'overworld') {
    this.currentTheme = themeType;
    const width = this.canvas.width;
    const height = this.canvas.height;

    if (themeType === 'castle') {
      this.drawCastleBackground(cameraX, width, height);
    } else if (themeType === 'desert') {
      this.drawDesertBackground(cameraX, width, height);
    } else if (themeType === 'underground') {
      this.drawUndergroundBackground(cameraX, width, height);
    } else if (themeType === 'twilight') {
      this.drawTwilightBackground(cameraX, width, height);
    } else {
      this.drawOverworldBackground(cameraX, width, height);
    }
  }

  drawCastleBackground(cameraX, width, height) {
    const ctx = this.ctx;
    ctx.fillStyle = '#140c16';
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = '#221626';
    const brickW = 48;
    const brickH = 24;
    const offsetX = Math.round((cameraX * 0.2) % brickW);

    for (let y = 0; y < GROUND_Y; y += brickH) {
      const rowOffset = (Math.floor(y / brickH) % 2) * (brickW / 2);
      for (let x = -brickW; x < width + brickW; x += brickW) {
        ctx.strokeStyle = '#0d070f';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(x - offsetX + rowOffset, y, brickW, brickH);
      }
    }

    ctx.fillStyle = '#3f2214';
    ctx.fillRect(0, 0, width, 26);
    ctx.fillStyle = '#5c331a';
    ctx.fillRect(0, 20, width, 6);
    ctx.strokeStyle = '#1e0e07';
    ctx.lineWidth = 2;
    ctx.strokeRect(0, 0, width, 26);

    const windowSpacing = 380;
    const winOffsetX = Math.round((cameraX * 0.3) % windowSpacing);
    for (let x = -windowSpacing; x < width + windowSpacing; x += windowSpacing) {
      const wx = x - winOffsetX + 80;
      const wy = 90;

      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.arc(wx + 25, wy + 25, 25, Math.PI, 0);
      ctx.rect(wx, wy + 25, 50, 60);
      ctx.fill();

      ctx.fillStyle = 'rgba(56, 189, 248, 0.15)';
      ctx.beginPath();
      ctx.arc(wx + 25, wy + 25, 22, Math.PI, 0);
      ctx.rect(wx + 3, wy + 25, 44, 56);
      ctx.fill();

      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(wx + 25, wy);
      ctx.lineTo(wx + 25, wy + 85);
      ctx.moveTo(wx, wy + 45);
      ctx.lineTo(wx + 50, wy + 45);
      ctx.stroke();
    }

    for (let x = -windowSpacing; x < width + windowSpacing; x += windowSpacing) {
      const lx = x - winOffsetX + 260;
      const ly = 160;

      const flicker = Math.sin(this.animTime * 12 + lx) * 0.05 + 0.25;
      const grad = ctx.createRadialGradient(lx, ly, 5, lx, ly + 60, 110);
      grad.addColorStop(0, `rgba(253, 224, 71, ${flicker})`);
      grad.addColorStop(0.5, `rgba(245, 158, 11, ${flicker * 0.5})`);
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(lx, ly + 30, 95, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#78350f';
      ctx.fillRect(lx - 6, ly - 4, 12, 16);
      ctx.fillStyle = '#fde047';
      ctx.fillRect(lx - 4, ly, 8, 10);
      ctx.strokeStyle = '#1c1917';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(lx - 6, ly - 4, 12, 16);
    }
  }

  drawDesertBackground(cameraX, width, height) {
    const ctx = this.ctx;
    const skyGrad = ctx.createLinearGradient(0, 0, 0, height);
    skyGrad.addColorStop(0, '#fef08a');
    skyGrad.addColorStop(0.6, '#fed7aa');
    skyGrad.addColorStop(1, '#f97316');
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = '#fffbeb';
    ctx.beginPath();
    ctx.arc(width - 160, 90, 42, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = 'rgba(254, 243, 199, 0.4)';
    ctx.beginPath();
    ctx.arc(width - 160, 90, 56, 0, Math.PI * 2);
    ctx.fill();

    const pyramidSpeed = 0.2;
    for (let i = 0; i < 6; i++) {
      const px = ((i * 500 - cameraX * pyramidSpeed) % (width + 600)) - 100;
      const py = GROUND_Y;
      const pW = 280;
      const pH = 180 + (i % 2) * 40;

      ctx.fillStyle = '#d97706';
      ctx.beginPath();
      ctx.moveTo(px + pW / 2, py - pH);
      ctx.lineTo(px, py);
      ctx.lineTo(px + pW * 0.45, py);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = '#92400e';
      ctx.beginPath();
      ctx.moveTo(px + pW / 2, py - pH);
      ctx.lineTo(px + pW * 0.45, py);
      ctx.lineTo(px + pW, py);
      ctx.closePath();
      ctx.fill();
    }

    const duneSpeed = 0.45;
    ctx.fillStyle = '#ea580c';
    for (let i = 0; i < 7; i++) {
      const dx = ((i * 420 - cameraX * duneSpeed) % (width + 500)) - 100;
      ctx.beginPath();
      ctx.ellipse(dx, GROUND_Y, 180, 70, 0, Math.PI, Math.PI * 2);
      ctx.fill();
    }

    ctx.fillStyle = '#f59e0b';
    for (let i = 0; i < 6; i++) {
      const dx = ((i * 480 + 120 - cameraX * 0.65) % (width + 500)) - 100;
      ctx.beginPath();
      ctx.ellipse(dx, GROUND_Y, 150, 50, 0, Math.PI, Math.PI * 2);
      ctx.fill();
    }

    const palmSpeed = 0.8;
    for (let i = 0; i < 6; i++) {
      const px = ((i * 520 + 200 - cameraX * palmSpeed) % (width + 500)) - 80;
      const py = GROUND_Y;

      ctx.fillStyle = '#78350f';
      ctx.fillRect(px - 3, py - 38, 6, 38);
      ctx.strokeStyle = '#451a03';
      ctx.lineWidth = 1;
      ctx.strokeRect(px - 3, py - 38, 6, 38);

      ctx.fillStyle = '#15803d';
      ctx.beginPath();
      ctx.ellipse(px - 14, py - 38, 14, 6, -0.4, 0, Math.PI * 2);
      ctx.ellipse(px + 14, py - 38, 14, 6, 0.4, 0, Math.PI * 2);
      ctx.ellipse(px, py - 46, 6, 12, 0, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  drawUndergroundBackground(cameraX, width, height) {
    const ctx = this.ctx;
    ctx.fillStyle = '#090d16';
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = '#1e293b';
    const stalaSpeed = 0.3;
    for (let i = 0; i < 20; i++) {
      const sx = ((i * 90 - cameraX * stalaSpeed) % (width + 120)) - 40;
      const sH = 35 + (i % 5) * 16;
      ctx.beginPath();
      ctx.moveTo(sx, 0);
      ctx.lineTo(sx + 15, sH);
      ctx.lineTo(sx + 30, 0);
      ctx.closePath();
      ctx.fill();
    }

    const beamSpeed = 0.4;
    for (let i = 0; i < 8; i++) {
      const bx = ((i * 380 - cameraX * beamSpeed) % (width + 450)) - 60;
      ctx.fillStyle = '#3e2723';
      ctx.fillRect(bx, 0, 16, GROUND_Y);
      ctx.fillRect(bx - 30, 140, 76, 12);
      ctx.strokeStyle = '#1b0000';
      ctx.lineWidth = 2;
      ctx.strokeRect(bx, 0, 16, GROUND_Y);

      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.arc(bx + 8, 130, 5, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  drawTwilightBackground(cameraX, width, height) {
    const ctx = this.ctx;
    const twiGrad = ctx.createLinearGradient(0, 0, 0, height);
    twiGrad.addColorStop(0, '#1e1b4b');
    twiGrad.addColorStop(0.5, '#4c1d95');
    twiGrad.addColorStop(1, '#c026d3');
    ctx.fillStyle = twiGrad;
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = '#ffffff';
    for (let i = 0; i < 30; i++) {
      const sx = ((i * 127 - cameraX * 0.05) % width + width) % width;
      const sy = 40 + (i * 37) % (GROUND_Y - 200);
      const twinkle = Math.sin(this.animTime * 6 + i) > 0.3 ? 2.5 : 1.5;
      ctx.fillRect(sx, sy, twinkle, twinkle);
    }

    ctx.fillStyle = 'rgba(236, 72, 153, 0.25)';
    for (let i = 0; i < 7; i++) {
      const cx = ((i * 380 - cameraX * 0.2) % (width + 400)) - 80;
      ctx.beginPath();
      ctx.ellipse(cx, 160 + (i % 3) * 40, 110, 24, 0, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  drawOverworldBackground(cameraX, width, height) {
    const ctx = this.ctx;
    ctx.fillStyle = '#5c94fc';
    ctx.fillRect(0, 0, width, height);

    const cloudSpeed = 0.15;
    for (let i = 0; i < 10; i++) {
      const cx = ((i * 380 - cameraX * cloudSpeed) % (width + 400)) - 80;
      const cy = 60 + (i % 3) * 45;

      ctx.fillStyle = '#cbd5e1';
      ctx.beginPath();
      ctx.arc(cx - 18, cy + 4, 18, 0, Math.PI * 2);
      ctx.arc(cx + 10, cy + 6, 24, 0, Math.PI * 2);
      ctx.arc(cx + 38, cy + 4, 18, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(cx - 18, cy, 18, 0, Math.PI * 2);
      ctx.arc(cx + 10, cy - 6, 24, 0, Math.PI * 2);
      ctx.arc(cx + 38, cy, 18, 0, Math.PI * 2);
      ctx.fill();
    }

    const mountainSpeed = 0.25;
    for (let i = 0; i < 8; i++) {
      const mx = ((i * 440 - cameraX * mountainSpeed) % (width + 500)) - 120;
      const peakY = GROUND_Y - 180 - (i % 3) * 40;
      const mWidth = 240 + (i % 2) * 60;

      ctx.fillStyle = '#475569';
      ctx.beginPath();
      ctx.moveTo(mx, GROUND_Y);
      ctx.lineTo(mx + mWidth / 2, peakY);
      ctx.lineTo(mx + mWidth, GROUND_Y);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = '#334155';
      ctx.beginPath();
      ctx.moveTo(mx + mWidth / 2, peakY);
      ctx.lineTo(mx + mWidth, GROUND_Y);
      ctx.lineTo(mx + mWidth / 2, GROUND_Y);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = '#f8fafc';
      ctx.beginPath();
      ctx.moveTo(mx + mWidth / 2, peakY);
      ctx.lineTo(mx + mWidth / 2 - 24, peakY + 40);
      ctx.lineTo(mx + mWidth / 2 - 8, peakY + 36);
      ctx.lineTo(mx + mWidth / 2 + 12, peakY + 44);
      ctx.lineTo(mx + mWidth / 2 + 24, peakY + 40);
      ctx.closePath();
      ctx.fill();
    }

    const hillSpeed = 0.38;
    ctx.fillStyle = '#16a34a';
    for (let i = 0; i < 7; i++) {
      const hx = ((i * 520 - cameraX * hillSpeed) % (width + 500)) - 100;
      ctx.beginPath();
      ctx.ellipse(hx, GROUND_Y, 120, 90, 0, Math.PI, Math.PI * 2);
      ctx.fill();
    }

    const nearHillSpeed = 0.52;
    ctx.fillStyle = '#22c55e';
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2.5;

    for (let i = 0; i < 6; i++) {
      const hx = ((i * 680 + 150 - cameraX * nearHillSpeed) % (width + 600)) - 120;
      ctx.beginPath();
      ctx.ellipse(hx, GROUND_Y, 150, 110, 0, Math.PI, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#15803d';
      ctx.beginPath();
      ctx.arc(hx - 25, GROUND_Y - 40, 6, 0, Math.PI * 2);
      ctx.arc(hx + 35, GROUND_Y - 55, 6, 0, Math.PI * 2);
      ctx.arc(hx, GROUND_Y - 75, 7, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#22c55e';
    }

    for (let i = 0; i < 8; i++) {
      const bx = ((i * 450 + 60 - cameraX * 0.8) % (width + 450)) - 80;
      const by = GROUND_Y;

      ctx.fillStyle = '#15803d';
      ctx.beginPath();
      ctx.arc(bx, by - 14, 16, Math.PI, Math.PI * 2);
      ctx.arc(bx + 20, by - 22, 20, Math.PI, Math.PI * 2);
      ctx.arc(bx + 40, by - 14, 16, Math.PI, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#22c55e';
      ctx.beginPath();
      ctx.arc(bx, by - 14, 13, Math.PI, Math.PI * 2);
      ctx.arc(bx + 20, by - 22, 17, Math.PI, Math.PI * 2);
      ctx.arc(bx + 40, by - 14, 13, Math.PI, Math.PI * 2);
      ctx.fill();

      ctx.fillRect(bx - 13, by - 4, 66, 4);
    }
  }

  drawPlayer(player, cameraX) {
    const ctx = this.ctx;
    const screenX = Math.round(player.x - cameraX);
    const screenY = Math.round(player.y);

    ctx.save();
    ctx.translate(screenX + player.width / 2, screenY + player.height / 2);

    if (player.facing === 'left') {
      ctx.scale(-1, 1);
    }

    const halfW = player.width / 2;
    const halfH = player.height / 2;
    const isBig = player.isPoweredUp;

    ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
    ctx.fillRect(-halfW + 4, halfH - 2, player.width - 8, 3);

    const hoodieColor = isBig ? '#f59e0b' : '#4338ca';
    const capColor = isBig ? '#b45309' : '#312e81';
    const skinTone = '#fca5a5';
    const pantsColor = isBig ? '#b91c1c' : '#1e1b4b';

    const torsoY = isBig ? -10 : -6;
    const torsoH = isBig ? 24 : 18;
    ctx.fillStyle = hoodieColor;
    ctx.fillRect(-10, torsoY, 20, torsoH);

    ctx.fillStyle = pantsColor;
    ctx.fillRect(-8, torsoY + 8, 4, torsoH - 8);
    ctx.fillRect(4, torsoY + 8, 4, torsoH - 8);

    const headY = isBig ? -26 : -20;
    ctx.fillStyle = skinTone;
    ctx.fillRect(-8, headY, 16, 14);

    ctx.fillStyle = capColor;
    ctx.fillRect(-10, headY - 4, 20, 6);
    ctx.fillRect(0, headY - 5, 12, 4);

    ctx.fillStyle = '#0f172a';
    ctx.fillRect(1, headY + 3, 10, 5);
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(2, headY + 4, 8, 3);

    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(2, torsoY + 4, 11, 8);
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(3, torsoY + 2, 8, 4);
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(3, torsoY + 8, 8, 3);

    ctx.fillStyle = pantsColor;

    if (player.isFlagSliding) {
      ctx.fillRect(-6, halfH - 10, 5, 10);
      ctx.fillRect(1, halfH - 10, 5, 10);
      ctx.fillStyle = hoodieColor;
      ctx.fillRect(-14, torsoY + 2, 6, 4);
    } else if (!player.isGrounded) {
      ctx.fillRect(-8, halfH - 8, 6, 6);
      ctx.fillRect(2, halfH - 12, 6, 6);
    } else if (Math.abs(player.vx) > 15) {
      const frame = Math.floor((this.animTime * 14) % 3);
      if (frame === 0) {
        ctx.fillRect(-9, halfH - 10, 6, 10);
        ctx.fillRect(3, halfH - 8, 6, 8);
      } else if (frame === 1) {
        ctx.fillRect(-6, halfH - 10, 5, 10);
        ctx.fillRect(1, halfH - 10, 5, 10);
      } else {
        ctx.fillRect(-4, halfH - 8, 6, 8);
        ctx.fillRect(4, halfH - 10, 6, 10);
      }
    } else {
      ctx.fillRect(-8, halfH - 10, 6, 10);
      ctx.fillRect(2, halfH - 10, 6, 10);
    }

    if (player.isSkidding) {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.fillRect(-14, halfH - 4, 4, 4);
      ctx.fillRect(-18, halfH - 6, 3, 3);
    }

    ctx.restore();
  }

  drawBlock(block, cameraX) {
    const ctx = this.ctx;
    const rawX = block.x + (block.shakeOffset || 0);
    const screenX = Math.round(rawX - cameraX);
    const screenY = Math.round(block.y);

    if (screenX + block.width < 0 || screenX > this.canvas.width) return;

    ctx.save();

    if (block.type === 'question_block') {
      if (block.isHit) {
        ctx.fillStyle = '#78350f';
        ctx.fillRect(screenX, screenY, block.width, block.height);
        ctx.strokeStyle = '#451a03';
        ctx.lineWidth = 2;
        ctx.strokeRect(screenX, screenY, block.width, block.height);

        ctx.fillStyle = '#451a03';
        ctx.fillRect(screenX + 3, screenY + 3, 3, 3);
        ctx.fillRect(screenX + block.width - 6, screenY + 3, 3, 3);
        ctx.fillRect(screenX + 3, screenY + block.height - 6, 3, 3);
        ctx.fillRect(screenX + block.width - 6, screenY + block.height - 6, 3, 3);
      } else {
        const pulse = Math.floor(Math.sin(this.animTime * 8) * 15);
        ctx.fillStyle = `rgb(${245 + pulse}, ${158 + pulse}, 11)`;
        ctx.fillRect(screenX, screenY, block.width, block.height);

        ctx.strokeStyle = '#b45309';
        ctx.lineWidth = 2;
        ctx.strokeRect(screenX, screenY, block.width, block.height);

        ctx.fillStyle = '#78350f';
        ctx.fillRect(screenX + 3, screenY + 3, 3, 3);
        ctx.fillRect(screenX + block.width - 6, screenY + 3, 3, 3);
        ctx.fillRect(screenX + 3, screenY + block.height - 6, 3, 3);
        ctx.fillRect(screenX + block.width - 6, screenY + block.height - 6, 3, 3);

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 20px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('?', screenX + block.width / 2, screenY + block.height / 2 + 7);
      }
    } else if (block.type === 'pipe') {
      ctx.fillStyle = '#15803d';
      ctx.fillRect(screenX + 4, screenY + 16, block.width - 8, block.height - 16);

      ctx.fillStyle = '#4ade80';
      ctx.fillRect(screenX + 10, screenY + 16, 5, block.height - 16);

      ctx.fillStyle = '#14532d';
      ctx.fillRect(screenX + block.width - 12, screenY + 16, 6, block.height - 16);

      ctx.fillStyle = '#16a34a';
      ctx.fillRect(screenX, screenY, block.width, 16);
      ctx.fillStyle = '#4ade80';
      ctx.fillRect(screenX + 8, screenY, 5, 16);
      ctx.fillStyle = '#14532d';
      ctx.fillRect(screenX + block.width - 8, screenY, 6, 16);

      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 2;
      ctx.strokeRect(screenX, screenY, block.width, 16);
      ctx.strokeRect(screenX + 4, screenY + 16, block.width - 8, block.height - 16);

      if (block.isLocked) {
        ctx.fillStyle = 'rgba(15, 23, 42, 0.45)';
        ctx.fillRect(screenX, screenY, block.width, block.height);
        ctx.fillStyle = '#ef4444';
        ctx.fillRect(screenX + 2, screenY, block.width - 4, 3);
      }

      if (block.hubLabel) {
        ctx.fillStyle = block.isLocked ? '#fca5a5' : '#f8fafc';
        ctx.font = 'bold 9px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(block.hubLabel, screenX + block.width / 2, screenY - 8);
      }
    } else if (block.type === 'brick') {
      ctx.fillStyle = '#b45309';
      ctx.fillRect(screenX, screenY, block.width, block.height);

      ctx.strokeStyle = '#451a03';
      ctx.lineWidth = 2;
      ctx.strokeRect(screenX, screenY, block.width, block.height);

      ctx.strokeStyle = '#78350f';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(screenX, screenY + 16);
      ctx.lineTo(screenX + block.width, screenY + 16);
      ctx.moveTo(screenX + 16, screenY);
      ctx.lineTo(screenX + 16, screenY + 16);
      ctx.moveTo(screenX + 8, screenY + 16);
      ctx.lineTo(screenX + 8, screenY + 32);
      ctx.stroke();
    } else if (block.type === 'falling_platform') {
      const isShaking = block.steppedTimer > 0 && !block.isFalling;
      ctx.fillStyle = isShaking ? '#f97316' : '#ea580c';
      ctx.beginPath();
      ctx.roundRect(screenX, screenY, block.width, block.height, 4);
      ctx.fill();

      ctx.strokeStyle = '#7c2d12';
      ctx.lineWidth = 2;
      ctx.strokeRect(screenX, screenY, block.width, block.height);

      ctx.fillStyle = '#7c2d12';
      ctx.beginPath();
      ctx.ellipse(screenX + block.width / 2, screenY + block.height / 2, 10, 4, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#fde047';
      ctx.fillRect(screenX + 10, screenY + 3, 4, 2);
      ctx.fillRect(screenX + block.width - 14, screenY + 3, 4, 2);
    } else if (block.type === 'mushroom') {
      ctx.fillStyle = '#f97316';
      ctx.beginPath();
      ctx.roundRect(screenX, screenY, block.width, 16, [8, 8, 2, 2]);
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      for (let dotX = screenX + 14; dotX < screenX + block.width - 10; dotX += 28) {
        ctx.beginPath();
        ctx.arc(dotX, screenY + 7, 4, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.fillStyle = '#fef08a';
      ctx.fillRect(screenX + block.width / 2 - 8, screenY + 16, 16, block.height - 16);
      ctx.strokeStyle = '#ca8a04';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(screenX + block.width / 2 - 8, screenY + 16, 16, block.height - 16);

      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 2;
      ctx.strokeRect(screenX, screenY, block.width, 16);
    } else if (block.type === 'moving_platform') {
      // 1. Moving Platform Bar (Yellow / Dark hazard stripes)
      ctx.fillStyle = '#eab308';
      ctx.fillRect(screenX, screenY, block.width, block.height);

      ctx.fillStyle = '#1e293b';
      for (let sx = screenX - 10; sx < screenX + block.width; sx += 24) {
        ctx.beginPath();
        ctx.moveTo(sx, screenY);
        ctx.lineTo(sx + 12, screenY);
        ctx.lineTo(sx + 6, screenY + block.height);
        ctx.lineTo(sx - 6, screenY + block.height);
        ctx.closePath();
        ctx.fill();
      }

      ctx.strokeStyle = '#78350f';
      ctx.lineWidth = 2;
      ctx.strokeRect(screenX, screenY, block.width, block.height);

      // 2. Pulley Wire connecting to the Cloud Anchor at top!
      const cloudY = Math.max(90, screenY - 140);
      const wireX = screenX + block.width / 2;

      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(wireX, screenY);
      ctx.lineTo(wireX, cloudY + 10);
      ctx.stroke();

      // 3. Smiling Retro SMW White Cloud at top anchor of wire!
      ctx.fillStyle = '#cbd5e1';
      ctx.beginPath();
      ctx.arc(wireX - 14, cloudY + 2, 13, 0, Math.PI * 2);
      ctx.arc(wireX + 14, cloudY + 2, 13, 0, Math.PI * 2);
      ctx.arc(wireX, cloudY - 3, 17, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(wireX - 14, cloudY, 13, 0, Math.PI * 2);
      ctx.arc(wireX + 14, cloudY, 13, 0, Math.PI * 2);
      ctx.arc(wireX, cloudY - 5, 17, 0, Math.PI * 2);
      ctx.fill();

      // Cloud smile & cute eyes
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(wireX - 6, cloudY - 6, 2.5, 5);
      ctx.fillRect(wireX + 4, cloudY - 6, 2.5, 5);
      ctx.fillStyle = '#f472b6';
      ctx.fillRect(wireX - 11, cloudY + 1, 4, 2);
      ctx.fillRect(wireX + 7, cloudY + 1, 4, 2);
    } else if (block.type === 'stone_block' || block.type === 'castle_stone') {
      ctx.fillStyle = '#475569';
      ctx.fillRect(screenX, screenY, block.width, block.height);

      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 2;
      ctx.strokeRect(screenX, screenY, block.width, block.height);

      ctx.fillStyle = '#64748b';
      ctx.fillRect(screenX, screenY, block.width, 4);

      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(screenX + block.width / 2, screenY + 4);
      ctx.lineTo(screenX + block.width / 2, screenY + block.height);
      ctx.stroke();
    } else if (block.type === 'code_bridge') {
      const flash = block.lifeTime < 3 && Math.floor(this.animTime * 10) % 2 === 0;
      ctx.fillStyle = flash ? 'rgba(6, 182, 212, 0.4)' : 'rgba(6, 182, 212, 0.9)';
      ctx.fillRect(screenX, screenY, block.width, block.height);

      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2;
      ctx.strokeRect(screenX, screenY, block.width, block.height);

      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 10px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('<code_bridge/>', screenX + block.width / 2, screenY + 14);
    } else if (block.type === 'quality_gate') {
      const gateTop = 0;
      const gateH = GROUND_Y;

      if (block.passed) {
        ctx.fillStyle = 'rgba(34, 197, 94, 0.18)';
        ctx.fillRect(screenX, gateTop, block.width, gateH);

        ctx.strokeStyle = '#22c55e';
        ctx.lineWidth = 2;
        ctx.setLineDash([8, 8]);
        ctx.strokeRect(screenX, gateTop, block.width, gateH);
        ctx.setLineDash([]);

        ctx.fillStyle = '#22c55e';
        ctx.fillRect(screenX - 35, 280, 90, 24);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 9px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('✓ OPEN', screenX + 10, 296);
      } else {
        const laserPulse = Math.abs(Math.sin(this.animTime * 6)) * 0.25 + 0.65;
        ctx.fillStyle = `rgba(239, 68, 68, ${laserPulse * 0.4})`;
        ctx.fillRect(screenX, gateTop, block.width, gateH);

        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(screenX + block.width / 2, gateTop);
        ctx.lineTo(screenX + block.width / 2, gateH);
        ctx.stroke();

        ctx.strokeStyle = '#fca5a5';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(screenX + block.width / 2, gateTop);
        ctx.lineTo(screenX + block.width / 2, gateH);
        ctx.stroke();

        ctx.fillStyle = '#1e293b';
        ctx.fillRect(screenX - 8, gateTop, block.width + 16, 20);
        ctx.fillRect(screenX - 8, gateH - 20, block.width + 16, 20);

        ctx.fillStyle = '#dc2626';
        ctx.fillRect(screenX - 52, 270, 124, 32);
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.strokeRect(screenX - 52, 270, 124, 32);

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 9px monospace';
        ctx.textAlign = 'center';

        // Display multiple red coins counter if required
        if (block.requiredCoins && block.requiredCoins > 1) {
          const current = block.collectedCoins || 0;
          const total = block.requiredCoins;
          ctx.fillText(`🔒 ${current}/${total} ROJAS`, screenX + 10, 284);
          ctx.fillText('PARA ABRIR', screenX + 10, 295);
        } else {
          ctx.fillText('🔒 BLOQUEADO', screenX + 10, 284);
          ctx.fillText(block.label ? block.label.split(':')[0] : 'GATE', screenX + 10, 295);
        }
      }
    } else {
      const totalH = Math.max(block.height, this.canvas.height - screenY);

      if (this.currentTheme === 'desert') {
        ctx.fillStyle = '#d97706';
        ctx.fillRect(screenX, screenY, block.width, totalH);

        ctx.fillStyle = '#f59e0b';
        ctx.fillRect(screenX, screenY, block.width, 8);

        ctx.strokeStyle = '#92400e';
        ctx.lineWidth = 1.5;
        for (let gy = screenY + 16; gy < screenY + totalH; gy += 24) {
          ctx.beginPath();
          ctx.moveTo(screenX, gy);
          ctx.lineTo(screenX + block.width, gy);
          ctx.stroke();
        }
      } else if (this.currentTheme === 'castle') {
        ctx.fillStyle = '#292524';
        ctx.fillRect(screenX, screenY, block.width, totalH);

        ctx.fillStyle = '#78716c';
        ctx.fillRect(screenX, screenY, block.width, 8);

        ctx.strokeStyle = '#1c1917';
        ctx.lineWidth = 2;
        for (let gy = screenY + 16; gy < screenY + totalH; gy += 24) {
          ctx.beginPath();
          ctx.moveTo(screenX, gy);
          ctx.lineTo(screenX + block.width, gy);
          ctx.stroke();
        }
      } else if (this.currentTheme === 'underground') {
        ctx.fillStyle = '#0284c7';
        ctx.fillRect(screenX, screenY, block.width, totalH);

        ctx.fillStyle = '#38bdf8';
        ctx.fillRect(screenX, screenY, block.width, 8);

        ctx.strokeStyle = '#0369a1';
        ctx.lineWidth = 1.5;
        for (let gy = screenY + 16; gy < screenY + totalH; gy += 24) {
          ctx.beginPath();
          ctx.moveTo(screenX, gy);
          ctx.lineTo(screenX + block.width, gy);
          ctx.stroke();
        }
      } else {
        ctx.fillStyle = '#c84c0c';
        ctx.fillRect(screenX, screenY, block.width, totalH);

        ctx.strokeStyle = '#802000';
        ctx.lineWidth = 1.5;
        for (let gy = screenY + 16; gy < screenY + totalH; gy += 24) {
          ctx.beginPath();
          ctx.moveTo(screenX, gy);
          ctx.lineTo(screenX + block.width, gy);
          ctx.stroke();
        }

        for (let gx = screenX + 16; gx < screenX + block.width; gx += 32) {
          ctx.beginPath();
          ctx.moveTo(gx, screenY + 16);
          ctx.lineTo(gx, screenY + totalH);
          ctx.stroke();
        }

        ctx.fillStyle = block.color || '#22c55e';
        ctx.fillRect(screenX, screenY, block.width, 8);

        ctx.fillStyle = '#15803d';
        for (let nx = screenX; nx < screenX + block.width; nx += 12) {
          ctx.fillRect(nx + 2, screenY + 8, 4, 3);
        }

        ctx.fillStyle = '#000000';
        ctx.fillRect(screenX, screenY, block.width, 1.5);
      }
    }

    ctx.restore();
  }

  drawFlagpole(flagpole, cameraX) {
    const ctx = this.ctx;
    const screenX = Math.round(flagpole.x - cameraX);
    const screenY = Math.round(flagpole.y);

    if (screenX + 50 < 0 || screenX > this.canvas.width) return;

    ctx.save();
    ctx.fillStyle = '#64748b';
    ctx.fillRect(screenX - 8, screenY + flagpole.height - 24, 48, 24);
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 2;
    ctx.strokeRect(screenX - 8, screenY + flagpole.height - 24, 48, 24);

    ctx.fillStyle = '#cbd5e1';
    ctx.fillRect(screenX + 12, screenY + 16, 8, flagpole.height - 40);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(screenX + 13, screenY + 16, 2, flagpole.height - 40);

    ctx.fillStyle = '#eab308';
    ctx.beginPath();
    ctx.arc(screenX + 16, screenY + 10, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#ca8a04';
    ctx.lineWidth = 2;
    ctx.stroke();

    const flagY = Math.round(flagpole.flagY);
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.moveTo(screenX + 12, flagY);
    ctx.lineTo(screenX - 28, flagY + 14);
    ctx.lineTo(screenX + 12, flagY + 28);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 12px monospace';
    ctx.fillText('★', screenX - 16, flagY + 18);

    ctx.restore();
  }

  drawPowerUp(powerUp, cameraX) {
    const ctx = this.ctx;
    const screenX = Math.round(powerUp.x - cameraX);
    const screenY = Math.round(powerUp.y);

    if (screenX + powerUp.width < 0 || screenX > this.canvas.width) return;

    ctx.save();
    ctx.fillStyle = '#ec4899';
    ctx.beginPath();
    ctx.arc(screenX + 12, screenY + 12, 12, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.font = '14px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('☕', screenX + 12, screenY + 17);
    ctx.restore();
  }

  drawCollectible(item, cameraX) {
    const ctx = this.ctx;
    const screenX = Math.round(item.x - cameraX);
    const screenY = Math.round(item.y + Math.sin(this.animTime * 5 + item.x) * 3);

    if (screenX + item.width < 0 || screenX > this.canvas.width) return;

    ctx.save();
    const spinWidth = Math.max(2, Math.abs(Math.cos(this.animTime * 6)) * 10);

    if (item.isRedCoin) {
      const glowPulse = Math.abs(Math.sin(this.animTime * 8)) * 8;
      ctx.shadowColor = '#ef4444';
      ctx.shadowBlur = 8 + glowPulse;

      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.ellipse(screenX + 12, screenY + 12, spinWidth, 11, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = '#fef08a';
      ctx.lineWidth = 2;
      ctx.stroke();

      if (spinWidth > 6) {
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 9px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('★', screenX + 12, screenY + 15);
      }
    } else {
      ctx.fillStyle = '#eab308';
      ctx.beginPath();
      ctx.ellipse(screenX + 12, screenY + 12, spinWidth, 11, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = '#ca8a04';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      if (spinWidth > 6) {
        ctx.fillStyle = '#78350f';
        ctx.font = 'bold 9px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('$', screenX + 12, screenY + 15);
      }
    }
    ctx.restore();
  }

  drawEnemy(enemy, cameraX) {
    const ctx = this.ctx;
    const screenX = Math.round(enemy.x - cameraX);
    const screenY = Math.round(enemy.y);

    if (screenX + enemy.width < 0 || screenX > this.canvas.width) return;

    ctx.save();

    if (enemy.isSquished) {
      ctx.fillStyle = '#9f1239';
      ctx.fillRect(screenX, screenY + 14, enemy.width, 10);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(screenX + 4, screenY + 16, 6, 2);
      ctx.fillRect(screenX + 22, screenY + 16, 6, 2);
    } else {
      ctx.fillStyle = '#e11d48';
      ctx.beginPath();
      ctx.ellipse(screenX + 16, screenY + 12, 14, 12, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = '#881337';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(screenX + 12, screenY + 2);
      ctx.lineTo(screenX + 8, screenY - 5);
      ctx.moveTo(screenX + 20, screenY + 2);
      ctx.lineTo(screenX + 24, screenY - 5);
      ctx.stroke();

      ctx.fillStyle = '#881337';
      const feetOffset = Math.floor(Math.sin(this.animTime * 12) * 4);
      ctx.fillRect(screenX + 4 + feetOffset, screenY + 20, 8, 6);
      ctx.fillRect(screenX + 20 - feetOffset, screenY + 20, 8, 6);

      ctx.fillStyle = '#ffffff';
      ctx.fillRect(screenX + 8, screenY + 8, 5, 6);
      ctx.fillRect(screenX + 19, screenY + 8, 5, 6);

      ctx.fillStyle = '#0f172a';
      ctx.fillRect(screenX + 10, screenY + 10, 3, 3);
      ctx.fillRect(screenX + 19, screenY + 10, 3, 3);
    }

    ctx.restore();
  }

  drawPiranhaPlant(plant, cameraX) {
    if (!plant.active) return;
    const ctx = this.ctx;
    const screenX = Math.round(plant.x - cameraX);
    const screenY = Math.round(plant.y);

    if (screenX + plant.width < 0 || screenX > this.canvas.width) return;

    ctx.save();
    // Green stem
    ctx.fillStyle = '#16a34a';
    ctx.fillRect(screenX + 12, screenY + 18, 8, plant.height - 18);
    ctx.fillStyle = '#22c55e';
    ctx.fillRect(screenX + 13, screenY + 18, 3, plant.height - 18);

    // Leaves on side
    ctx.fillStyle = '#15803d';
    ctx.beginPath();
    ctx.ellipse(screenX + 8, screenY + 28, 7, 3, -0.4, 0, Math.PI * 2);
    ctx.ellipse(screenX + 24, screenY + 28, 7, 3, 0.4, 0, Math.PI * 2);
    ctx.fill();

    // Red bulbous head with white polka dots
    ctx.fillStyle = '#dc2626';
    ctx.beginPath();
    ctx.arc(screenX + 16, screenY + 12, 14, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#7f1d1d';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(screenX + 10, screenY + 8, 2.5, 0, Math.PI * 2);
    ctx.arc(screenX + 22, screenY + 9, 2.5, 0, Math.PI * 2);
    ctx.arc(screenX + 15, screenY + 4, 2, 0, Math.PI * 2);
    ctx.fill();

    // White jaw lips & snapping teeth
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(screenX + 6, screenY + 12, 20, 4);

    if (plant.jawOpen) {
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(screenX + 8, screenY + 14, 16, 6);
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.moveTo(screenX + 9, screenY + 14);
      ctx.lineTo(screenX + 12, screenY + 18);
      ctx.lineTo(screenX + 15, screenY + 14);
      ctx.lineTo(screenX + 18, screenY + 18);
      ctx.lineTo(screenX + 21, screenY + 14);
      ctx.fill();
    }
    ctx.restore();
  }

  drawThwomp(thwomp, cameraX) {
    if (!thwomp.active) return;
    const ctx = this.ctx;
    const screenX = Math.round(thwomp.x + thwomp.shakeOffset - cameraX);
    const screenY = Math.round(thwomp.y);

    if (screenX + thwomp.width < 0 || screenX > this.canvas.width) return;

    ctx.save();
    const w = thwomp.width;
    const h = thwomp.height;

    // Spikes
    ctx.fillStyle = '#334155';
    ctx.beginPath();
    // Left spikes
    ctx.moveTo(screenX, screenY + 10); ctx.lineTo(screenX - 6, screenY + 16); ctx.lineTo(screenX, screenY + 22);
    ctx.moveTo(screenX, screenY + 32); ctx.lineTo(screenX - 6, screenY + 38); ctx.lineTo(screenX, screenY + 44);
    // Right spikes
    ctx.moveTo(screenX + w, screenY + 10); ctx.lineTo(screenX + w + 6, screenY + 16); ctx.lineTo(screenX + w, screenY + 22);
    ctx.moveTo(screenX + w, screenY + 32); ctx.lineTo(screenX + w + 6, screenY + 38); ctx.lineTo(screenX + w, screenY + 44);
    // Top spikes
    ctx.moveTo(screenX + 12, screenY); ctx.lineTo(screenX + 18, screenY - 6); ctx.lineTo(screenX + 24, screenY);
    ctx.moveTo(screenX + 26, screenY); ctx.lineTo(screenX + 32, screenY - 6); ctx.lineTo(screenX + 38, screenY);
    // Bottom spikes
    ctx.moveTo(screenX + 12, screenY + h); ctx.lineTo(screenX + 18, screenY + h + 6); ctx.lineTo(screenX + 24, screenY + h);
    ctx.moveTo(screenX + 26, screenY + h); ctx.lineTo(screenX + 32, screenY + h + 6); ctx.lineTo(screenX + 38, screenY + h);
    ctx.fill();

    // Body
    ctx.fillStyle = '#475569';
    ctx.fillRect(screenX, screenY, w, h);
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 2;
    ctx.strokeRect(screenX, screenY, w, h);

    const isAngry = thwomp.isAngry || thwomp.state === 'slamming' || thwomp.state === 'shaking';

    // Eyes
    ctx.fillStyle = isAngry ? '#ef4444' : '#f8fafc';
    ctx.fillRect(screenX + 8, screenY + 14, 10, 10);
    ctx.fillRect(screenX + 26, screenY + 14, 10, 10);

    // Pupils
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(screenX + 12, screenY + 16, 4, 5);
    ctx.fillRect(screenX + 28, screenY + 16, 4, 5);

    // Eyebrows
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.moveTo(screenX + 6, screenY + 11);
    ctx.lineTo(screenX + 20, screenY + 16);
    ctx.lineTo(screenX + 20, screenY + 13);
    ctx.lineTo(screenX + 6, screenY + 9);
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(screenX + 38, screenY + 11);
    ctx.lineTo(screenX + 24, screenY + 16);
    ctx.lineTo(screenX + 24, screenY + 13);
    ctx.lineTo(screenX + 38, screenY + 9);
    ctx.fill();

    // Gritted Teeth
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(screenX + 10, screenY + 34, 24, 10);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(screenX + 11, screenY + 35, 22, 8);
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1.5;
    for (let tx = screenX + 15; tx < screenX + 32; tx += 5) {
      ctx.beginPath();
      ctx.moveTo(tx, screenY + 35);
      ctx.lineTo(tx, screenY + 43);
      ctx.stroke();
    }
    ctx.beginPath();
    ctx.moveTo(screenX + 11, screenY + 39);
    ctx.lineTo(screenX + 33, screenY + 39);
    ctx.stroke();

    if (thwomp.state === 'grounded') {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.fillRect(screenX - 8, screenY + h - 4, 6, 4);
      ctx.fillRect(screenX + w + 2, screenY + h - 4, 6, 4);
    }
    ctx.restore();
  }

  drawCheckpoint(checkpoint, cameraX) {
    const ctx = this.ctx;
    const screenX = Math.round(checkpoint.x - cameraX);
    const screenY = Math.round(checkpoint.y);

    if (screenX + 40 < 0 || screenX > this.canvas.width) return;

    ctx.save();
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(screenX + 8, screenY + checkpoint.height);
    ctx.lineTo(screenX + 8, screenY);
    ctx.stroke();

    const isReached = checkpoint.reached;
    ctx.fillStyle = isReached ? '#22c55e' : '#6366f1';
    ctx.fillRect(screenX + 8, screenY, 32, 18);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 9px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(checkpoint.label, screenX + 24, screenY + 13);
    ctx.restore();
  }

  drawNPC(npc, cameraX) {
    const ctx = this.ctx;
    const screenX = Math.round(npc.x - cameraX);
    const screenY = Math.round(npc.y);

    if (screenX + npc.width < 0 || screenX > this.canvas.width) return;

    ctx.save();
    ctx.fillStyle = npc.roleColor || '#ec4899';
    ctx.fillRect(screenX + 4, screenY + 10, 24, 22);

    ctx.fillStyle = '#fde047';
    ctx.fillRect(screenX + 6, screenY, 20, 12);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 9px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(npc.roleShort || 'NPC', screenX + 16, screenY + 24);

    const floatOffset = Math.sin(this.animTime * 4) * 4;
    ctx.font = 'bold 14px sans-serif';
    ctx.fillText('💬', screenX + 16, screenY - 8 + floatOffset);
    ctx.restore();
  }

  updateAnimTime(dt) {
    this.animTime += dt;
  }
}

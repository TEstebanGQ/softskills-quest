/**
 * Entity - Base class for game objects.
 */
export class Entity {
  constructor(x, y, width, height, type = 'generic') {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.type = type;
    this.vx = 0;
    this.vy = 0;
    this.active = true;
  }

  get bounds() {
    return {
      left: this.x,
      right: this.x + this.width,
      top: this.y,
      bottom: this.y + this.height
    };
  }

  intersects(other) {
    const a = this.bounds;
    const b = other.bounds;
    return (
      a.left < b.right &&
      a.right > b.left &&
      a.top < b.bottom &&
      a.bottom > b.top
    );
  }

  update(dt) {
    this.x += this.vx * dt;
    this.y += this.vy * dt;
  }
}

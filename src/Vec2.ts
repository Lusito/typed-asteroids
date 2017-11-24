/**
 * License: zlib/libpng
 * @author Santo Pfingsten
 * @see https://github.com/Lusito/typed-asteroids
 */

export const DEG_TO_RAD = Math.PI / 180;
export const RAD_TO_DEG = 180 / Math.PI;

export class Vec2 {
    x: number;
    y: number;

    constructor(x: number = 0, y: number = 0) {
        this.x = x;
        this.y = y;
    }

    set(x: number, y: number) {
        this.x = x;
        this.y = y;
        return this;
    }

    setFrom(other: Vec2) {
        this.x = other.x;
        this.y = other.y;
        return this;
    }

    toJSON() {
        return { x: this.x, y: this.y };
    }

    toString() {
        return `{x:${this.x}, y:${this.y}}`;
    }

    zero() {
        this.x = this.y = 0;
        return this;
    }

    isZero() {
        return this.x === 0 && this.y === 0;
    }

    length() {
        return Math.sqrt(this.lengthSqr());
    }

    setLength(length: number) {
        this.normalize();
        this.scale(length);
        return this;
    }

    lengthSqr() {
        return this.x * this.x + this.y * this.y;
    }

    capLength(length: number) {
        if (length <= 0)
            this.zero();
        else {
            let lenSqr = this.lengthSqr();
            if (lenSqr > length * length)
                this.scale(length / Math.sqrt(lenSqr));
        }
    }

    normalize() {
        let lenSqr = this.lengthSqr();
        let lenInv = 1.0 / Math.sqrt(lenSqr);

        this.scale(lenInv);
        return this;
    }

    normalizeFast() {
        return this;
    }

    equals(other: Vec2, epsilon: number = 0) {
        return epsilon === 0
            ? (this.x === other.x && this.y === other.y)
            : (Math.abs(this.x - other.x) <= epsilon && Math.abs(this.y - other.y) <= epsilon);
    }

    getAngle() {
        if (this.isZero())
            return 0.0;
        let angle = Math.atan2(this.y, this.x) * RAD_TO_DEG;
        if (angle < 0.0)
            angle += 360.0;
        return angle;

    }

    setAngle(angle: number) {
        let f = angle * DEG_TO_RAD;
        this.y = Math.sin(f);
        this.x = Math.cos(f);
        this.normalize();
        return this;
    }

    add(other: Vec2) {
        this.x += other.x;
        this.y += other.y;
        return this;
    }

    subtract(other: Vec2) {
        this.x -= other.x;
        this.y -= other.y;
        return this;
    }

    multiply(other: Vec2) {
        this.x *= other.x;
        this.y *= other.y;
        return this;
    }

    divide(other: Vec2) {
        this.x /= other.x;
        this.y /= other.y;
        return this;
    }

    scale(factor: number) {
        this.x *= factor;
        this.y *= factor;
        return this;
    }

    distanceTo(other: Vec2) {
        let dx = other.x - this.x;
        let dy = other.y - this.y;
        return Math.sqrt(dx * dx + dy * dy);
    }
}

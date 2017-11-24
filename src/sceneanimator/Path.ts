/**
 * License: zlib/libpng
 * @author Santo Pfingsten
 * @see https://github.com/Lusito/typed-asteroids
 */

import { Vec2 } from "../Vec2";

export interface Path {
    derivativeAt(out: Vec2, t: number): Vec2;
    valueAt(out: Vec2, t: number): Vec2;
    getTotalTime(): number;
}

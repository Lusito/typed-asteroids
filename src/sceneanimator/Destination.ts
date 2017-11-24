/**
 * License: zlib/libpng
 * @author Santo Pfingsten
 * @see https://github.com/Lusito/typed-asteroids
 */

import { Vec2 } from "../Vec2";

export class Destination extends Vec2 {
    speed: number = 0;
    moveTime: number = 0;
    startTime: number = 0;
}

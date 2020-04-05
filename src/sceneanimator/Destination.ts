/**
 * License: zlib/libpng
 * @author Santo Pfingsten
 * @see https://github.com/Lusito/typed-asteroids
 */

import { Vec2 } from "../Vec2";

export class Destination extends Vec2 {
    speed = 0;

    moveTime = 0;

    startTime = 0;
}

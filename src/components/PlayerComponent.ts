/**
 * License: zlib/libpng
 * @author Santo Pfingsten
 * @see https://github.com/Lusito/typed-asteroids
 */

import { Component } from "typed-ecstasy";

export class PlayerComponent extends Component {
    acceleration = 0;

    maxSpeed = 0;

    spawnProtection = 0;

    spawnProtectionFade = 0;
}

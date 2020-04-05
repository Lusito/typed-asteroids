/**
 * License: zlib/libpng
 * @author Santo Pfingsten
 * @see https://github.com/Lusito/typed-asteroids
 */

import { Component } from "typed-ecstasy";

export class PhysicsComponent extends Component {
    radius = 0;

    group = "";

    collidesWith: string[] = [];
}

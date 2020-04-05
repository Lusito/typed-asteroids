/**
 * License: zlib/libpng
 * @author Santo Pfingsten
 * @see https://github.com/Lusito/typed-asteroids
 */

import { Component } from "typed-ecstasy";

import { Vec2 } from "../Vec2";

export class VelocityComponent extends Component {
    dir = new Vec2();

    rotation = 0.0;
}

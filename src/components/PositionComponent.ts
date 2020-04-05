/**
 * License: zlib/libpng
 * @author Santo Pfingsten
 * @see https://github.com/Lusito/typed-asteroids
 */

import { Component } from "typed-ecstasy";

import { Vec2 } from "../Vec2";

export class PositionComponent extends Component {
    position = new Vec2();

    rotation = 0.0;

    positions: Vec2[];

    public constructor() {
        super();
        this.positions = [new Vec2(), new Vec2(), new Vec2(), new Vec2()];
    }
}

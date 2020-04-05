/**
 * License: zlib/libpng
 * @author Santo Pfingsten
 * @see https://github.com/Lusito/typed-asteroids
 */

import { Component } from "typed-ecstasy";

import { StateSpriteContainer } from "../StateSpriteContainer";

export class SpriteComponent extends Component {
    sprites: StateSpriteContainer[] = [];

    layer = "";

    popTime = 0;

    popTimeFull = 0;

    scale = 1;
}

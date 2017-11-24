/**
 * License: zlib/libpng
 * @author Santo Pfingsten
 * @see https://github.com/Lusito/typed-asteroids
 */

import { Container, Sprite } from "pixi.js";

export class StateSpriteContainer extends Container {
    states: { [s: string]: Sprite } = {};

    constructor() {
        super();
    }

    addState(name: string, sprite: Sprite) {
        let old = this.states[name];
        if (old)
            this.removeChild(old);
        this.states[name] = sprite;
        this.addChild(sprite);
    }

    removeAll() {
        for (let key in this.states)
            this.removeChild(this.states[key]);
        this.states = {};
    }

    setVisible(name: string, visible: boolean) {
        let state = this.states[name];
        if (state)
            state.visible = visible;
    }
}

/**
 * License: zlib/libpng
 * @author Santo Pfingsten
 * @see https://github.com/Lusito/typed-asteroids
 */

import { Container, Sprite } from "pixi.js";

export class StateSpriteContainer extends Container {
    states: { [s: string]: Sprite } = {};

    addState(name: string, sprite: Sprite) {
        const old = this.states[name];
        if (old) this.removeChild(old);
        this.states[name] = sprite;
        this.addChild(sprite);
    }

    removeAll() {
        for (const key of Object.keys(this.states)) this.removeChild(this.states[key]);
        this.states = {};
    }

    setVisible(name: string, visible: boolean) {
        const state = this.states[name];
        if (state) state.visible = visible;
    }
}

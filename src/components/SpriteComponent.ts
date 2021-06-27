import { Component } from "typed-ecstasy";

import { componentFactories } from "./componentFactories";
import { StateSpriteContainer } from "../StateSpriteContainer";

export class SpriteComponent extends Component {
    public readonly sprites: StateSpriteContainer[] = [];

    public layer = "";

    public popTime = 0;

    public popTimeFull = 0;

    public scale = 1;
}

export type Layer =
    | "big_asteroids"
    | "medium_asteroids"
    | "small_asteroids"
    | "powerups"
    | "blasts"
    | "splitter"
    | "player";

export interface SpriteStateDef {
    name: string;
    texture: string;
}

export type SpriteConfig = {
    states: SpriteStateDef[];
    layer: Layer;
    scale?: number;
    popTime?: number;
};

componentFactories.add("Sprite", (obtain, blueprint, { assets }) => {
    const comp = obtain(SpriteComponent);
    comp.layer = blueprint.get("layer", "big_asteroids");
    const states = blueprint.get("states", []);
    comp.scale = blueprint.get("scale", 1);
    comp.popTime = blueprint.get("popTime", 0.5);
    comp.popTimeFull = comp.popTime;
    for (let i = 0; i < 4; i++) {
        const container = new StateSpriteContainer();
        for (const state of states) {
            const sprite = assets.createSprite(state.texture);
            sprite.anchor.set(0.5);
            container.addState(state.name, sprite);
        }
        container.scale.set(comp.popTime ? 0 : comp.scale);
        comp.sprites.push(container);
    }
    return comp;
});

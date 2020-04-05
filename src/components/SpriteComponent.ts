import { Component, Entity, ComponentBlueprint } from "typed-ecstasy";
import { Sprite } from "pixi.js";

import { StateSpriteContainer } from "../StateSpriteContainer";
import { SpriteStateDef } from "../PossibleComponentDefs";
import { getTexture } from "../loader";

export class SpriteComponent extends Component {
    sprites: StateSpriteContainer[] = [];

    layer = "";

    popTime = 0;

    popTimeFull = 0;

    scale = 1;
}

export function spriteComponentFactory(entity: Entity, blueprint: ComponentBlueprint) {
    const comp = new SpriteComponent();
    comp.layer = blueprint.getString("layer", "");
    const states: SpriteStateDef[] = blueprint.getAny("states", []);
    comp.scale = blueprint.getNumber("scale", 1);
    comp.popTime = blueprint.getNumber("popTime", 0.5);
    comp.popTimeFull = comp.popTime;
    for (let i = 0; i < 4; i++) {
        const container = new StateSpriteContainer();
        for (const state of states) {
            const sprite = new Sprite(getTexture(state.texture));
            sprite.anchor.set(0.5);
            container.addState(state.name, sprite);
        }
        container.scale.set(comp.popTime ? 0 : comp.scale);
        comp.sprites.push(container);
    }
    entity.add(comp);
    return true;
}

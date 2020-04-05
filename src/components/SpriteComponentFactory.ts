/**
 * License: zlib/libpng
 * @author Santo Pfingsten
 * @see https://github.com/Lusito/typed-asteroids
 */

import { ComponentFactory, ComponentBlueprint, Entity } from "typed-ecstasy";
import { Sprite } from "pixi.js";

import { SpriteComponent } from "./SpriteComponent";
import { SpriteStateDef } from "../PossibleComponentDefs";
import { StateSpriteContainer } from "../StateSpriteContainer";
import { getTexture } from "../loader";

export class SpriteComponentFactory extends ComponentFactory {
    public assemble(entity: Entity, blueprint: ComponentBlueprint) {
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
}

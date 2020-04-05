/**
 * License: zlib/libpng
 * @author Santo Pfingsten
 * @see https://github.com/Lusito/typed-asteroids
 */

import { ComponentFactory, ComponentBlueprint, Entity } from "typed-ecstasy";

import { ShieldComponent } from "./ShieldComponent";

export class ShieldComponentFactory extends ComponentFactory {
    public assemble(entity: Entity, blueprint: ComponentBlueprint) {
        const comp = entity.add(new ShieldComponent());
        comp.lifeTime = blueprint.getNumber("lifeTime", 0);
        return true;
    }
}


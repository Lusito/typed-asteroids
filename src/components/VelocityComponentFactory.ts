/**
 * License: zlib/libpng
 * @author Santo Pfingsten
 * @see https://github.com/Lusito/typed-asteroids
 */

import { ComponentFactory, ComponentBlueprint, Entity } from "typed-ecstasy";

import { VelocityComponent } from "./VelocityComponent";

export class VelocityComponentFactory extends ComponentFactory {
    public assemble(entity: Entity, blueprint: ComponentBlueprint) {
        const comp = new VelocityComponent();
        comp.dir.set(blueprint.getNumber("x", 0), blueprint.getNumber("y", 0));
        comp.rotation = blueprint.getNumber("rotation", 0);
        entity.add(comp);
        return true;
    }
}

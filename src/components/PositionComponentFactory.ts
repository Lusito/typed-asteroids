/**
 * License: zlib/libpng
 * @author Santo Pfingsten
 * @see https://github.com/Lusito/typed-asteroids
 */

import { ComponentFactory, ComponentBlueprint, Entity } from "typed-ecstasy";

import { PositionComponent } from "./PositionComponent";

export class PositionComponentFactory extends ComponentFactory {
    public assemble(entity: Entity, blueprint: ComponentBlueprint) {
        const comp = new PositionComponent();
        comp.position.set(blueprint.getNumber("x", 0), blueprint.getNumber("y", 0));
        comp.rotation = blueprint.getNumber("rotation", 0);
        entity.add(comp);
        return true;
    }
}

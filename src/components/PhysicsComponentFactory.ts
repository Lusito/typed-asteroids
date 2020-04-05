/**
 * License: zlib/libpng
 * @author Santo Pfingsten
 * @see https://github.com/Lusito/typed-asteroids
 */

import { ComponentFactory, ComponentBlueprint, Entity } from "typed-ecstasy";

import { PhysicsComponent } from "./PhysicsComponent";

export class PhysicsComponentFactory extends ComponentFactory {
    public assemble(entity: Entity, blueprint: ComponentBlueprint) {
        const comp = entity.add(new PhysicsComponent());
        comp.radius = blueprint.getNumber("radius", 0);
        comp.group = blueprint.getString("group", "");
        comp.collidesWith = blueprint.getString("collidesWith", "").split(",");
        return true;
    }
}

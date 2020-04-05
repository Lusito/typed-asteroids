/**
 * License: zlib/libpng
 * @author Santo Pfingsten
 * @see https://github.com/Lusito/typed-asteroids
 */

import { ComponentFactory, ComponentBlueprint, Entity } from "typed-ecstasy";

import { PlayerComponent } from "./PlayerComponent";

export class PlayerComponentFactory extends ComponentFactory {
    public assemble(entity: Entity, blueprint: ComponentBlueprint) {
        const comp = entity.add(new PlayerComponent());
        comp.acceleration = blueprint.getNumber("acceleration", 100);
        comp.maxSpeed = blueprint.getNumber("maxSpeed", 200);
        comp.spawnProtection = blueprint.getNumber("spawnProtection", 1);
        comp.spawnProtectionFade = blueprint.getNumber("spawnProtectionFade", 1);
        return true;
    }
}

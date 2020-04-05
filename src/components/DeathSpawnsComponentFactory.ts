/**
 * License: zlib/libpng
 * @author Santo Pfingsten
 * @see https://github.com/Lusito/typed-asteroids
 */

import { ComponentFactory, Entity, ComponentBlueprint } from "typed-ecstasy";

import { DeathSpawnsComponent } from "./DeathSpawnsComponent";

export class DeathSpawnsComponentFactory extends ComponentFactory {
    public assemble(entity: Entity, blueprint: ComponentBlueprint) {
        const comp = entity.add(new DeathSpawnsComponent());
        comp.entity = blueprint.getString("entity", "");
        comp.countMin = blueprint.getNumber("countMin", 0);
        comp.countMax = blueprint.getNumber("countMax", 0);
        comp.speedMin = blueprint.getNumber("speedMin", 0);
        comp.speedMax = blueprint.getNumber("speedMax", 0);
        return true;
    }
}

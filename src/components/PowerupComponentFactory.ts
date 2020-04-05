/**
 * License: zlib/libpng
 * @author Santo Pfingsten
 * @see https://github.com/Lusito/typed-asteroids
 */

import { ComponentFactory, ComponentBlueprint, Entity } from "typed-ecstasy";

import { PowerupComponent } from "./PowerupComponent";

export class PowerupComponentFactory extends ComponentFactory {
    public assemble(entity: Entity, blueprint: ComponentBlueprint) {
        const comp = entity.add(new PowerupComponent());
        comp.extraLifes = blueprint.getNumber("extraLifes", 1);
        return true;
    }
}

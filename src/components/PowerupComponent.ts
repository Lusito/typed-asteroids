import { Component, Entity, ComponentBlueprint } from "typed-ecstasy";

export class PowerupComponent extends Component {
    extraLifes = 0;
}

export function powerupComponentFactory(entity: Entity, blueprint: ComponentBlueprint) {
    const comp = entity.add(new PowerupComponent());
    comp.extraLifes = blueprint.getNumber("extraLifes", 1);
    return true;
}

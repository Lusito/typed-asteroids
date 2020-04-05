import { Component, Entity, ComponentBlueprint } from "typed-ecstasy";

export class PlayerComponent extends Component {
    acceleration = 0;

    maxSpeed = 0;

    spawnProtection = 0;

    spawnProtectionFade = 0;
}

export function playerComponentFactory(entity: Entity, blueprint: ComponentBlueprint) {
    const comp = entity.add(new PlayerComponent());
    comp.acceleration = blueprint.getNumber("acceleration", 100);
    comp.maxSpeed = blueprint.getNumber("maxSpeed", 200);
    comp.spawnProtection = blueprint.getNumber("spawnProtection", 1);
    comp.spawnProtectionFade = blueprint.getNumber("spawnProtectionFade", 1);
    return true;
}

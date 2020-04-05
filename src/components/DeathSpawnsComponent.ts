import { Component, Entity, ComponentBlueprint } from "typed-ecstasy";

export class DeathSpawnsComponent extends Component {
    entity = "";

    countMin = 0;

    countMax = 0;

    speedMin = 0;

    speedMax = 0;
}

export function deathSpawnsComponentFactory(entity: Entity, blueprint: ComponentBlueprint) {
    const comp = entity.add(new DeathSpawnsComponent());
    comp.entity = blueprint.getString("entity", "");
    comp.countMin = blueprint.getNumber("countMin", 0);
    comp.countMax = blueprint.getNumber("countMax", 0);
    comp.speedMin = blueprint.getNumber("speedMin", 0);
    comp.speedMax = blueprint.getNumber("speedMax", 0);
    return true;
}

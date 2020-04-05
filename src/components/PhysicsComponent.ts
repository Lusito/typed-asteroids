import { Component, Entity, ComponentBlueprint } from "typed-ecstasy";

export class PhysicsComponent extends Component {
    radius = 0;

    group = "";

    collidesWith: string[] = [];
}

export function physicsComponentFactory(entity: Entity, blueprint: ComponentBlueprint) {
    const comp = entity.add(new PhysicsComponent());
    comp.radius = blueprint.getNumber("radius", 0);
    comp.group = blueprint.getString("group", "");
    comp.collidesWith = blueprint.getString("collidesWith", "").split(",");
    return true;
}

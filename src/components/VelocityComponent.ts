import { Component, Entity, ComponentBlueprint } from "typed-ecstasy";

import { Vec2 } from "../Vec2";

export class VelocityComponent extends Component {
    dir = new Vec2();

    rotation = 0.0;
}

export function velocityComponentFactory(entity: Entity, blueprint: ComponentBlueprint) {
    const comp = new VelocityComponent();
    comp.dir.set(blueprint.getNumber("x", 0), blueprint.getNumber("y", 0));
    comp.rotation = blueprint.getNumber("rotation", 0);
    entity.add(comp);
    return true;
}

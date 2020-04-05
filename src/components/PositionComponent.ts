import { Component, Entity, ComponentBlueprint } from "typed-ecstasy";

import { Vec2 } from "../Vec2";

export class PositionComponent extends Component {
    position = new Vec2();

    rotation = 0.0;

    positions: Vec2[];

    public constructor() {
        super();
        this.positions = [new Vec2(), new Vec2(), new Vec2(), new Vec2()];
    }
}

export function positionComponentFactory(entity: Entity, blueprint: ComponentBlueprint) {
    const comp = new PositionComponent();
    comp.position.set(blueprint.getNumber("x", 0), blueprint.getNumber("y", 0));
    comp.rotation = blueprint.getNumber("rotation", 0);
    entity.add(comp);
    return true;
}

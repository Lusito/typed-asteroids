import { Component, Entity, ComponentBlueprint } from "typed-ecstasy";

export class LifeTimeComponent extends Component {
    lifeTime = 0;
}

export function lifeTimeComponentFactory(entity: Entity, blueprint: ComponentBlueprint) {
    const comp = entity.add(new LifeTimeComponent());
    comp.lifeTime = blueprint.getNumber("lifeTime", 0);
    return true;
}

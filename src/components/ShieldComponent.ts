import { Component, Entity, ComponentBlueprint } from "typed-ecstasy";

export class ShieldComponent extends Component {
    lifeTime = 0;
}

export function shieldComponentFactory(entity: Entity, blueprint: ComponentBlueprint) {
    const comp = entity.add(new ShieldComponent());
    comp.lifeTime = blueprint.getNumber("lifeTime", 0);
    return true;
}

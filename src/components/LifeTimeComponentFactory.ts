import { ComponentFactory, ComponentBlueprint, Entity } from "typed-ecstasy";

import { LifeTimeComponent } from "./LifeTimeComponent";

export class LifeTimeComponentFactory extends ComponentFactory {
    public assemble(entity: Entity, blueprint: ComponentBlueprint) {
        const comp = entity.add(new LifeTimeComponent());
        comp.lifeTime = blueprint.getNumber("lifeTime", 0);
        return true;
    }
}

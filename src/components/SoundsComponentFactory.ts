import { ComponentFactory, ComponentBlueprint, Entity } from "typed-ecstasy";

import { SoundsComponent } from "./SoundsComponent";
import { getSound } from "../loader";

export class SoundsComponentFactory extends ComponentFactory {
    public assemble(entity: Entity, blueprint: ComponentBlueprint) {
        const comp = entity.add(new SoundsComponent());
        let key = blueprint.getString("spawn", "");
        if (key) comp.spawn = getSound(key);
        key = blueprint.getString("die", "");
        if (key) comp.die = getSound(key);
        key = blueprint.getString("pickup", "");
        if (key) comp.pickup = getSound(key);
        return true;
    }
}

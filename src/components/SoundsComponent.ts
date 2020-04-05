import { Component, Entity, ComponentBlueprint } from "typed-ecstasy";
import pixiSound from "pixi-sound";

import { getSound } from "../loader";

export class SoundsComponent extends Component {
    spawn?: pixiSound.Sound;

    die?: pixiSound.Sound;

    pickup?: pixiSound.Sound;
}

export function soundsComponentFactory(entity: Entity, blueprint: ComponentBlueprint) {
    const comp = entity.add(new SoundsComponent());
    let key = blueprint.getString("spawn", "");
    if (key) comp.spawn = getSound(key);
    key = blueprint.getString("die", "");
    if (key) comp.die = getSound(key);
    key = blueprint.getString("pickup", "");
    if (key) comp.pickup = getSound(key);
    return true;
}

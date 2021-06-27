import { Component } from "typed-ecstasy";
import pixiSound from "pixi-sound";

import { componentFactories } from "./componentFactories";

export class SoundsComponent extends Component {
    public spawn?: pixiSound.Sound;

    public die?: pixiSound.Sound;

    public pickup?: pixiSound.Sound;
}

export type SoundsConfig = {
    spawn?: string;
    die?: string;
    pickup?: string;
};

componentFactories.add("Sounds", (obtain, blueprint, { assets }) => {
    const comp = obtain(SoundsComponent);
    let key = blueprint.get("spawn", "");
    comp.spawn = key ? assets.getSound(key) : undefined;
    key = blueprint.get("die", "");
    comp.die = key ? assets.getSound(key) : undefined;
    key = blueprint.get("pickup", "");
    comp.pickup = key ? assets.getSound(key) : undefined;
    return comp;
});

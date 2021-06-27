import { Component } from "typed-ecstasy";

import { componentFactories } from "./componentFactories";

export class PlayerComponent extends Component {
    public acceleration = 0;

    public maxSpeed = 0;

    public spawnProtection = 0;

    public spawnProtectionFade = 0;
}

export type PlayerConfig = {
    acceleration: number;
    maxSpeed: number;
    spawnProtection: number;
    spawnProtectionFade: number;
};

componentFactories.add("Player", (obtain, blueprint) => {
    const comp = obtain(PlayerComponent);
    comp.acceleration = blueprint.get("acceleration", 100);
    comp.maxSpeed = blueprint.get("maxSpeed", 200);
    comp.spawnProtection = blueprint.get("spawnProtection", 1);
    comp.spawnProtectionFade = blueprint.get("spawnProtectionFade", 1);
    return comp;
});

import { Component } from "typed-ecstasy";

import { componentFactories } from "./componentFactories";
import { Vec2 } from "../Vec2";

export class VelocityComponent extends Component {
    public readonly dir = new Vec2();

    public rotation = 0.0;
}

export type VelocityConfig = {
    x?: number;
    y?: number;
    rotation?: number;
};

componentFactories.add("Velocity", (obtain, blueprint) => {
    const comp = obtain(VelocityComponent);
    comp.dir.set(blueprint.get("x", 0), blueprint.get("y", 0));
    comp.rotation = blueprint.get("rotation", 0);
    return comp;
});

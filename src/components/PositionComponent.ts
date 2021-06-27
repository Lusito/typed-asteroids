import { Component } from "typed-ecstasy";

import { componentFactories } from "./componentFactories";
import { Vec2 } from "../Vec2";

export class PositionComponent extends Component {
    public readonly position = new Vec2();

    public rotation = 0;

    public readonly positions: Vec2[] = [new Vec2(), new Vec2(), new Vec2(), new Vec2()];
}

export type PositionConfig = {
    x?: number;
    y?: number;
    rotation?: number;
};

componentFactories.add("Position", (obtain, blueprint) => {
    const comp = obtain(PositionComponent);
    comp.position.set(blueprint.get("x", 0), blueprint.get("y", 0));
    comp.rotation = blueprint.get("rotation", 0);
    return comp;
});

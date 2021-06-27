import { Component } from "typed-ecstasy";

import { componentFactories } from "./componentFactories";

export type PhysicsGroup = "blast" | "player" | "asteroid" | "powerup";

export class PhysicsComponent extends Component {
    public radius = 0;

    public group: PhysicsGroup = "asteroid";

    public collidesWith: PhysicsGroup[] = [];
}

export type PhysicsConfig = {
    radius: number;
    group: PhysicsGroup;
    collidesWith?: PhysicsGroup[];
};

componentFactories.add("Physics", (obtain, blueprint) => {
    const comp = obtain(PhysicsComponent);
    comp.radius = blueprint.get("radius", 0);
    comp.group = blueprint.get("group", "asteroid");
    comp.collidesWith = blueprint.get("collidesWith", []);
    return comp;
});

import { Component } from "typed-ecstasy";

import { componentFactories } from "./componentFactories";

export class LifeTimeComponent extends Component {
    public lifeTime = 0;
}

export type LifeTimeConfig = {
    lifeTime: number;
};

componentFactories.add("LifeTime", (obtain, blueprint) => {
    const comp = obtain(LifeTimeComponent);
    comp.lifeTime = blueprint.get("lifeTime", 0);
    return comp;
});

import { Component } from "typed-ecstasy";

import { componentFactories } from "./componentFactories";

export class ShieldComponent extends Component {
    public lifeTime = 0;
}

export type ShieldConfig = {
    lifeTime: number;
};

componentFactories.add("Shield", (obtain, blueprint) => {
    const comp = obtain(ShieldComponent);
    comp.lifeTime = blueprint.get("lifeTime", 0);
    return comp;
});

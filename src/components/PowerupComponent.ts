import { Component } from "typed-ecstasy";

import { componentFactories } from "./componentFactories";

export class PowerupComponent extends Component {
    public extraLifes = 0;
}

export type PowerupConfig = {
    extraLifes?: number;
};

componentFactories.add("Powerup", (obtain, blueprint) => {
    const comp = obtain(PowerupComponent);
    comp.extraLifes = blueprint.get("extraLifes", 1);
    return comp;
});

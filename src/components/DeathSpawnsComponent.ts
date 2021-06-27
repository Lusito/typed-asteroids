import { Component } from "typed-ecstasy";

import { componentFactories } from "./componentFactories";

export class DeathSpawnsComponent extends Component {
    public entity = "";

    public countMin = 0;

    public countMax = 0;

    public speedMin = 0;

    public speedMax = 0;
}

export type DeathSpawnsConfig = {
    entity: string;
    countMin: number;
    countMax: number;
    speedMin: number;
    speedMax: number;
};

componentFactories.add("DeathSpawns", (obtain, blueprint) => {
    const comp = obtain(DeathSpawnsComponent);
    comp.entity = blueprint.get("entity", "");
    comp.countMin = blueprint.get("countMin", 0);
    comp.countMax = blueprint.get("countMax", 0);
    comp.speedMin = blueprint.get("speedMin", 0);
    comp.speedMax = blueprint.get("speedMax", 0);
    return comp;
});

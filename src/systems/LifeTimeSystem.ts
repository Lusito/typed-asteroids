import { IteratingSystem, Family, Entity } from "typed-ecstasy";
import { Inject, Service } from "typedi";

import { LifeTimeComponent } from "../components/LifeTimeComponent";
import { GameEvents } from "../services/GameEvents";

@Service()
export class LifeTimeSystem extends IteratingSystem {
    @Inject()
    private readonly gameEvents!: GameEvents;

    public constructor() {
        super(Family.all(LifeTimeComponent).get());
    }

    protected override processEntity(entity: Entity, deltaTime: number) {
        const ltc = entity.require(LifeTimeComponent);
        ltc.lifeTime -= deltaTime;
        if (ltc.lifeTime <= 0) this.gameEvents.death.emit(entity);
    }
}

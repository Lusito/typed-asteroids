import { IteratingSystem, Family, Entity } from "typed-ecstasy";
import { Inject, Service } from "typedi";

import { ShieldComponent } from "../components/ShieldComponent";
import { GameEvents } from "../services/GameEvents";

@Service()
export class ShieldSystem extends IteratingSystem {
    @Inject()
    private readonly gameEvents!: GameEvents;

    public constructor() {
        super(Family.all(ShieldComponent).get());
    }

    protected override processEntity(entity: Entity, deltaTime: number) {
        const ltc = entity.require(ShieldComponent);
        ltc.lifeTime -= deltaTime;
        if (ltc.lifeTime <= 0) {
            entity.remove(ShieldComponent);
            this.gameEvents.shieldDropped.emit(entity);
            this.gameEvents.setStateSpriteVisible.emit(entity, "shield", false);
        }
    }
}

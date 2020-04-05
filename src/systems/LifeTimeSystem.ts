/**
 * License: zlib/libpng
 * @author Santo Pfingsten
 * @see https://github.com/Lusito/typed-asteroids
 */

import { Engine, IteratingSystem, Family, Entity } from "typed-ecstasy";

import { GameEvents } from "../GameEvents";
import { LifeTimeComponent } from "../Components";

export class LifeTimeSystem extends IteratingSystem {
    gameEvents: GameEvents | null = null;

    constructor() {
        super(Family.all(LifeTimeComponent).get());
    }

    protected addedToEngine(engine: Engine) {
        super.addedToEngine(engine);
        this.gameEvents = engine.lookup.get(GameEvents);
    }

    protected removedFromEngine(engine: Engine) {
        super.removedFromEngine(engine);
        this.gameEvents = null;
    }

    protected processEntity(entity: Entity, deltaTime: number) {
        if (!this.gameEvents) return;
        const ltc = entity.get(LifeTimeComponent);
        if (ltc) {
            ltc.lifeTime -= deltaTime;
            if (ltc.lifeTime <= 0) this.gameEvents.death.emit(entity);
        }
    }
}

/**
 * License: zlib/libpng
 * @author Santo Pfingsten
 * @see https://github.com/Lusito/typed-asteroids
 */

import { Engine, IteratingSystem, Family, Entity } from "typed-ecstasy";

import { GameEvents } from "../GameEvents";
import { ShieldComponent } from "../components";

export class ShieldSystem extends IteratingSystem {
    gameEvents: GameEvents | null = null;

    constructor() {
        super(Family.all(ShieldComponent).get());
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
        const ltc = entity.get(ShieldComponent);
        if (ltc) {
            ltc.lifeTime -= deltaTime;
            if (ltc.lifeTime <= 0) {
                entity.remove(ShieldComponent);
                this.gameEvents.shieldDropped.emit(entity);
                this.gameEvents.setStateSpriteVisible.emit(entity, "shield", false);
            }
        }
    }
}

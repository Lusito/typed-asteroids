/**
 * License: zlib/libpng
 * @author Santo Pfingsten
 * @see https://github.com/Lusito/typed-asteroids
 */

import { GameEvents } from "../GameEvents";
import { Engine, IteratingSystem, Family, Entity } from "typed-ecstasy";
import { ShieldComponent } from "../Components";

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

    protected processEntity(entity: Entity, deltaTime: number): void {
        if (!this.gameEvents)
            return;
        let ltc = entity.get(ShieldComponent);
        if (ltc) {
            ltc.lifeTime -= deltaTime;
            if (ltc.lifeTime <= 0) {
                entity.remove(ShieldComponent);
                this.gameEvents.shieldDropped.emit(entity);
                this.gameEvents.setStateSpriteVisible.emit(entity, 'shield', false);
            }
        }
    }
}

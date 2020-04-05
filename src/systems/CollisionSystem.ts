/**
 * License: zlib/libpng
 * @author Santo Pfingsten
 * @see https://github.com/Lusito/typed-asteroids
 */

import { Entity, Engine, Family, IteratingSystem } from "typed-ecstasy";

import { PhysicsComponent, PositionComponent, ShieldComponent, PowerupComponent } from "../Components";
import { Vec2 } from "../Vec2";
import { GameEvents } from "../GameEvents";

export class CollisionSystem extends IteratingSystem {
    gameEvents: GameEvents | null = null;

    constructor() {
        super(Family.all(PositionComponent, PhysicsComponent).exclude(ShieldComponent).get());
    }

    protected addedToEngine(engine: Engine) {
        super.addedToEngine(engine);
        this.gameEvents = engine.lookup.get(GameEvents);
    }

    protected removedFromEngine(engine: Engine) {
        super.removedFromEngine(engine);
        this.gameEvents = null;
    }

    protected processEntity(entity: Entity) {
        if (!this.gameEvents) return;
        const phc = entity.get(PhysicsComponent);
        const pc = entity.get(PositionComponent);
        if (!phc || !pc || !phc.collidesWith.length) return;
        const entities = this.getEntities();
        for (const other of entities) {
            if (other === entity) continue;
            let collided = false;
            const otherPc = other.get(PositionComponent);
            const otherPhc = other.get(PhysicsComponent);
            if (!otherPhc || !otherPc || !phc.collidesWith.includes(otherPhc.group)) continue;
            for (const pos of pc.positions) {
                if (this.testCollision(pos, phc.radius, otherPc, otherPhc)) {
                    collided = true;
                    break;
                }
            }
            if (collided) {
                if (other.has(PowerupComponent)) this.gameEvents.powerupPickup.emit(entity, other);
                else this.gameEvents.death.emit(entity);
                this.gameEvents.death.emit(other);
                return;
            }
        }
    }

    private testCollision(pos: Vec2, radius: number, otherPc: PositionComponent, otherPhc: PhysicsComponent) {
        const maxDist = radius + otherPhc.radius;
        for (const otherPos of otherPc.positions) {
            if (otherPos.distanceTo(pos) < maxDist) return true;
        }
        return false;
    }
}

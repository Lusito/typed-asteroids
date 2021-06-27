import { Entity, Family, IteratingSystem } from "typed-ecstasy";
import { Inject, Service } from "typedi";

import { Vec2 } from "../Vec2";
import { GameEvents } from "../services/GameEvents";
import { PositionComponent } from "../components/PositionComponent";
import { PhysicsComponent } from "../components/PhysicsComponent";
import { ShieldComponent } from "../components/ShieldComponent";
import { PowerupComponent } from "../components/PowerupComponent";

@Service()
export class CollisionSystem extends IteratingSystem {
    @Inject()
    private readonly gameEvents!: GameEvents;

    public constructor() {
        super(Family.all(PositionComponent, PhysicsComponent).exclude(ShieldComponent).get());
    }

    protected override processEntity(entity: Entity) {
        const phc = entity.require(PhysicsComponent);
        const pc = entity.require(PositionComponent);
        if (!phc.collidesWith.length) return;
        const entities = this.getEntities();
        for (const other of entities) {
            if (other === entity) continue;
            let collided = false;
            const otherPc = other.require(PositionComponent);
            const otherPhc = other.require(PhysicsComponent);
            if (!phc.collidesWith.includes(otherPhc.group)) continue;
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

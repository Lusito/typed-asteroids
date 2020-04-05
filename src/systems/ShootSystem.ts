/**
 * License: zlib/libpng
 * @author Santo Pfingsten
 * @see https://github.com/Lusito/typed-asteroids
 */

import { Entity, Family, Engine, EntitySystem } from "typed-ecstasy";
import { InputComponent, PositionComponent, VelocityComponent, PhysicsComponent } from "../Components";
import { GameEvents } from "../GameEvents";
import { SignalConnection } from "typed-signals";
import { Vec2 } from "../Vec2";

export class ShootSystem extends EntitySystem {
    players: Entity[] | null = null;
    private gameEvents: GameEvents | null = null;
    private shootConnection?: SignalConnection;
    private dir = new Vec2();
    private origin = new Vec2();
    private overrides = {
        Position: { x: 0, y: 0, rotation: 0 },
        Velocity: { x: 0, y: 0 }
    };
    constructor() { super(); }

    public update(deltaTime: number) { }

    protected addedToEngine(engine: Engine) {
        super.addedToEngine(engine);

        this.players = engine.getEntitiesFor(Family.all(InputComponent, PositionComponent, VelocityComponent).get());
        this.gameEvents = engine.lookup.get(GameEvents);
        if (this.gameEvents)
            this.shootConnection = this.gameEvents.shoot.connect(this.shoot.bind(this));
    }

    protected removedFromEngine(engine: Engine) {
        super.removedFromEngine(engine);
        this.gameEvents = null;
        this.players = null;
        if (this.shootConnection) {
            this.shootConnection.disconnect();
            delete this.shootConnection;
        }
    }

    private shoot() {
        if (!this.gameEvents || !this.shoot || !this.players || !this.players.length)
            return;
        let entity = this.players[0];
        let pc = entity.get(PositionComponent);
        let vc = entity.get(VelocityComponent);
        if (pc && vc) {
            let phc = entity.get(PhysicsComponent);
            let radius = phc ? phc.radius : 5;
            //Fixme:
            let velocity = 400;
            this.dir.setAngle(pc.rotation - 90);
            this.origin.setFrom(pc.position).add(this.dir.scale(radius * 0.75));
            this.dir.setLength(velocity);
            this.dir.add(vc.dir);
            this.overrides.Position.x = pc.position.x;
            this.overrides.Position.y = pc.position.y;
            this.overrides.Position.rotation = pc.rotation;
            this.overrides.Velocity.x = this.dir.x;
            this.overrides.Velocity.y = this.dir.y;
            this.gameEvents.spawnEntity.emit("blast", this.overrides);
        }
    }
}

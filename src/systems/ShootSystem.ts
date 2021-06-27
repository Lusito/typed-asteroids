import { Entity, Family, EntitySystem } from "typed-ecstasy";
import { SignalConnections } from "typed-signals";
import { Inject, Service } from "typedi";

import { InputComponent } from "../components/InputComponent";
import { PhysicsComponent } from "../components/PhysicsComponent";
import { PositionComponent } from "../components/PositionComponent";
import { VelocityComponent } from "../components/VelocityComponent";
import { GameEvents } from "../services/GameEvents";
import { Vec2 } from "../Vec2";

const SHOT_VELOCITY = 400;

@Service()
export class ShootSystem extends EntitySystem {
    @Inject()
    private readonly gameEvents!: GameEvents;

    private players!: Entity[];

    private readonly connections = new SignalConnections();

    private readonly dir = new Vec2();

    private readonly origin = new Vec2();

    private overrides = {
        Position: { x: 0, y: 0, rotation: 0 },
        Velocity: { x: 0, y: 0 },
    };

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    public update() {}

    protected override onEnable() {
        this.players = this.engine.entities.forFamily(
            Family.all(InputComponent, PositionComponent, VelocityComponent).get()
        );
        this.connections.add(this.gameEvents.shoot.connect(this.shoot.bind(this)));
    }

    protected override onDisable() {
        this.connections.disconnectAll();
    }

    private shoot() {
        if (!this.players.length) return;
        const entity = this.players[0];
        const pc = entity.require(PositionComponent);
        const vc = entity.require(VelocityComponent);
        const phc = entity.get(PhysicsComponent);
        const radius = phc ? phc.radius : 5;
        this.dir.setAngle(pc.rotation - 90);
        this.origin.setFrom(pc.position).add(this.dir.scale(radius * 0.75));
        this.dir.setLength(SHOT_VELOCITY);
        this.dir.add(vc.dir);
        this.overrides.Position.x = pc.position.x;
        this.overrides.Position.y = pc.position.y;
        this.overrides.Position.rotation = pc.rotation;
        this.overrides.Velocity.x = this.dir.x;
        this.overrides.Velocity.y = this.dir.y;
        this.gameEvents.spawnEntity.emit("blast", this.overrides);
    }
}

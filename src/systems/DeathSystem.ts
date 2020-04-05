/**
 * License: zlib/libpng
 * @author Santo Pfingsten
 * @see https://github.com/Lusito/typed-asteroids
 */

import { Engine, Entity, EntitySystem } from "typed-ecstasy";
import { SignalConnection } from "typed-signals";

import { GameEvents } from "../GameEvents";
import {
    DeathSpawnsComponent,
    PositionComponent,
    PhysicsComponent,
    PlayerComponent,
    SoundsComponent,
    ShieldComponent,
    VelocityComponent,
    SpriteComponent,
} from "../Components";
import { GameData } from "../GameData";
import { getSound } from "../loader";

export class DeathSystem extends EntitySystem {
    gameData: GameData | null = null;

    gameEvents: GameEvents | null = null;

    deathConnection?: SignalConnection;

    public constructor(priority = 0) {
        super(priority);
    }

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    public update() {}

    protected addedToEngine(engine: Engine) {
        super.addedToEngine(engine);
        this.gameEvents = engine.lookup.get(GameEvents);
        if (this.gameEvents) this.deathConnection = this.gameEvents.death.connect(this.killEntity.bind(this));
        this.gameData = engine.lookup.get(GameData);
    }

    protected removedFromEngine(engine: Engine) {
        super.removedFromEngine(engine);
        if (this.deathConnection) {
            this.deathConnection.disconnect();
            delete this.deathConnection;
        }
        this.gameData = null;
    }

    private killEntity(entity: Entity) {
        const pc = entity.get(PositionComponent);
        const dsc = entity.get(DeathSpawnsComponent);
        if (pc && dsc && this.gameEvents) {
            const phc = entity.get(PhysicsComponent);
            const radius = phc ? phc.radius : 5;
            this.gameEvents.spawnRandomEntities.emit({
                classname: dsc.entity,
                origin: pc.position,
                count: dsc.countMin, // fixme: random
                minDist: radius * 0.15,
                maxDist: radius * 0.35,
                minSpeed: 50,
                maxSpeed: 100,
                maxRot: 60,
                spreadPct: 0.35,
                radial: true,
                alignAngle: true,
            });
        }
        const plc = entity.get(PlayerComponent);
        const sc = entity.get(SoundsComponent);
        if (plc && this.gameData && this.gameEvents) {
            this.gameData.lifes--;
            if (this.gameData.lifes > 0) {
                const shieldComponent = entity.add(new ShieldComponent());
                shieldComponent.lifeTime = plc.spawnProtection;
                this.gameEvents.setStateSpriteVisible.emit(entity, "shield", true);
                if (sc?.spawn) sc.spawn.play();
                if (pc) {
                    pc.position.set(400, 300);
                    pc.rotation = 0;
                }
                const vc = entity.get(VelocityComponent);
                if (vc) {
                    vc.dir.zero();
                    vc.rotation = 0;
                }
                const spc = entity.get(SpriteComponent);
                if (spc) spc.popTime = spc.popTimeFull;
                return;
            }
            if (this.gameEvents) {
                getSound("lost").play();
                this.gameEvents.showCenterText.emit("You lost all your lifes, try again.", -1);
            }
        }
        if (sc?.die) sc.die.play();
        entity.destroy();
    }
}

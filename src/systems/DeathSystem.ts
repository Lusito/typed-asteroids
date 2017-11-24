/**
 * License: zlib/libpng
 * @author Santo Pfingsten
 * @see https://github.com/Lusito/typed-asteroids
 */

import { GameEvents } from "../GameEvents";
import { Engine, Entity, EntitySystem } from "typed-ecstasy";
import { SignalConnection } from "typed-signals";
import { DeathSpawnsComponent, PositionComponent, PhysicsComponent, PlayerComponent, SoundsComponent, ShieldComponent, VelocityComponent, SpriteComponent } from "../Components";
import { GameData } from "../GameData";

export class DeathSystem extends EntitySystem {
    gameData: GameData | null;
    gameEvents: GameEvents | null;
    deathConnection?: SignalConnection;
    public constructor(priority: number = 0) {
        super(priority);
    }

    public update(deltaTime: number) { }

    protected addedToEngine(engine: Engine) {
        super.addedToEngine(engine);
        this.gameEvents = engine.lookup.get(GameEvents);
        if (this.gameEvents)
            this.deathConnection = this.gameEvents.death.connect(this.killEntity.bind(this));
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
        let pc = entity.get(PositionComponent);
        let dsc = entity.get(DeathSpawnsComponent);
        if (pc && dsc && this.gameEvents) {
            let phc = entity.get(PhysicsComponent);
            let radius = phc ? phc.radius : 5;
            this.gameEvents.spawnRandomEntities.emit({
                classname: dsc.entity,
                origin: pc.position,
                count: dsc.countMin, //fixme: random
                minDist: radius * 0.15,
                maxDist: radius * 0.35,
                minSpeed: 50,
                maxSpeed: 100,
                maxRot: 60,
                spreadPct: 0.35,
                radial: true,
                alignAngle: true
            });
        }
        let plc = entity.get(PlayerComponent);
        let sc = entity.get(SoundsComponent);
        if (plc && this.gameData && this.gameEvents) {
            this.gameData.lifes--;
            if (this.gameData.lifes > 0) {
                plc.spawnProtection = plc.spawnProtection;
                let shieldComponent = entity.add(new ShieldComponent());
                shieldComponent.lifeTime = plc.spawnProtection;
                this.gameEvents.setStateSpriteVisible.emit(entity, 'shield', true);
                if (sc && sc.spawn)
                    sc.spawn.play();
                if (pc) {
                    pc.position.set(400, 300);
                    pc.rotation = 0;
                }
                let vc = entity.get(VelocityComponent);
                if (vc) {
                    vc.dir.zero();
                    vc.rotation = 0;
                }
                let spc = entity.get(SpriteComponent);
                if (spc)
                    spc.popTime = spc.popTimeFull;
                return;
            } else if (this.gameEvents) {
                (<any>PIXI.loader.resources.lost).sound.play();
                this.gameEvents.showCenterText.emit("You lost all your lifes, try again.", -1);
            }
        }
        if (sc && sc.die)
            sc.die.play();
        entity.destroy();
    }
}

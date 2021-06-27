import { Allocator, Entity, EntitySystem } from "typed-ecstasy";
import { SignalConnections } from "typed-signals";
import { Inject, Service } from "typedi";

import { GameEvents } from "../services/GameEvents";
import { GameData } from "../services/GameData";
import { PositionComponent } from "../components/PositionComponent";
import { DeathSpawnsComponent } from "../components/DeathSpawnsComponent";
import { PhysicsComponent } from "../components/PhysicsComponent";
import { PlayerComponent } from "../components/PlayerComponent";
import { SoundsComponent } from "../components/SoundsComponent";
import { ShieldComponent } from "../components/ShieldComponent";
import { VelocityComponent } from "../components/VelocityComponent";
import { SpriteComponent } from "../components/SpriteComponent";
import { AssetLoader } from "../services/AssetLoader";

@Service()
export class DeathSystem extends EntitySystem {
    @Inject()
    private readonly allocator!: Allocator;

    @Inject()
    private readonly assets!: AssetLoader;

    @Inject()
    private readonly gameData!: GameData;

    @Inject()
    private readonly gameEvents!: GameEvents;

    private readonly connections = new SignalConnections();

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    public override update() {}

    protected override onEnable() {
        this.connections.add(this.gameEvents.death.connect(this.killEntity.bind(this)));
    }

    protected override onDisable() {
        this.connections.disconnectAll();
    }

    private killEntity(entity: Entity) {
        const pc = entity.get(PositionComponent);
        const dsc = entity.get(DeathSpawnsComponent);
        if (pc && dsc) {
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
        if (plc) {
            this.gameData.lifes--;
            if (this.gameData.lifes > 0) {
                const shieldComponent = entity.add(this.allocator.obtainComponent(ShieldComponent));
                shieldComponent.lifeTime = plc.spawnProtection;
                this.gameEvents.setStateSpriteVisible.emit(entity, "shield", true);
                sc?.spawn?.play();
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
            this.assets.getSound("lost").play();
            this.gameEvents.showCenterText.emit("You lost all your lifes, try again.", -1);
        }
        sc?.die?.play();
        entity.destroy();
    }
}

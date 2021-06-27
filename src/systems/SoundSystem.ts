import { SignalConnections } from "typed-signals";
import { Family, EntitySystem } from "typed-ecstasy";
import { Inject, Service } from "typedi";

import { GameEvents } from "../services/GameEvents";
import { GameData } from "../services/GameData";
import { SoundsComponent } from "../components/SoundsComponent";
import { PowerupComponent } from "../components/PowerupComponent";

@Service()
export class SoundSystem extends EntitySystem {
    @Inject()
    private readonly gameEvents!: GameEvents;

    @Inject()
    private readonly gameData!: GameData;

    private readonly connections = new SignalConnections();

    protected override onEnable() {
        this.connections.add(
            this.engine.entities.onAddForFamily(Family.all(SoundsComponent).get()).connect((e) => {
                const c = e.require(SoundsComponent);
                c.spawn?.play();
            })
        );
        this.connections.add(
            this.gameEvents.powerupPickup.connect((player, powerup) => {
                const pc = powerup.get(PowerupComponent);
                if (pc) {
                    this.gameData.lifes = Math.min(5, this.gameData.lifes + pc.extraLifes);
                    const sc = powerup.get(SoundsComponent);
                    sc?.pickup?.play();
                }
            })
        );
    }

    protected override onDisable() {
        this.connections.disconnectAll();
    }

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    public override update() {}
}

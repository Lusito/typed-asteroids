import { Entity, Family, IteratingSystem } from "typed-ecstasy";
import { Key } from "ts-keycode-enum";
import { Inject, Service } from "typedi";

import { Vec2 } from "../Vec2";
import { GameEvents } from "../services/GameEvents";
import { InputComponent } from "../components/InputComponent";
import { PositionComponent } from "../components/PositionComponent";
import { VelocityComponent } from "../components/VelocityComponent";
import { PlayerComponent } from "../components/PlayerComponent";

@Service()
export class InputSystem extends IteratingSystem {
    private readonly keys = new Array(256);

    private readonly dir = new Vec2();

    @Inject()
    private readonly gameEvents!: GameEvents;

    public constructor() {
        super(Family.all(InputComponent, PositionComponent, VelocityComponent, PlayerComponent).get());
    }

    public onKeyDown(e: KeyboardEvent) {
        if (e.keyCode === Key.Space && !this.keys[Key.Space]) this.gameEvents.shoot.emit();
        if (e.keyCode < this.keys.length) this.keys[e.keyCode] = true;
    }

    public onKeyUp(e: KeyboardEvent) {
        if (e.keyCode < this.keys.length) this.keys[e.keyCode] = false;
    }

    protected override processEntity(entity: Entity, deltaTime: number) {
        const pc = entity.require(PositionComponent);
        const plc = entity.require(PlayerComponent);
        const vc = entity.require(VelocityComponent);
        let accelScale = 0;
        let turnScale = 0;
        if (this.keys[Key.RightArrow]) turnScale += 1;
        if (this.keys[Key.LeftArrow]) turnScale -= 1;
        if (this.keys[Key.UpArrow]) accelScale += 1;
        if (this.keys[Key.DownArrow]) accelScale -= 1;
        if (accelScale < 0) {
            turnScale *= 0.6;
            accelScale *= 0.3;
        }

        this.gameEvents.setStateSpriteVisible.emit(entity, "turn_left", turnScale < 0);
        this.gameEvents.setStateSpriteVisible.emit(entity, "turn_right", turnScale > 0);
        this.gameEvents.setStateSpriteVisible.emit(entity, "thrust", accelScale > 0);
        this.gameEvents.setStateSpriteVisible.emit(entity, "reverse", accelScale < 0);

        if (turnScale) pc.rotation += turnScale * 200.0 * deltaTime;
        if (accelScale) {
            this.dir.setAngle(pc.rotation - 90).scale(plc.acceleration * accelScale * deltaTime);
            vc.dir.add(this.dir).capLength(plc.maxSpeed);
        }
    }
}

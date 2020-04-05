/**
 * License: zlib/libpng
 * @author Santo Pfingsten
 * @see https://github.com/Lusito/typed-asteroids
 */

import { Entity, Family, IteratingSystem, Engine } from "typed-ecstasy";
import { Key } from "ts-keycode-enum";

import { InputComponent, PositionComponent, VelocityComponent, PlayerComponent } from "../components";
import { Vec2 } from "../Vec2";
import { GameEvents } from "../GameEvents";

export class InputSystem extends IteratingSystem {
    private readonly keys = new Array(256);

    private readonly dir = new Vec2();

    private gameEvents: GameEvents | null = null;

    constructor() {
        super(Family.all(InputComponent, PositionComponent, VelocityComponent, PlayerComponent).get());
    }

    public onKeyDown(e: KeyboardEvent) {
        if (e.keyCode === Key.Space && this.gameEvents && !this.keys[Key.Space]) this.gameEvents.shoot.emit();
        if (e.keyCode < this.keys.length) this.keys[e.keyCode] = true;
    }

    public onKeyUp(e: KeyboardEvent) {
        if (e.keyCode < this.keys.length) this.keys[e.keyCode] = false;
    }

    protected addedToEngine(engine: Engine) {
        super.addedToEngine(engine);
        this.gameEvents = engine.lookup.get(GameEvents);
    }

    protected removedFromEngine(engine: Engine) {
        super.removedFromEngine(engine);
        this.gameEvents = null;
    }

    protected processEntity(entity: Entity, deltaTime: number) {
        const pc = entity.get(PositionComponent);
        const plc = entity.get(PlayerComponent);
        const vc = entity.get(VelocityComponent);
        if (!pc || !vc || !plc || !this.gameEvents) return;
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

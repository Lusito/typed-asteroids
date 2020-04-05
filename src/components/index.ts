import { ComponentFactory } from "typed-ecstasy";

import { playerComponentFactory } from "./PlayerComponent";
import { positionComponentFactory } from "./PositionComponent";
import { velocityComponentFactory } from "./VelocityComponent";
import { inputComponentFactory } from "./InputComponent";
import { spriteComponentFactory } from "./SpriteComponent";
import { powerupComponentFactory } from "./PowerupComponent";
import { physicsComponentFactory } from "./PhysicsComponent";
import { deathSpawnsComponentFactory } from "./DeathSpawnsComponent";
import { shieldComponentFactory } from "./ShieldComponent";
import { lifeTimeComponentFactory } from "./LifeTimeComponent";
import { soundsComponentFactory } from "./SoundsComponent";

export { PlayerComponent } from "./PlayerComponent";
export { PositionComponent } from "./PositionComponent";
export { VelocityComponent } from "./VelocityComponent";
export { InputComponent } from "./InputComponent";
export { SpriteComponent } from "./SpriteComponent";
export { PowerupComponent } from "./PowerupComponent";
export { PhysicsComponent } from "./PhysicsComponent";
export { DeathSpawnsComponent } from "./DeathSpawnsComponent";
export { ShieldComponent } from "./ShieldComponent";
export { LifeTimeComponent } from "./LifeTimeComponent";
export { SoundsComponent } from "./SoundsComponent";

export const componentFactories: { [e: string]: ComponentFactory } = {
    Player: playerComponentFactory,
    Position: positionComponentFactory,
    Velocity: velocityComponentFactory,
    Input: inputComponentFactory,
    Sprite: spriteComponentFactory,
    Powerup: powerupComponentFactory,
    Physics: physicsComponentFactory,
    DeathSpawns: deathSpawnsComponentFactory,
    Shield: shieldComponentFactory,
    LifeTime: lifeTimeComponentFactory,
    Sounds: soundsComponentFactory,
};

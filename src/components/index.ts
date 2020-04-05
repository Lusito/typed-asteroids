import { Constructor, ComponentFactory } from "typed-ecstasy";

import { PlayerComponentFactory } from "./PlayerComponentFactory";
import { PositionComponentFactory } from "./PositionComponentFactory";
import { VelocityComponentFactory } from "./VelocityComponentFactory";
import { InputComponentFactory } from "./InputComponentFactory";
import { SpriteComponentFactory } from "./SpriteComponentFactory";
import { PowerupComponentFactory } from "./PowerupComponentFactory";
import { PhysicsComponentFactory } from "./PhysicsComponentFactory";
import { DeathSpawnsComponentFactory } from "./DeathSpawnsComponentFactory";
import { ShieldComponentFactory } from "./ShieldComponentFactory";
import { LifeTimeComponentFactory } from "./LifeTimeComponentFactory";
import { SoundsComponentFactory } from "./SoundsComponentFactory";

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

export const ComponentFactories: { [e: string]: Constructor<ComponentFactory> } = {
    Player: PlayerComponentFactory,
    Position: PositionComponentFactory,
    Velocity: VelocityComponentFactory,
    Input: InputComponentFactory,
    Sprite: SpriteComponentFactory,
    Powerup: PowerupComponentFactory,
    Physics: PhysicsComponentFactory,
    DeathSpawns: DeathSpawnsComponentFactory,
    Shield: ShieldComponentFactory,
    LifeTime: LifeTimeComponentFactory,
    Sounds: SoundsComponentFactory,
};

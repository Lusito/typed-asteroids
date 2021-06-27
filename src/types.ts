import { AssetLoader } from "./services/AssetLoader";
import { DeathSpawnsConfig } from "./components/DeathSpawnsComponent";
import { InputConfig } from "./components/InputComponent";
import { LifeTimeConfig } from "./components/LifeTimeComponent";
import { PhysicsConfig } from "./components/PhysicsComponent";
import { PlayerConfig } from "./components/PlayerComponent";
import { PositionConfig } from "./components/PositionComponent";
import { PowerupConfig } from "./components/PowerupComponent";
import { ShieldConfig } from "./components/ShieldComponent";
import { SoundsConfig } from "./components/SoundsComponent";
import { SpriteConfig } from "./components/SpriteComponent";
import { VelocityConfig } from "./components/VelocityComponent";

export type AsteroidsEntityConfig = {
    Player?: PlayerConfig;
    Position?: PositionConfig;
    Velocity?: VelocityConfig;
    Input?: InputConfig;
    Sprite?: SpriteConfig;
    Powerup?: PowerupConfig;
    Physics?: PhysicsConfig;
    DeathSpawns?: DeathSpawnsConfig;
    Shield?: ShieldConfig;
    LifeTime?: LifeTimeConfig;
    Sounds?: SoundsConfig;
};

export type AsteroidsContext = {
    assets: AssetLoader;
};

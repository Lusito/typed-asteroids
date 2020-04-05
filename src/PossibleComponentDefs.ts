interface PlayerDef {
    type: "Player";
    acceleration: number;
    maxSpeed: number;
    spawnProtection: number;
    spawnProtectionFade: number;
}

interface PositionDef {
    type: "Position";
    x?: number;
    y?: number;
    rotation?: number;
}

interface VelocityDef {
    type: "Velocity";
    x?: number;
    y?: number;
    rotation?: number;
}

export interface SpriteStateDef {
    name: string;
    texture: string;
}

interface SpriteDef {
    type: "Sprite";
    states: SpriteStateDef[];
    layer: "big_asteroids" | "medium_asteroids" | "small_asteroids" | "powerups" | "blasts" | "splitter" | "player";
    scale?: number;
    popTime?: number; // default: 0.5?
    // Fixme: fadeOutTime, fadeOutDelay?
}

interface InputDef {
    type: "Input";
}

interface PowerupDef {
    type: "Powerup";
    extraLifes?: number;
}

interface PhysicsDef {
    type: "Physics";
    radius: number;
    group: string;
    collidesWith?: string;
}

interface DeathSpawnsDef {
    type: "DeathSpawns";
    entity: string;
    countMin: number;
    countMax: number;
    speedMin: number;
    speedMax: number;
}

interface ShieldDef {
    type: "Shield";
    lifeTime: number;
}

interface LifeTimeDef {
    type: "LifeTime";
    lifeTime: number;
}

interface SoundsDef {
    type: "Sounds";
    spawn?: string;
    die?: string;
    pickup?: string;
}

export type PossibleComponentDefs =
    | never
    | PlayerDef
    | PositionDef
    | VelocityDef
    | SpriteDef
    | InputDef
    | PowerupDef
    | PhysicsDef
    | DeathSpawnsDef
    | ShieldDef
    | LifeTimeDef
    | SoundsDef;

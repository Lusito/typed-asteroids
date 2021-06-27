import type { AsteroidsEntityConfig } from "../types";

export const asteroidBigBlueprint: AsteroidsEntityConfig = {
    Position: {},
    Velocity: {},
    Sprite: {
        states: [{ name: "base", texture: "big" }],
        layer: "big_asteroids",
        popTime: 0.2,
    },
    DeathSpawns: {
        entity: "asteroid_medium",
        countMin: 3,
        countMax: 3,
        speedMin: 10,
        speedMax: 10,
    },
    Physics: {
        radius: 60,
        group: "asteroid",
    },
    Sounds: {
        die: "explode_big",
    },
};

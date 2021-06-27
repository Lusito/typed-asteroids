import type { AsteroidsEntityConfig } from "../types";

export const playerBlueprint: AsteroidsEntityConfig = {
    Position: {},
    Velocity: {},
    Sprite: {
        states: [
            { name: "base", texture: "spaceship" },
            { name: "thrust", texture: "image_thrust" },
            { name: "reverse", texture: "image_reverse" },
            { name: "turn_left", texture: "image_left" },
            { name: "turn_right", texture: "image_right" },
            { name: "shield", texture: "image_shield" },
        ],
        layer: "player",
        scale: 0.55,
    },
    Input: {},
    DeathSpawns: {
        entity: "ship_splitter",
        countMin: 8,
        countMax: 8,
        speedMin: 10,
        speedMax: 10,
    },
    Physics: {
        radius: 25,
        group: "player",
        collidesWith: ["asteroid", "powerup"],
    },
    Sounds: {
        spawn: "snd_teleport",
        die: "explode_small",
    },
    Shield: {
        lifeTime: 5,
    },
    Player: {
        acceleration: 200,
        maxSpeed: 600,
        spawnProtection: 2, // 2 sec spawn protection ( shield )
        spawnProtectionFade: 0.3, // 300ms fading time ( only visual )
    },
};

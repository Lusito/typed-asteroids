/**
 * License: zlib/libpng
 * @author Santo Pfingsten
 * @see https://github.com/Lusito/typed-asteroids
 */

import { PossibleComponentDefs } from "./PossibleComponentDefs";

export const player: PossibleComponentDefs[] = [
    {
        type: "Position",
        x: 0,
        y: 0,
    },
    {
        type: "Velocity",
        x: 0,
        y: 0,
    },
    {
        type: "Sprite",
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
    {
        type: "Input",
    },
    {
        type: "DeathSpawns",
        entity: "ship_splitter",
        countMin: 8,
        countMax: 8,
        speedMin: 10,
        speedMax: 10,
    },
    {
        type: "Physics",
        radius: 25,
        group: "player",
        collidesWith: "asteroid,powerup",
    },
    {
        type: "Sounds",
        spawn: "snd_teleport",
        die: "explode_small",
    },
    {
        type: "Shield",
        lifeTime: 5,
    },
    {
        type: "Player",
        acceleration: 200,
        maxSpeed: 600,
        spawnProtection: 2, // 2 sec spawn protection ( shield )
        spawnProtectionFade: 0.3, // 300ms fading time ( only visual )
    },
];

export const ship_splitter: PossibleComponentDefs[] = [
    {
        type: "Position",
        x: 0,
        y: 0,
    },
    {
        type: "Velocity",
        x: 0,
        y: 0,
    },
    {
        type: "Sprite",
        states: [{ name: "base", texture: "particle" }],
        layer: "splitter",
        scale: 0.38,
    },
    {
        type: "LifeTime",
        lifeTime: 0.3,
    },
    {
        type: "Physics",
        radius: 6,
        group: "player",
    },
];

export const blast: PossibleComponentDefs[] = [
    {
        type: "Position",
        x: 0,
        y: 0,
    },
    {
        type: "Velocity", // 400?
        x: 0,
        y: 0,
    },
    {
        type: "Sprite",
        states: [{ name: "base", texture: "blast" }],
        layer: "blasts",
        scale: 0.48,
        popTime: 0,
    },
    {
        type: "LifeTime",
        lifeTime: 1,
    },
    {
        type: "Physics",
        radius: 9,
        group: "blast",
        collidesWith: "asteroid",
    },
    {
        type: "Sounds",
        spawn: "snd_shot",
    },
];

export const firework: PossibleComponentDefs[] = [
    {
        type: "Position",
        x: 0,
        y: 0,
    },
    {
        type: "Velocity",
        x: 0,
        y: 0,
    },
    {
        type: "Sprite",
        states: [{ name: "base", texture: "particle" }],
        layer: "splitter",
        popTime: 0.5,
        scale: 0.3,
    },
    {
        type: "DeathSpawns",
        entity: "firework_splitter",
        countMin: 8,
        countMax: 8,
        speedMin: 30,
        speedMax: 40,
    },
    {
        type: "LifeTime",
        lifeTime: 1, // will be random
    },
];

export const firework_splitter: PossibleComponentDefs[] = [
    {
        type: "Position",
        x: 0,
        y: 0,
    },
    {
        type: "Velocity",
        x: 0,
        y: 0,
    },
    {
        type: "Sprite",
        states: [{ name: "base", texture: "particle" }],
        layer: "splitter",
        popTime: 1,
        scale: 0.6,
    },
    {
        type: "LifeTime",
        lifeTime: 1,
    },
];

export const asteroid_big: PossibleComponentDefs[] = [
    {
        type: "Position",
        x: 0,
        y: 0,
    },
    {
        type: "Velocity",
        x: 0,
        y: 0,
    },
    {
        type: "Sprite",
        states: [{ name: "base", texture: "big" }],
        layer: "big_asteroids",
        popTime: 0.2,
    },
    {
        type: "DeathSpawns",
        entity: "asteroid_medium",
        countMin: 3,
        countMax: 3,
        speedMin: 10,
        speedMax: 10,
    },
    {
        type: "Physics",
        radius: 60,
        group: "asteroid",
    },
    {
        type: "Sounds",
        die: "explode_big",
    },
];

export const asteroid_medium: PossibleComponentDefs[] = [
    {
        type: "Position",
        x: 0,
        y: 0,
    },
    {
        type: "Velocity",
        x: 0,
        y: 0,
    },
    {
        type: "Sprite",
        states: [{ name: "base", texture: "medium" }],
        layer: "medium_asteroids",
        scale: 0.75,
        popTime: 0.2,
    },
    {
        type: "DeathSpawns",
        entity: "asteroid_small",
        countMin: 3,
        countMax: 3,
        speedMin: 10,
        speedMax: 10,
    },
    {
        type: "Physics",
        radius: 22,
        group: "asteroid",
    },
    {
        type: "Sounds",
        die: "explode_big",
    },
];

export const asteroid_small: PossibleComponentDefs[] = [
    {
        type: "Position",
        x: 0,
        y: 0,
    },
    {
        type: "Velocity",
        x: 0,
        y: 0,
    },
    {
        type: "Sprite",
        states: [{ name: "base", texture: "small" }],
        layer: "small_asteroids",
        scale: 0.75,
        popTime: 0.2,
    },
    {
        type: "DeathSpawns",
        entity: "asteroid_splitter",
        countMin: 6,
        countMax: 6,
        speedMin: 10,
        speedMax: 10,
    },
    {
        type: "Physics",
        radius: 11,
        group: "asteroid",
    },
    {
        type: "Sounds",
        die: "explode_small",
    },
];

export const asteroid_splitter: PossibleComponentDefs[] = [
    {
        type: "Position",
        x: 0,
        y: 0,
    },
    {
        type: "Velocity",
        x: 0,
        y: 0,
    },
    {
        type: "Sprite",
        states: [{ name: "base", texture: "small" }],
        layer: "splitter",
        scale: 0.25,
        popTime: 0,
    },
    {
        type: "LifeTime",
        lifeTime: 0.3,
    },
];

export const item_extralife: PossibleComponentDefs[] = [
    {
        type: "Position",
        x: 0,
        y: 0,
    },
    {
        type: "Velocity",
        x: 0,
        y: 0,
    },
    {
        type: "Sprite",
        states: [{ name: "base", texture: "item_extralife" }],
        layer: "powerups",
        popTime: 0.2,
    },
    {
        type: "LifeTime",
        lifeTime: 10,
    },
    {
        type: "Powerup",
        extraLifes: 1,
    },
    {
        type: "Physics",
        radius: 14,
        group: "powerup",
    },
    {
        type: "Sounds",
        pickup: "item_powerup",
    },
];

import type { AsteroidsEntityConfig } from "../types";

export const shipSplitterBlueprint: AsteroidsEntityConfig = {
    Position: {},
    Velocity: {},
    Sprite: {
        states: [{ name: "base", texture: "particle" }],
        layer: "splitter",
        scale: 0.38,
    },
    LifeTime: {
        lifeTime: 0.3,
    },
    Physics: {
        radius: 6,
        group: "player",
    },
};

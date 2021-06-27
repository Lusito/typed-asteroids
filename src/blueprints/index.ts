import type { AsteroidsEntityConfig } from "../types";
import { asteroidSmallBlueprint } from "./asteriodSmallBlueprint";
import { asteroidBigBlueprint } from "./asteroidBigBlueprint";
import { asteroidMediumBlueprint } from "./asteroidMediumBlueprint";
import { asteroidSplitterBlueprint } from "./asteroidSplitterBlueprint";
import { blastBlueprint } from "./blastBlueprint";
import { extraLifeBlueprint } from "./extraLifeBlueprint";
import { fireworkBlueprint } from "./fireworkBlueprint";
import { fireworkSplitterBlueprint } from "./fireworkSplitterBlueprint";
import { playerBlueprint } from "./playerBlueprint";
import { shipSplitterBlueprint } from "./shipSplitterBlueprint";

export const blueprints: Record<string, AsteroidsEntityConfig> = {
    asteroid_small: asteroidSmallBlueprint,
    asteroid_big: asteroidBigBlueprint,
    asteroid_medium: asteroidMediumBlueprint,
    asteroid_splitter: asteroidSplitterBlueprint,
    blast: blastBlueprint,
    item_extralife: extraLifeBlueprint,
    firework: fireworkBlueprint,
    firework_splitter: fireworkSplitterBlueprint,
    player: playerBlueprint,
    ship_splitter: shipSplitterBlueprint,
};

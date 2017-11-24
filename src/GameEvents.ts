/**
 * License: zlib/libpng
 * @author Santo Pfingsten
 * @see https://github.com/Lusito/typed-asteroids
 */

import { Signal } from "typed-signals";
import { SpawnRandomEntitiesConfig } from "./systems/ItemSpawnSystem";
import { Entity } from "typed-ecstasy";

export class GameEvents {
    public readonly gameWon = new Signal<() => any>();
    public readonly shoot = new Signal<() => any>();
    public readonly spawnEntity = new Signal<(blueprintname: string, overrides?: { [s: string]: { [s: string]: any } }) => void>();
    public readonly spawnRandomEntities = new Signal<(config: SpawnRandomEntitiesConfig) => void>();
    public readonly death = new Signal<(entity: Entity) => void>();
    public readonly powerupPickup = new Signal<(player: Entity, powerup: Entity) => void>();
    public readonly shieldDropped = new Signal<(entity: Entity) => void>();
    public readonly setStateSpriteVisible = new Signal<(entity: Entity, state: string, visible: boolean) => void>();
    public readonly showCenterText = new Signal<(text: string, showTime: number) => void>();

    public readonly startGame = new Signal<(forceRestart: boolean) => any>();
}

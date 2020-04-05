/**
 * License: zlib/libpng
 * @author Santo Pfingsten
 * @see https://github.com/Lusito/typed-asteroids
 */

import { Entity, Family, IteratingSystem, Engine } from "typed-ecstasy";
import { Container } from "pixi.js";

import { SpriteComponent, PositionComponent } from "../components";
import { DEG_TO_RAD } from "../Vec2";
import { StateSpriteContainer } from "../StateSpriteContainer";
import { GameEvents } from "../GameEvents";

export class SpriteSystem extends IteratingSystem {
    private readonly layers: { [e: string]: Container };

    constructor(container: Container) {
        super(Family.all(SpriteComponent, PositionComponent).get());

        this.layers = {
            big_asteroids: container.addChild(new Container()),
            medium_asteroids: container.addChild(new Container()),
            small_asteroids: container.addChild(new Container()),
            powerups: container.addChild(new Container()),
            blasts: container.addChild(new Container()),
            splitter: container.addChild(new Container()),
            player: container.addChild(new Container()),
        };
    }

    protected addedToEngine(engine: Engine) {
        super.addedToEngine(engine);

        const gameEvents = engine.lookup.get(GameEvents);
        if (gameEvents) gameEvents.setStateSpriteVisible.connect(this.setStateSpriteVisible.bind(this));

        engine.getEntityAddedSignal(Family.all(SpriteComponent).get()).connect((e) => {
            const c = e.get(SpriteComponent);
            if (c) {
                const layer = (c.layer && this.layers[c.layer]) || this.layers.big_asteroids;
                for (const sprite of c.sprites) layer.addChild(sprite);
            }
        });
        engine.getEntityRemovedSignal(Family.all(SpriteComponent).get()).connect((e) => {
            const c = e.get(SpriteComponent);
            if (c) {
                const layer = (c.layer && this.layers[c.layer]) || this.layers.big_asteroids;
                for (const sprite of c.sprites) {
                    layer.removeChild(sprite);
                    sprite.destroy();
                }
            }
        });
    }

    protected removedFromEngine(engine: Engine) {
        super.removedFromEngine(engine);
    }

    protected processEntity(entity: Entity, deltaTime: number) {
        const sc = entity.get(SpriteComponent);
        const pc = entity.get(PositionComponent);
        if (!sc || !pc) return;
        if (sc.popTime > 0) {
            sc.popTime -= deltaTime;
            if (sc.popTime < 0) sc.popTime = 0;
            const scale = sc.scale * (sc.popTimeFull === 0 ? 1 : 1 - sc.popTime / sc.popTimeFull);
            for (let i = 0; i < 4; i++) sc.sprites[i].scale.set(scale);
        }
        for (let i = 0; i < 4; i++) {
            const p = pc.positions[i];
            this.updateSprite(sc.sprites[i], p.x, p.y, pc.rotation);
        }
    }

    private updateSprite(sprite: StateSpriteContainer, x: number, y: number, rotation: number) {
        sprite.x = x;
        sprite.y = y;
        sprite.rotation = rotation * DEG_TO_RAD;
    }

    private setStateSpriteVisible(entity: Entity, state: string, visible: boolean) {
        const sc = entity.get(SpriteComponent);
        if (sc) {
            for (const sprite of sc.sprites) sprite.setVisible(state, visible);
        }
    }
}

import { Entity, Family, IteratingSystem } from "typed-ecstasy";
import { Container } from "pixi.js";
import { Inject, Service } from "typedi";
import { SignalConnections } from "typed-signals";

import { DEG_TO_RAD } from "../Vec2";
import { StateSpriteContainer } from "../StateSpriteContainer";
import { GameEvents } from "../services/GameEvents";
import { SpriteComponent } from "../components/SpriteComponent";
import { PositionComponent } from "../components/PositionComponent";

@Service()
export class SpriteSystem extends IteratingSystem {
    @Inject()
    private readonly gameEvents!: GameEvents;

    public readonly container = new Container();

    private layers!: { [e: string]: Container };

    private readonly connections = new SignalConnections();

    public constructor() {
        super(Family.all(SpriteComponent, PositionComponent).get());

        const { container } = this;
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

    protected override onEnable() {
        super.onEnable();
        this.connections.add(this.gameEvents.setStateSpriteVisible.connect(this.setStateSpriteVisible.bind(this)));

        this.engine.entities.onAddForFamily(Family.all(SpriteComponent).get()).connect((e) => {
            const c = e.require(SpriteComponent);
            const layer = (c.layer && this.layers[c.layer]) || this.layers.big_asteroids;
            for (const sprite of c.sprites) layer.addChild(sprite);
        });
        this.engine.entities.onRemoveForFamily(Family.all(SpriteComponent).get()).connect((e) => {
            const c = e.require(SpriteComponent);
            const layer = (c.layer && this.layers[c.layer]) || this.layers.big_asteroids;
            for (const sprite of c.sprites) {
                layer.removeChild(sprite);
                sprite.destroy();
            }
        });
    }

    protected override onDisable() {
        super.onDisable();
        this.connections.disconnectAll();
    }

    protected override processEntity(entity: Entity, deltaTime: number) {
        const sc = entity.require(SpriteComponent);
        const pc = entity.require(PositionComponent);
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

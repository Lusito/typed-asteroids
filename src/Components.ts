/* eslint-disable max-classes-per-file */
/**
 * License: zlib/libpng
 * @author Santo Pfingsten
 * @see https://github.com/Lusito/typed-asteroids
 */

import { Component, ComponentFactory, ComponentBlueprint, Constructor, Entity } from "typed-ecstasy";
import { Sprite } from "pixi.js";
import pixiSound from "pixi-sound";

import { Vec2 } from "./Vec2";
import { StateSpriteContainer } from "./StateSpriteContainer";
import { SpriteStateDef } from "./PossibleComponentDefs";
import { getTexture, getSound } from "./loader";

export class PlayerComponent extends Component {
    acceleration = 0;

    maxSpeed = 0;

    spawnProtection = 0;

    spawnProtectionFade = 0;
}

export class PlayerComponentFactory extends ComponentFactory {
    public assemble(entity: Entity, blueprint: ComponentBlueprint) {
        const comp = entity.add(new PlayerComponent());
        comp.acceleration = blueprint.getNumber("acceleration", 100);
        comp.maxSpeed = blueprint.getNumber("maxSpeed", 200);
        comp.spawnProtection = blueprint.getNumber("spawnProtection", 1);
        comp.spawnProtectionFade = blueprint.getNumber("spawnProtectionFade", 1);
        return true;
    }
}

export class PositionComponent extends Component {
    position = new Vec2();

    rotation = 0.0;

    positions: Vec2[];

    public constructor() {
        super();
        this.positions = [new Vec2(), new Vec2(), new Vec2(), new Vec2()];
    }
}

export class PositionComponentFactory extends ComponentFactory {
    public assemble(entity: Entity, blueprint: ComponentBlueprint) {
        const comp = new PositionComponent();
        comp.position.set(blueprint.getNumber("x", 0), blueprint.getNumber("y", 0));
        comp.rotation = blueprint.getNumber("rotation", 0);
        entity.add(comp);
        return true;
    }
}

export class VelocityComponent extends Component {
    dir = new Vec2();

    rotation = 0.0;
}

export class VelocityComponentFactory extends ComponentFactory {
    public assemble(entity: Entity, blueprint: ComponentBlueprint) {
        const comp = new VelocityComponent();
        comp.dir.set(blueprint.getNumber("x", 0), blueprint.getNumber("y", 0));
        comp.rotation = blueprint.getNumber("rotation", 0);
        entity.add(comp);
        return true;
    }
}

export class InputComponent extends Component {}

export class InputComponentFactory extends ComponentFactory {
    public assemble(entity: Entity) {
        entity.add(new InputComponent());
        return true;
    }
}

export class SpriteComponent extends Component {
    sprites: StateSpriteContainer[] = [];

    layer = "";

    popTime = 0;

    popTimeFull = 0;

    scale = 1;
}

export class SpriteComponentFactory extends ComponentFactory {
    public assemble(entity: Entity, blueprint: ComponentBlueprint) {
        const comp = new SpriteComponent();
        comp.layer = blueprint.getString("layer", "");
        const states: SpriteStateDef[] = blueprint.getAny("states", []);
        comp.scale = blueprint.getNumber("scale", 1);
        comp.popTime = blueprint.getNumber("popTime", 0.5);
        comp.popTimeFull = comp.popTime;
        for (let i = 0; i < 4; i++) {
            const container = new StateSpriteContainer();
            for (const state of states) {
                const sprite = new Sprite(getTexture(state.texture));
                sprite.anchor.set(0.5);
                container.addState(state.name, sprite);
            }
            container.scale.set(comp.popTime ? 0 : comp.scale);
            comp.sprites.push(container);
        }
        entity.add(comp);
        return true;
    }
}

export class PowerupComponent extends Component {
    extraLifes = 0;
}

export class PowerupComponentFactory extends ComponentFactory {
    public assemble(entity: Entity, blueprint: ComponentBlueprint) {
        const comp = entity.add(new PowerupComponent());
        comp.extraLifes = blueprint.getNumber("extraLifes", 1);
        return true;
    }
}

export class PhysicsComponent extends Component {
    radius = 0;

    group = "";

    collidesWith: string[] = [];
}

export class PhysicsComponentFactory extends ComponentFactory {
    public assemble(entity: Entity, blueprint: ComponentBlueprint) {
        const comp = entity.add(new PhysicsComponent());
        comp.radius = blueprint.getNumber("radius", 0);
        comp.group = blueprint.getString("group", "");
        comp.collidesWith = blueprint.getString("collidesWith", "").split(",");
        return true;
    }
}

export class DeathSpawnsComponent extends Component {
    entity = "";

    countMin = 0;

    countMax = 0;

    speedMin = 0;

    speedMax = 0;
}

export class DeathSpawnsComponentFactory extends ComponentFactory {
    public assemble(entity: Entity, blueprint: ComponentBlueprint) {
        const comp = entity.add(new DeathSpawnsComponent());
        comp.entity = blueprint.getString("entity", "");
        comp.countMin = blueprint.getNumber("countMin", 0);
        comp.countMax = blueprint.getNumber("countMax", 0);
        comp.speedMin = blueprint.getNumber("speedMin", 0);
        comp.speedMax = blueprint.getNumber("speedMax", 0);
        return true;
    }
}

export class ShieldComponent extends Component {
    lifeTime = 0;
}

export class ShieldComponentFactory extends ComponentFactory {
    public assemble(entity: Entity, blueprint: ComponentBlueprint) {
        const comp = entity.add(new ShieldComponent());
        comp.lifeTime = blueprint.getNumber("lifeTime", 0);
        return true;
    }
}

export class LifeTimeComponent extends Component {
    lifeTime = 0;
}

export class LifeTimeComponentFactory extends ComponentFactory {
    public assemble(entity: Entity, blueprint: ComponentBlueprint) {
        const comp = entity.add(new LifeTimeComponent());
        comp.lifeTime = blueprint.getNumber("lifeTime", 0);
        return true;
    }
}

export class SoundsComponent extends Component {
    spawn?: pixiSound.Sound;

    die?: pixiSound.Sound;

    pickup?: pixiSound.Sound;
}

export class SoundsComponentFactory extends ComponentFactory {
    public assemble(entity: Entity, blueprint: ComponentBlueprint) {
        const comp = entity.add(new SoundsComponent());
        let key = blueprint.getString("spawn", "");
        if (key) comp.spawn = getSound(key);
        key = blueprint.getString("die", "");
        if (key) comp.die = getSound(key);
        key = blueprint.getString("pickup", "");
        if (key) comp.pickup = getSound(key);
        return true;
    }
}

export const ComponentFactories: { [e: string]: Constructor<ComponentFactory> } = {
    Player: PlayerComponentFactory,
    Position: PositionComponentFactory,
    Velocity: VelocityComponentFactory,
    Input: InputComponentFactory,
    Sprite: SpriteComponentFactory,
    Powerup: PowerupComponentFactory,
    Physics: PhysicsComponentFactory,
    DeathSpawns: DeathSpawnsComponentFactory,
    Shield: ShieldComponentFactory,
    LifeTime: LifeTimeComponentFactory,
    Sounds: SoundsComponentFactory,
};

import { SignalConnections } from "typed-signals";
import { Family, Entity, EntitySystem, Allocator } from "typed-ecstasy";
import { Inject, Service } from "typedi";

import { Vec2 } from "../Vec2";
import { GameEvents } from "../services/GameEvents";
import { GameData } from "../services/GameData";
import { PlayerComponent } from "../components/PlayerComponent";
import { LifeTimeComponent } from "../components/LifeTimeComponent";
import { PositionComponent } from "../components/PositionComponent";
import { PhysicsComponent } from "../components/PhysicsComponent";
import { ShieldComponent } from "../components/ShieldComponent";
import { AsteroidsEntityFactory } from "../services/AsteroidsEntityFactory";
import { AssetLoader } from "../services/AssetLoader";

const levelAsteroidCounts = [
    [2, 3, 4],
    [3, 4, 6],
    [3, 6, 10],
    [4, 10, 15],
    [5, 14, 20],
];

export type SpawnRandomEntitiesConfig = {
    classname: string;
    origin: Vec2;
    count: number;
    minDist: number;
    maxDist: number;
    minSpeed: number;
    maxSpeed: number;
    maxRot: number;
    spreadPct: number;
    radial: boolean;
    alignAngle: boolean;
};

const screenCenter = new Vec2(400, 300);

@Service()
export class ItemSpawnSystem extends EntitySystem {
    @Inject()
    private readonly allocator!: Allocator;

    @Inject()
    private readonly entityFactory!: AsteroidsEntityFactory;

    @Inject()
    private readonly gameEvents!: GameEvents;

    @Inject()
    private readonly gameData!: GameData;

    @Inject()
    private readonly assets!: AssetLoader;

    private readonly connections = new SignalConnections();

    private nextExtraLife = -1;

    private respawnPlayer = 0.1;

    private players!: Entity[];

    private enemies!: Entity[];

    protected override onEnable() {
        this.connections.add(this.gameEvents.spawnEntity.connect(this.spawnEntity.bind(this)));
        this.connections.add(this.gameEvents.spawnRandomEntities.connect(this.spawnRandomEntities.bind(this)));
        this.connections.add(
            this.gameEvents.startGame.connect((forceRestart: boolean) => {
                if (!this.gameData.playing || forceRestart) this.restart();
            })
        );
        this.players = this.engine.entities.forFamily(
            Family.all(PlayerComponent, PositionComponent, PhysicsComponent).get()
        );
        this.enemies = this.engine.entities.forFamily(Family.exclude(PlayerComponent, LifeTimeComponent).get());
    }

    protected override onDisable() {
        this.connections.disconnectAll();
    }

    private restart() {
        this.respawnPlayer = 0.1;
        this.gameData.reset();
        this.gameData.playing = true;
        this.engine.entities.removeAll();
        this.nextExtraLife = 5 + Math.random() * 10;
    }

    public override update(deltaTime: number) {
        if (!this.gameData.playing) {
            if (this.enemies.length === 0) this.respawnAsteroids(screenCenter, 25, 3);
        } else if (this.gameData.lifes > 0) {
            if (this.players.length === 0) {
                if (this.respawnPlayer <= 0) this.respawnPlayer = 5;
                else {
                    this.respawnPlayer -= deltaTime;
                    if (this.respawnPlayer <= 0) this.spawnEntity("player", { Position: { x: 400, y: 300 } });
                }
            } else if (this.enemies.length === 0) {
                if (this.gameData.level >= levelAsteroidCounts.length) {
                    this.assets.getSound("win").play();
                    this.gameEvents.gameWon.emit();
                    this.stop(true);
                    return;
                }
                const player = this.players[0];
                const pc = player.require(PositionComponent);
                const phc = player.require(PhysicsComponent);
                const plc = player.require(PlayerComponent);
                if (!player.has(ShieldComponent)) {
                    player.add(this.allocator.obtainComponent(ShieldComponent)).lifeTime = plc.spawnProtection;
                    this.gameEvents.setStateSpriteVisible.emit(player, "shield", true);
                }
                const origin = pc.position;
                const { radius } = phc;
                this.gameData.level++;
                this.respawnAsteroids(origin, radius, this.gameData.level);
                if (this.gameData.level === 1) this.gameEvents.showCenterText.emit("Get Ready To Rumble!", 2);
                else this.gameEvents.showCenterText.emit(`Level ${this.gameData.level}`, 2);
            } else {
                this.nextExtraLife -= deltaTime;
                if (this.nextExtraLife <= 0) {
                    const player = this.players[0];
                    const pc = player.require(PositionComponent);
                    const origin = pc.position;
                    this.spawnRandomEntities({
                        classname: "item_extralife",
                        origin,
                        count: 1,
                        minDist: 400,
                        maxDist: 600,
                        minSpeed: 10,
                        maxSpeed: 40,
                        maxRot: 0,
                        spreadPct: 1,
                        radial: false,
                        alignAngle: false,
                    });
                    this.nextExtraLife = 20 + Math.random() * 10;
                }
            }
        }
    }

    public stop(spawnFireworks = false) {
        this.engine.entities.removeAll();
        this.gameData.playing = false;
        this.nextExtraLife = 5 + Math.random() * 10;
        if (spawnFireworks) {
            const radius = 50;
            this.spawnRandomEntities(
                {
                    classname: "firework",
                    origin: screenCenter,
                    count: 50,
                    minDist: radius + 100,
                    maxDist: radius + 300,
                    minSpeed: 50,
                    maxSpeed: 100,
                    maxRot: 0,
                    spreadPct: 0.7,
                    radial: true,
                    alignAngle: true,
                },
                5
            );
        }
    }

    private respawnAsteroids(origin: Vec2, radius: number, level: number) {
        const levelIndex = level - 1;
        this.spawnRandomEntities({
            classname: "asteroid_big",
            origin,
            count: levelAsteroidCounts[levelIndex][0],
            minDist: radius + 100,
            maxDist: radius + 400,
            minSpeed: 50,
            maxSpeed: 100,
            maxRot: 30,
            spreadPct: 0.7,
            radial: true,
            alignAngle: false,
        });
        this.spawnRandomEntities({
            classname: "asteroid_medium",
            origin,
            count: levelAsteroidCounts[levelIndex][1],
            minDist: radius + 100,
            maxDist: radius + 300,
            minSpeed: 50,
            maxSpeed: 100,
            maxRot: 50,
            spreadPct: 0.7,
            radial: false,
            alignAngle: false,
        });
        this.spawnRandomEntities({
            classname: "asteroid_small",
            origin,
            count: levelAsteroidCounts[levelIndex][2],
            minDist: radius + 100,
            maxDist: radius + 200,
            minSpeed: 50,
            maxSpeed: 100,
            maxRot: 60,
            spreadPct: 0.7,
            radial: false,
            alignAngle: false,
        });
    }

    public spawnEntity(blueprintname: string, overrides?: { [s: string]: { [s: string]: any } }) {
        const entity = this.entityFactory.assemble(blueprintname, overrides);
        if (entity) this.engine.entities.add(entity);
    }

    private spawnRandomEntities(config: SpawnRandomEntitiesConfig, randomLife?: number) {
        const angleStep = 360 / config.count;
        const spreadAngle = angleStep * config.spreadPct;
        let angle = this.randomFloat(0, 360);
        const overrides: any = {
            Position: { x: 0, y: 0, rotation: 0 },
            Velocity: { x: 0, y: 0, rotation: 0 },
        };
        if (randomLife) {
            overrides.LifeTime = {
                lifeTime: 0,
            };
        }
        const dir = new Vec2();
        const scaledDir = new Vec2();
        const origin = new Vec2();
        for (let i = 0; i < config.count; i++, angle += angleStep) {
            dir.setAngle(this.randomFloat(angle - spreadAngle, angle + spreadAngle));
            origin
                .setFrom(config.origin)
                .add(scaledDir.setFrom(dir).scale(this.randomFloat(config.minDist, config.maxDist)));
            overrides.Position.x = origin.x;
            overrides.Position.y = origin.y;
            overrides.Position.rotation = config.alignAngle ? angle : 0;
            if (!config.radial) dir.setAngle(this.randomFloat(0, 360));
            dir.scale(this.randomFloat(config.minSpeed, config.maxSpeed));
            overrides.Velocity.x = dir.x;
            overrides.Velocity.y = dir.y;
            overrides.Velocity.rotation = this.randomFloat(-config.maxRot, config.maxRot);
            if (randomLife) overrides.LifeTime.lifeTime = this.randomFloat(0.1, randomLife);
            this.spawnEntity(config.classname, overrides);
        }
    }

    private randomFloat(min: number, max: number) {
        return min + Math.random() * (max - min);
    }
}

/**
 * License: zlib/libpng
 * @author Santo Pfingsten
 * @see https://github.com/Lusito/typed-asteroids
 */

import { Vec2 } from "../Vec2";
import { GameEvents } from "../GameEvents";
import { SignalConnections } from "typed-signals";
import { Engine, Family, Entity, EntitySystem } from "typed-ecstasy";
import { PlayerComponent, LifeTimeComponent, PositionComponent, PhysicsComponent, ShieldComponent } from "../Components";
import { GameData } from "../GameData";

const levelAsteroidCounts = [
	[2, 3, 4],
	[3, 4, 6],
	[3, 6, 10],
	[4, 10, 15],
	[5, 14, 20]
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

export class ItemSpawnSystem extends EntitySystem {
	nextExtraLife: number = -1;
	gameEvents: GameEvents | null;
	gameData: GameData | null;
	respawnPlayer = 0.1;
	players: Entity[] | null;
	enemies: Entity[] | null;
	private readonly connections = new SignalConnections();

	public constructor() {
		super();
	}

	protected addedToEngine(engine: Engine) {
		super.addedToEngine(engine);
		this.gameEvents = engine.lookup.get(GameEvents);
		if (this.gameEvents) {
			this.connections.add(this.gameEvents.spawnEntity.connect(this.spawnEntity.bind(this)));
			this.connections.add(this.gameEvents.spawnRandomEntities.connect(this.spawnRandomEntities.bind(this)));
		}
		this.gameData = engine.lookup.get(GameData);
		this.players = engine.getEntitiesFor(Family.all(PlayerComponent).get());
		this.enemies = engine.getEntitiesFor(Family.exclude(PlayerComponent, LifeTimeComponent).get());
	}

	protected removedFromEngine(engine: Engine) {
		super.removedFromEngine(engine);
		this.connections.disconnectAll();
		this.gameEvents = null;
		this.gameData = null;
		this.players = null;
		this.enemies = null;
	}

	public restart() {
		let engine = this.getEngine();
		if (!this.gameData || !engine)
			return;
		this.respawnPlayer = 0.1;
		this.gameData.reset();
		this.gameData.playing = true;
		engine.removeAllEntities();
		this.nextExtraLife = 5 + Math.random() * 10;
	}

	public update(deltaTime: number): void {
		if (!this.gameData || !this.gameEvents)
			return;
		if (!this.gameData.playing) {
			if (this.enemies && this.enemies.length === 0)
				this.respawnAsteroids(screenCenter, 25, 3);
		} else if (this.gameData.lifes > 0 && this.players) {
			if (this.players.length === 0) {
				if (this.respawnPlayer <= 0)
					this.respawnPlayer = 5;
				else {
					this.respawnPlayer -= deltaTime;
					if (this.respawnPlayer <= 0)
						this.spawnEntity("player", { Position: { x: 400, y: 300 } });
				}
			} else if (this.enemies && this.enemies.length === 0) {
				if (this.gameData.level >= levelAsteroidCounts.length) {
					(<any>PIXI.loader.resources.win).sound.play();
					this.gameEvents.gameWon.emit();
					this.stop(true);
					return;
				}
				let player = this.players[0];
				let pc = player.get(PositionComponent);
				let phc = player.get(PhysicsComponent);
				let plc = player.get(PlayerComponent);
				if (!pc || !phc || !plc)
					return;
				if (!player.has(ShieldComponent)) {
					player.add(new ShieldComponent()).lifeTime = plc.spawnProtection;
					this.gameEvents.setStateSpriteVisible.emit(player, 'shield', true);
				}
				let origin = pc.position;
				let radius = phc.radius;
				this.gameData.level++;
				this.respawnAsteroids(origin, radius, this.gameData.level);
				if (this.gameData.level === 1)
					this.gameEvents.showCenterText.emit('Get Ready To Rumble!', 2);
				else
					this.gameEvents.showCenterText.emit('Level ' + this.gameData.level, 2);
			} else {
				this.nextExtraLife -= deltaTime;
				if (this.nextExtraLife <= 0) {
					let player = this.players[0];
					let pc = player.get(PositionComponent);
					if (!pc)
						return;
					let origin = pc.position;
					this.spawnRandomEntities({
						classname: "item_extralife",
						origin: origin,
						count: 1,
						minDist: 400,
						maxDist: 600,
						minSpeed: 10,
						maxSpeed: 40,
						maxRot: 0,
						spreadPct: 1,
						radial: false,
						alignAngle: false
					});
					this.nextExtraLife = 20 + Math.random() * 10;
				}
			}
		}
	}

	public stop(spawnFireworks: boolean = false) {
		let engine = this.getEngine();
		if (this.gameData && engine) {
			engine.removeAllEntities();
			this.gameData.playing = false;
			this.nextExtraLife = 5 + Math.random() * 10;
			if (spawnFireworks) {
				let radius = 50;
				this.spawnRandomEntities({
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
					alignAngle: true
				}, 5);
			}
		}
	}

	private respawnAsteroids(origin: Vec2, radius: number, level: number): void {
		let levelIndex = level - 1;
		this.spawnRandomEntities({
			classname: "asteroid_big",
			origin: origin,
			count: levelAsteroidCounts[levelIndex][0],
			minDist: radius + 100,
			maxDist: radius + 400,
			minSpeed: 50,
			maxSpeed: 100,
			maxRot: 30,
			spreadPct: 0.7,
			radial: true,
			alignAngle: false
		});
		this.spawnRandomEntities({
			classname: "asteroid_medium",
			origin: origin,
			count: levelAsteroidCounts[levelIndex][1],
			minDist: radius + 100,
			maxDist: radius + 300,
			minSpeed: 50,
			maxSpeed: 100,
			maxRot: 50,
			spreadPct: 0.7,
			radial: false,
			alignAngle: false
		});
		this.spawnRandomEntities({
			classname: "asteroid_small",
			origin: origin,
			count: levelAsteroidCounts[levelIndex][2],
			minDist: radius + 100,
			maxDist: radius + 200,
			minSpeed: 50,
			maxSpeed: 100,
			maxRot: 60,
			spreadPct: 0.7,
			radial: false,
			alignAngle: false
		});
	}

	public spawnEntity(blueprintname: string, overrides?: { [s: string]: { [s: string]: any } }) {
		let engine = this.getEngine();
		if (engine) {
			let entity = engine.assembleEntity(blueprintname, overrides);
			if (entity)
				engine.addEntity(entity);
		}
	}

	private spawnRandomEntities(config: SpawnRandomEntitiesConfig, randomLife?: number) {
		let angleStep = 360 / config.count;
		let spreadAngle = angleStep * config.spreadPct;
		let angle = this.randomFloat(0, 360);
		let overrides: any = {
			Position: { x: 0, y: 0, rotation: 0 },
			Velocity: { x: 0, y: 0, rotation: 0 }
		};
		if (randomLife) {
			overrides.LifeTime = {
				lifeTime: 0
			};
		}
		let dir = new Vec2();
		let scaledDir = new Vec2();
		let origin = new Vec2();
		for (let i = 0; i < config.count; i++ , angle += angleStep) {
			dir.setAngle(this.randomFloat(angle - spreadAngle, angle + spreadAngle));
			origin.setFrom(config.origin).add(scaledDir.setFrom(dir).scale(this.randomFloat(config.minDist, config.maxDist)));
			overrides.Position.x = origin.x;
			overrides.Position.y = origin.y;
			overrides.Position.rotation = config.alignAngle ? angle : 0;
			if (!config.radial)
				dir.setAngle(this.randomFloat(0, 360));
			dir.scale(this.randomFloat(config.minSpeed, config.maxSpeed));
			overrides.Velocity.x = dir.x;
			overrides.Velocity.y = dir.y;
			overrides.Velocity.rotation = this.randomFloat(-config.maxRot, config.maxRot);
			if (randomLife)
				overrides.LifeTime.lifeTime = this.randomFloat(0.1, randomLife);
			this.spawnEntity(config.classname, overrides);
		}
	}

	private randomFloat(min: number, max: number) {
		return min + Math.random() * (max - min);
	}
}

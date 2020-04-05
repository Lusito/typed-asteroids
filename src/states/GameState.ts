/**
 * License: zlib/libpng
 * @author Santo Pfingsten
 * @see https://github.com/Lusito/typed-asteroids
 */

import { BaseState } from "./BaseState";
import { StateManager } from "./StateManager";
import { Engine, Family, EntityFactory, EntityBlueprint, ComponentBlueprint } from "typed-ecstasy";
import { SpriteSystem } from "../systems/SpriteSystem";
import { InputSystem } from "../systems/InputSystem";
import { MovementSystem } from "../systems/MovementSystem";
import { ItemSpawnSystem } from "../systems/ItemSpawnSystem";
import { PossibleComponentDefs } from "../PossibleComponentDefs";
import { ComponentFactories } from "../Components";
import * as Blueprints from "../Blueprints";
import { Sprite } from "pixi.js";

import { SoundsComponent, PowerupComponent } from "../Components";
import { GameEvents } from "../GameEvents";
import { ShootSystem } from "../systems/ShootSystem";
import { LifeTimeSystem } from "../systems/LifeTimeSystem";
import { DeathSystem } from "../systems/DeathSystem";
import { CollisionSystem } from "../systems/CollisionSystem";
import { ShieldSystem } from "../systems/ShieldSystem";
import { Key } from "ts-keycode-enum";
import { HudSystem } from "../systems/HudSystem";
import { GameData } from "../GameData";
import pixiSound from "pixi-sound";
import { isVisible, onVisibilityChange } from "../Visibility";
import { MainMenu } from "../menu/MainMenu";
import * as Music from "../Music";
import { MenuManager } from "../menu/MenuManager";
import { getSound, getTexture } from "../loader";

export class GameState extends BaseState {
    private menuManager: MenuManager;
    private gameEvents: GameEvents;
    private hudSystem?: HudSystem;
    private itemSpawnSystem?: ItemSpawnSystem;
    private inputSystem?: InputSystem;
    private entityFactory?: EntityFactory;
    private gameData: GameData;
    private mainMenu: MainMenu;
    private engine: Engine;
    protected readonly sounds: { [s: string]: pixiSound.Sound } = {
        menu_open: getSound("menu_open"),
        menu_close: getSound("menu_close")
    };

    public constructor(manager: StateManager) {
        super(manager);
        Music.fadeTo('ambience');

        this.container.addChild(new Sprite(getTexture("background")));
        this.container.alpha = 0;

        this.engine = new Engine();
        //Fixme: move to system
        this.engine.getEntityAddedSignal(Family.all(SoundsComponent).get()).connect((e) => {
            let c = e.get(SoundsComponent);
            if (c && c.spawn)
                c.spawn.play();
        });

        this.setupEntityFactory();

        // Add game data, events and Systems
        this.gameEvents = this.engine.lookup.put(GameEvents, new GameEvents());
        this.gameData = this.engine.lookup.put(GameData, new GameData());
        this.addSystems();


        this.gameEvents.powerupPickup.connect((player, powerup) => {
            let pc = powerup.get(PowerupComponent);
            if (pc) {
                this.gameData.lifes = Math.min(5, this.gameData.lifes + pc.extraLifes);
                let sc = powerup.get(SoundsComponent);
                if (sc && sc.pickup)
                    sc.pickup.play();
            }
        });

        // Main menu:
        this.gameEvents.startGame.connect((forceRestart: boolean) => {
            if (!this.gameData.playing || forceRestart) {
                this.itemSpawnSystem!.restart();
                this.hudSystem!.showCenterText("", 0);
            }
            this.menuManager.popAllPages();
            this.hudSystem!.setVisible(true);
        });
        this.gameEvents.gameWon.connect(() => {
            this.menuManager.popAllPages();
            this.menuManager.pushPage(this.mainMenu);
            this.hudSystem!.setVisible(false);
            this.mainMenu.showCredits();
        });
        this.menuManager = new MenuManager(this.container);
        this.mainMenu = new MainMenu(this.menuManager, this.gameEvents);
        this.menuManager.emptyPop.connect(() => {
            if (!this.gameData.playing)
                this.menuManager.pushPage(this.mainMenu);
            else
                this.sounds.menu_close.play();
        });

        // Key Handling
        //fixme: addEventListener
        window.onkeyup = this.onKeyUp.bind(this);
        window.onkeydown = this.onKeyDown.bind(this);

        this.registerVisibleChange();
        this.showMenu(false);
    }

    private onKeyUp(e: KeyboardEvent) {
        if (this.menuManager.isVisible())
            this.menuManager.onKeyUp(e);
        else if (e.keyCode !== Key.Escape)
            this.inputSystem!.onKeyUp(e);
    }

    private onKeyDown(e: KeyboardEvent) {
        if (this.menuManager.isVisible())
            this.menuManager.onKeyDown(e);
        else if (e.keyCode === Key.Escape) {
            this.showMenu();
        } else if (e.keyCode === Key.Enter && this.gameData.lifes === 0)
            this.gameEvents.startGame.emit(true);
        else
            this.inputSystem!.onKeyDown(e);
    }

    private showMenu(playSound = true) {
        if (playSound)
            this.sounds.menu_open.play();

        if (this.gameData.lifes === 0)
            this.itemSpawnSystem!.stop();
        this.menuManager.pushPage(this.mainMenu);
        this.hudSystem!.setVisible(false);
    }

    private registerVisibleChange() {
        if (!isVisible())
            pixiSound.muteAll();
        onVisibilityChange((visible) => {
            if (visible)
                pixiSound.unmuteAll();
            else {
                pixiSound.muteAll();
                if (!this.menuManager.isVisible())
                    this.showMenu();
            }
        });
    }

    private addSystems() {
        this.engine.addSystem(new SpriteSystem(this.container));
        this.inputSystem = this.engine.addSystem(new InputSystem());
        this.engine.addSystem(new MovementSystem());
        this.itemSpawnSystem = this.engine.addSystem(new ItemSpawnSystem());
        this.engine.addSystem(new ShootSystem());
        this.engine.addSystem(new LifeTimeSystem());
        this.engine.addSystem(new DeathSystem());
        this.engine.addSystem(new CollisionSystem());
        this.engine.addSystem(new ShieldSystem());
        this.hudSystem = this.engine.addSystem(new HudSystem(this.container));
    }

    private setupEntityFactory(): void {
        this.entityFactory = new EntityFactory();
        // Setup component factories
        for (let e in ComponentFactories) {
            this.entityFactory.addComponentFactory(e, new ComponentFactories[e]());
        }
        this.engine.setEntityFactory(this.entityFactory);

        for (let e in Blueprints)
            this.addEntityBlueprint(e, (<{ [e: string]: any }>Blueprints)[e]);
    }

    private addEntityBlueprint(name: string, componentDefs: PossibleComponentDefs[]) {
        let entityBlueprint = new EntityBlueprint();

        for (let componentDef of componentDefs) {
            let cb = new ComponentBlueprint(componentDef.type);
            for (let ckey in componentDef) {
                cb.set(ckey, (<any>componentDef)[ckey]);
            }
            entityBlueprint.add(cb);
        }
        this.entityFactory!.addEntityBlueprint(name, entityBlueprint);
    }

    public update(deltaTime: number) {
        if (this.container.alpha < 1) {
            this.container.alpha += deltaTime;
            if (this.container.alpha > 1)
                this.container.alpha = 1;
        }

        this.menuManager.update(deltaTime);
        if (!this.menuManager.isVisible() || !this.gameData.playing)
            this.engine.update(deltaTime);
    }
}

import { Engine } from "typed-ecstasy";
import { Key } from "ts-keycode-enum";
import pixiSound from "pixi-sound";
import Container from "typedi";

import { BaseState } from "./BaseState";
import { StateManager } from "./StateManager";
import { SpriteSystem } from "../systems/SpriteSystem";
import { InputSystem } from "../systems/InputSystem";
import { MovementSystem } from "../systems/MovementSystem";
import { ItemSpawnSystem } from "../systems/ItemSpawnSystem";
import { GameEvents } from "../services/GameEvents";
import { ShootSystem } from "../systems/ShootSystem";
import { LifeTimeSystem } from "../systems/LifeTimeSystem";
import { DeathSystem } from "../systems/DeathSystem";
import { CollisionSystem } from "../systems/CollisionSystem";
import { ShieldSystem } from "../systems/ShieldSystem";
import { HudSystem } from "../systems/HudSystem";
import { GameData } from "../services/GameData";
import { VisibilityService } from "../services/VisibilityService";
import { MainMenu } from "../menu/MainMenu";
import { MenuManager } from "../menu/MenuManager";
import { AssetLoader } from "../services/AssetLoader";
import { MusicService } from "../services/MusicService";
import { SoundSystem } from "../systems/SoundSystem";

export class GameState extends BaseState {
    private menuManager!: MenuManager;

    private gameEvents: GameEvents;

    private hudSystem!: HudSystem;

    private itemSpawnSystem!: ItemSpawnSystem;

    private inputSystem!: InputSystem;

    private gameData: GameData;

    private mainMenu!: MainMenu;

    private engine = new Engine();

    protected readonly sounds: { [s: string]: pixiSound.Sound } = {};

    public constructor(manager: StateManager) {
        super(manager);
        const di = this.engine.getContainer();
        const assets = di.get(AssetLoader);
        this.sounds.menu_open = assets.getSound("menu_open");
        this.sounds.menu_close = assets.getSound("menu_close");

        // Get game data, events
        this.gameEvents = di.get(GameEvents);
        this.gameData = di.get(GameData);

        di.get(MusicService).fadeTo("ambience");

        this.container.addChild(assets.createSprite("background"));
        this.container.alpha = 0;

        this.addSystems();
        this.setupMainMenu();
        this.registerKeyListeners();
        this.registerVisibleChange();
        this.showMenu(false);
    }

    private registerKeyListeners() {
        window.onkeyup = this.onKeyUp.bind(this);
        window.onkeydown = this.onKeyDown.bind(this);
    }

    private setupMainMenu() {
        this.gameEvents.startGame.connect(() => this.menuManager.popAllPages());
        this.gameEvents.gameWon.connect(() => {
            this.menuManager.popAllPages();
            this.menuManager.pushPage(this.mainMenu);
            this.mainMenu.showCredits();
        });
        const di = this.engine.getContainer();
        this.menuManager = di.get(MenuManager);
        this.container.addChild(this.menuManager.container);
        this.mainMenu = di.get(MainMenu);
        this.menuManager.emptyPop.connect(() => {
            if (!this.gameData.playing) this.menuManager.pushPage(this.mainMenu);
            else this.sounds.menu_close.play();
        });
    }

    private onKeyUp(e: KeyboardEvent) {
        if (this.menuManager.isVisible()) this.menuManager.onKeyUp(e);
        else if (e.keyCode !== Key.Escape) this.inputSystem.onKeyUp(e);
    }

    private onKeyDown(e: KeyboardEvent) {
        if (this.menuManager.isVisible()) this.menuManager.onKeyDown(e);
        else if (e.keyCode === Key.Escape) {
            this.showMenu();
        } else if (e.keyCode === Key.Enter && this.gameData.lifes === 0) this.gameEvents.startGame.emit(true);
        else this.inputSystem.onKeyDown(e);
    }

    private showMenu(playSound = true) {
        if (playSound) this.sounds.menu_open.play();

        if (this.gameData.lifes === 0) this.itemSpawnSystem.stop();
        this.menuManager.pushPage(this.mainMenu);
        this.hudSystem.setVisible(false);
    }

    private registerVisibleChange() {
        Container.get(VisibilityService).onChange((visible) => {
            if (!visible && !this.menuManager.isVisible()) this.showMenu();
        });
    }

    private addSystems() {
        const spriteSystem = this.engine.systems.add(SpriteSystem);
        this.container.addChild(spriteSystem.container);
        this.inputSystem = this.engine.systems.add(InputSystem);
        this.engine.systems.add(MovementSystem);
        this.itemSpawnSystem = this.engine.systems.add(ItemSpawnSystem);
        this.engine.systems.add(ShootSystem);
        this.engine.systems.add(LifeTimeSystem);
        this.engine.systems.add(DeathSystem);
        this.engine.systems.add(CollisionSystem);
        this.engine.systems.add(ShieldSystem);
        this.hudSystem = this.engine.systems.add(HudSystem);
        this.container.addChild(this.hudSystem.container);
        this.engine.systems.add(SoundSystem);
    }

    public override update(deltaTime: number) {
        if (this.container.alpha < 1) {
            this.container.alpha += deltaTime;
            if (this.container.alpha > 1) this.container.alpha = 1;
        }

        this.menuManager.update(deltaTime);
        if (!this.menuManager.isVisible() || !this.gameData.playing) this.engine.update(deltaTime);
    }
}

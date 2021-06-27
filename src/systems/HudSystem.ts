import { EntitySystem } from "typed-ecstasy";
import { Text, Sprite, Container } from "pixi.js";
import { Inject, Service } from "typedi";
import { SignalConnections } from "typed-signals";

import { GameEvents } from "../services/GameEvents";
import { GameData } from "../services/GameData";
import { AssetLoader } from "../services/AssetLoader";

const CENTER_TEXT_STYLE = {
    fontSize: 36,
    fontFamily: "Arial",
    fill: "#FFFFFF",
    align: "center",
    stroke: "#000000",
    strokeThickness: 3,
};
const LEVEL_TEXT_STYLE = {
    fontSize: 24,
    fontFamily: "Arial",
    fill: "#FFFFFF",
    align: "right",
    stroke: "#000000",
    strokeThickness: 3,
};

@Service()
export class HudSystem extends EntitySystem {
    @Inject()
    private readonly gameData!: GameData;

    @Inject()
    private readonly gameEvents!: GameEvents;

    public readonly container = new Container();

    private readonly connections = new SignalConnections();

    private hudContainer: Container | null = null;

    private centerShowTime = 0;

    private readonly centerText = new Text("", CENTER_TEXT_STYLE);

    private readonly levelText = new Text("Level: 1", LEVEL_TEXT_STYLE);

    private level = 0;

    private readonly lifeSprites: Sprite[] = [];
    // hud: life top left, level top right
    // messages all centered

    public constructor(assets: AssetLoader) {
        super();

        const { container } = this;
        this.hudContainer = container.addChild(new Container());
        this.hudContainer.visible = false;
        this.hudContainer.addChild(this.centerText);
        this.centerText.x = 400;
        this.centerText.y = 300;
        this.centerText.anchor.set(0.5);
        this.hudContainer.addChild(this.levelText);
        this.levelText.anchor.set(1, 0);
        this.levelText.x = 800;
        this.levelText.y = 0;
        const lifeTexture = assets.getTexture("item_extralife");
        for (let i = 0; i < 5; i++) {
            const sprite = new Sprite(lifeTexture);
            this.lifeSprites.push(this.hudContainer.addChild(sprite));
            sprite.x = i * (sprite.getBounds().width + 5);
            sprite.y = 0;
        }
    }

    public setVisible(visible: boolean) {
        if (this.hudContainer) this.hudContainer.visible = visible;
    }

    protected override onEnable() {
        this.connections.add(this.gameEvents.showCenterText.connect(this.showCenterText.bind(this)));

        this.connections.add(
            this.gameEvents.startGame.connect((forceRestart: boolean) => {
                if (!this.gameData.playing || forceRestart) {
                    this.showCenterText("", 0);
                }
                this.setVisible(true);
            })
        );
        this.connections.add(this.gameEvents.gameWon.connect(() => this.setVisible(false)));
    }

    protected override onDisable() {
        this.connections.disconnectAll();
    }

    public override update(deltaTime: number) {
        for (let i = 0; i < 5; i++) {
            const sprite = this.lifeSprites[i];
            sprite.alpha = i < this.gameData.lifes ? 1 : 0.3;
        }
        if (this.level !== this.gameData.level) {
            this.level = this.gameData.level;
            this.levelText.text = `Level: ${this.level}`;
        }
        if (this.centerShowTime > 0) {
            this.centerShowTime -= deltaTime;
            if (this.centerShowTime < 0) this.centerShowTime = 0;
            if (this.centerShowTime < 0.7) this.centerText.alpha = this.centerShowTime;
        }
    }

    public showCenterText(text: string, showTime: number) {
        this.centerShowTime = showTime;
        this.centerText.text = text;
        this.centerText.alpha = 0.7;
    }
}

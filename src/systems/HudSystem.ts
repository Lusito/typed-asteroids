import { Engine, EntitySystem } from "typed-ecstasy";
import { Text, Sprite, Container } from "pixi.js";

import { GameEvents } from "../GameEvents";
import { GameData } from "../GameData";
import { getTexture } from "../loader";

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
export class HudSystem extends EntitySystem {
    hudContainer: Container;

    centerShowTime = 0;

    gameData: GameData | null = null;

    gameEvents: GameEvents | null = null;

    centerText: Text;

    levelText: Text;

    level = 0;

    lifeSprites: Sprite[] = [];
    // hud: life top left, level top right
    // messages all centered

    constructor(container: Container) {
        super();
        this.hudContainer = container.addChild(new Container());
        this.hudContainer.visible = false;
        this.hudContainer.addChild((this.centerText = new Text("", CENTER_TEXT_STYLE)));
        this.centerText.x = 400;
        this.centerText.y = 300;
        this.centerText.anchor.set(0.5);
        this.hudContainer.addChild((this.levelText = new Text("Level: 1", LEVEL_TEXT_STYLE)));
        this.levelText.anchor.set(1, 0);
        this.levelText.x = 800;
        this.levelText.y = 0;
        const lifeTexture = getTexture("item_extralife");
        for (let i = 0; i < 5; i++) {
            const sprite = new Sprite(lifeTexture);
            this.lifeSprites.push(this.hudContainer.addChild(sprite));
            sprite.x = i * (sprite.getBounds().width + 5);
            sprite.y = 0;
        }
    }

    public setVisible(visible: boolean) {
        this.hudContainer.visible = visible;
    }

    protected addedToEngine(engine: Engine) {
        super.addedToEngine(engine);
        this.gameEvents = engine.lookup.get(GameEvents);
        this.gameData = engine.lookup.get(GameData);
        if (this.gameEvents) this.gameEvents.showCenterText.connect(this.showCenterText.bind(this)); // fixme: disconnect
    }

    protected removedFromEngine(engine: Engine) {
        super.removedFromEngine(engine);
        this.gameEvents = null;
        this.gameData = null;
    }

    public update(deltaTime: number) {
        if (!this.gameData) return;
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

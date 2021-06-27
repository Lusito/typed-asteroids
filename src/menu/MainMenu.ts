import { Text } from "pixi.js";
import { Service } from "typedi";

import { MenuPage } from "./MenuPage";
import { GameEvents } from "../services/GameEvents";
import { MenuManager } from "./MenuManager";
import { CreditsMenu } from "./CreditsMenu";
import { AssetLoader } from "../services/AssetLoader";

const TITLE_TEXT_STYLE = {
    fontSize: 36,
    fontFamily: "Arial",
    fill: "#FFFFFF",
    align: "left",
    stroke: "#000000",
    strokeThickness: 3,
};

const HINT_TEXT_STYLE = {
    fontSize: 20,
    fontFamily: "Arial",
    fill: "#AAAAAA",
    align: "center",
    stroke: "#000000",
    strokeThickness: 3,
};

@Service()
export class MainMenu extends MenuPage {
    private readonly creditsMenu: CreditsMenu;

    public constructor(assets: AssetLoader, manager: MenuManager, gameEvents: GameEvents, creditsMenu: CreditsMenu) {
        super(assets, manager);
        this.creditsMenu = creditsMenu;

        const text = this.container.addChild(new Text("Lusito's Asteroids Clone!", TITLE_TEXT_STYLE));
        text.anchor.set(0);
        text.x = 50;
        text.y = 80;

        const hint = this.container.addChild(
            new Text("( Use Arrow keys to navigate, Space to attack )", HINT_TEXT_STYLE)
        );
        hint.anchor.set(0.5);
        hint.x = 400;
        hint.y = 550;

        let y = 250;
        this.addItem(y, "Start/Continue", () => gameEvents.startGame.emit(false));
        y += 50;
        this.addItem(y, "Restart", () => gameEvents.startGame.emit(true));
        y += 50;
        this.addItem(y, "Credits", () => manager.pushPage(this.creditsMenu));
    }

    public showCredits() {
        this.manager.pushPage(this.creditsMenu);
    }
}

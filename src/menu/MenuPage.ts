import { Container } from "pixi.js";
import { Key } from "ts-keycode-enum";
import pixiSound from "pixi-sound";

import { MenuManager } from "./MenuManager";
import { MenuItem } from "./MenuItem";
import { AssetLoader } from "../services/AssetLoader";

export class MenuPage {
    protected readonly manager: MenuManager;

    protected readonly container = new Container();

    protected index = 0;

    protected items: MenuItem[] = [];

    protected readonly sounds: { [s: string]: pixiSound.Sound } = {};

    public constructor(assets: AssetLoader, manager: MenuManager) {
        this.sounds.menu_move = assets.getSound("menu_move");
        this.sounds.menu_select = assets.getSound("menu_select");
        this.manager = manager;
        manager.container.addChild(this.container);
        manager.register(this);
        this.container.visible = false;
    }

    public destroy() {
        this.container.destroy();
    }

    public setVisible(visible: boolean) {
        this.container.visible = visible;
    }

    public isVisible() {
        return this.container.visible;
    }

    public addItem(y: number, text: string, callback: () => void) {
        const index = this.items.length;
        const item = new MenuItem(text, callback);
        item.text.x = 50;
        item.text.y = y;
        this.items.push(item);
        this.container.addChild(item.text);
        this.updateCursors();
        const anyItem = item.text as any;
        anyItem.interactive = true;
        anyItem.click = () => {
            this.index = index;
            this.updateCursors();
            item.callback();
        };
        anyItem.mouseover = () => {
            this.index = index;
            this.updateCursors();
        };
    }

    protected popPage() {
        this.manager.popPage();
    }

    public onKeyDown(e: KeyboardEvent) {
        switch (e.keyCode) {
            case Key.Escape:
                this.popPage();
                break;
            case Key.UpArrow:
                this.index--;
                if (this.index < 0) this.index = this.items.length - 1;
                this.updateCursors();
                this.sounds.menu_move.play();
                break;
            case Key.DownArrow:
                this.index++;
                if (this.index >= this.items.length) this.index = 0;
                this.updateCursors();
                this.sounds.menu_move.play();
                break;
            case Key.Enter:
                this.items[this.index].callback();
                this.sounds.menu_select.play();
                break;
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    public onKeyUp(_e: KeyboardEvent) {}

    private updateCursors() {
        for (const item of this.items) item.text.scale.set(1);
        const activeItem = this.items[this.index];
        activeItem.text.scale.set(1.2);
    }

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    public update(_deltaTime: number) {}
}

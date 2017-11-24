/**
 * License: zlib/libpng
 * @author Santo Pfingsten
 * @see https://github.com/Lusito/typed-asteroids
 */

import { Container } from "pixi.js";
import { Key } from "ts-keycode-enum";
import Sound from "pixi-sound/lib/Sound";
import { MenuManager } from "./MenuManager";

const MENU_TEXT_STYLE = {
    fontSize: 24,
    fontFamily: 'Arial',
    fill: '#FFFFFF',
    align: 'left',
    stroke: '#000000',
    strokeThickness: 3
};

class MenuItem {
    public readonly text: PIXI.Text;
    public readonly callback: () => void;
    public constructor(text: string, callback: () => void) {
        this.text = new PIXI.Text(text, MENU_TEXT_STYLE);
        this.text.anchor.set(0, 0.5);
        this.callback = callback;
    }
}

export class MenuPage {
    protected readonly manager: MenuManager;
    protected readonly container = new Container();
    protected index = 0;
    protected items: MenuItem[] = [];
    protected readonly sounds: { [s: string]: Sound } = {
        menu_move: (<any>PIXI.loader.resources).menu_move.sound,
        menu_select: (<any>PIXI.loader.resources).menu_select.sound
    };

    public constructor(manager: MenuManager) {
        this.manager = manager;
        manager.container.addChild(this.container);
        manager.register(this);
        this.setVisible(false);
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
        let index = this.items.length;
        let item = new MenuItem(text, callback);
        item.text.x = 50;
        item.text.y = y;
        this.items.push(item);
        this.container.addChild(item.text);
        this.updateCursors();
        let anyItem = item.text as any;
        anyItem.interactive = true;
        anyItem.click = (e: any) => {
            this.index = index;
            this.updateCursors();
            item.callback();
        };
        anyItem.mouseover = (e: any) => {
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
                if (this.index < 0)
                    this.index = this.items.length - 1;
                this.updateCursors();
                this.sounds.menu_move.play();
                break;
            case Key.DownArrow:
                this.index++;
                if (this.index >= this.items.length)
                    this.index = 0;
                this.updateCursors();
                this.sounds.menu_move.play();
                break;
            case Key.Enter:
                this.items[this.index].callback();
                this.sounds.menu_select.play();
                break;
        }
    }

    public onKeyUp(e: KeyboardEvent) {
    }

    private updateCursors() {
        for (let item of this.items)
            item.text.scale.set(1);
        let activeItem = this.items[this.index];
        activeItem.text.scale.set(1.2);
    }

    public update(deltaTime: number) {
    }

}

/**
 * License: zlib/libpng
 * @author Santo Pfingsten
 * @see https://github.com/Lusito/typed-asteroids
 */

import { Text } from "pixi.js";

const MENU_TEXT_STYLE = {
    fontSize: 24,
    fontFamily: "Arial",
    fill: "#FFFFFF",
    align: "left",
    stroke: "#000000",
    strokeThickness: 3,
};

export class MenuItem {
    public readonly text: Text;

    public readonly callback: () => void;

    public constructor(text: string, callback: () => void) {
        this.text = new Text(text, MENU_TEXT_STYLE);
        this.text.anchor.set(0, 0.5);
        this.callback = callback;
    }
}

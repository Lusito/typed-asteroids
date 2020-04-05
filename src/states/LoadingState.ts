/**
 * License: zlib/libpng
 * @author Santo Pfingsten
 * @see https://github.com/Lusito/typed-asteroids
 */

import { Graphics, Text } from "pixi.js";

import { BaseState } from "./BaseState";
import { StateManager } from "./StateManager";
import { PreloadMap } from "../PreloadMap";
import { IntroState } from "./IntroState";
import { getProgress, addOnProgress, addOnCompleteOnce, preload, startLoading } from "../loader";

const TEXT_STYLE = {
    fontSize: 24,
    fontFamily: "Arial",
    fill: "#FFFFFF",
    align: "center",
    stroke: "#000000",
    strokeThickness: 3,
};

export class LoadingState extends BaseState {
    private text: Text;

    private progressBar: Graphics;

    public constructor(manager: StateManager) {
        super(manager);
        this.progressBar = new Graphics();
        this.container.addChild(this.progressBar);
        this.text = new Text("Loading: 0%", TEXT_STYLE);
        this.text.x = 400;
        this.text.y = 300;
        this.text.anchor.set(0.5);
        this.container.addChild(this.text);

        const onProgress = () => {
            this.setProgress(getProgress() / 100);
        };
        const detachOnProgress = addOnProgress(onProgress);
        addOnCompleteOnce(() => {
            detachOnProgress();
            // eslint-disable-next-line no-new
            new IntroState(manager);
            this.destroy();
        });

        for (const key of Object.keys(PreloadMap)) {
            preload(key, PreloadMap[key]);
        }
        startLoading();
    }

    private setProgress(pct: number) {
        this.progressBar.clear();
        this.progressBar.lineStyle(0, 0x000000, 1);
        this.progressBar.beginFill(0xffffff, 1);
        this.progressBar.drawRect(50, 320, 700 * pct, 5);
        this.text.text = `Loading: ${Math.round(pct * 100).toFixed(1)}%`;
    }
}

/**
 * License: zlib/libpng
 * @author Santo Pfingsten
 * @see https://github.com/Lusito/typed-asteroids
 */

import { BaseState } from "./BaseState";
import { StateManager } from "./StateManager";
import { Graphics } from "pixi.js";
import { PreloadMap } from "../PreloadMap";
import { IntroState } from "./IntroState";
import * as Music from "../Music";
import pixiSound from "pixi-sound";

const TEXT_STYLE = {
    fontSize: 24,
    fontFamily: 'Arial',
    fill: '#FFFFFF',
    align: 'center',
    stroke: '#000000',
    strokeThickness: 3
};

export class LoadingState extends BaseState {
    private text: PIXI.Text;
    private progressBar: Graphics;

    public constructor(manager: StateManager) {
        super(manager);
        pixiSound;
        this.progressBar = new Graphics();
        this.container.addChild(this.progressBar);
        this.text = new PIXI.Text("Loading: 0%", TEXT_STYLE);
        this.text.x = 400;
        this.text.y = 300;
        this.text.anchor.set(0.5);
        this.container.addChild(this.text);

        const onProgress = () => {
            this.setProgress(PIXI.loader.progress / 100);
        };
        const progressHandle = PIXI.loader.onProgress.add(onProgress);
        PIXI.loader.onComplete.once(() => {
            Music.initResources();
            PIXI.loader.onProgress.detach(progressHandle);
            new IntroState(manager);
            this.destroy();
        });

        for (let key in PreloadMap) {
            PIXI.loader.add(key, 'assets/' + PreloadMap[key]);
        }
        PIXI.loader.load();
    }

    private setProgress(pct: number) {
        this.progressBar.clear();
        this.progressBar.lineStyle(0, 0x000000, 1);
        this.progressBar.beginFill(0xFFFFFF, 1);
        this.progressBar.drawRect(50, 320, 700 * pct, 5);
        this.text.text = `Loading: ${Math.round(pct * 100).toFixed(1)}%`;
    }
}

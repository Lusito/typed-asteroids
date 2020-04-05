/**
 * License: zlib/libpng
 * @author Santo Pfingsten
 * @see https://github.com/Lusito/typed-asteroids
 */

import { Vec2, DEG_TO_RAD } from "../Vec2";
import { Path } from "./Path";
import { Animation } from "./SceneAnimatorJson";
import { Container } from "pixi.js";
import { getSound } from "../loader";

const temp = new Vec2();

export abstract class Item {

    public group: string;
    public path: Path | null = null;
    public startTime: number;
    public originalStartTime: number;
    public pathTime: number = 0;
    public animationTime: number = 0;
    public totalAnimationTime: number = 0;
    public animations: Animation[] = [];
    public oriented: boolean;
    public readonly container: Container;
    private pausePath = 0;

    public constructor(parent: Container, group: string, startTime: number, angle: number, oriented: boolean, opacity: number) {
        this.container = new Container();
        this.container.alpha = opacity;
        this.container.rotation = angle * DEG_TO_RAD;
        parent.addChild(this.container);
        this.container.visible = startTime <= 0;
        this.group = group;
        this.startTime = startTime;
        this.originalStartTime = startTime;
        this.oriented = oriented;
    }

    public destroy() {
        this.container.destroy();
    }

    public reset(animations: Animation[]): void {
        this.animations = [];
        animations.filter((anim) => this.isGroup(anim.group || "")).forEach((anim) => {
            this.animations.push(anim);
        });
        this.startTime = this.originalStartTime;
        this.container.visible = this.startTime <= 0;
        this.pathTime = 0;
        this.pausePath = 0;
        this.animationTime = 0;
        this.totalAnimationTime = 0;
        //Fixme: angle, opacity
    }

    public abortPausePath(): void {
        this.pausePath = 0;
    }

    public setPosition(x: number, y: number): void {
        this.container.x = x;
        this.container.y = y;
    }

    public setAngle(angle: number): void {
        this.container.rotation = angle * DEG_TO_RAD;
    }

    public update(deltaTime: number): void {
        if (this.startTime > 0) {
            this.startTime -= deltaTime;
            if (this.startTime < 0) {
                deltaTime = -this.startTime;
                this.startTime = 0;
                this.container.visible = true;
            }
        }
        if (this.startTime == 0) {
            if (this.pausePath < 0) {
                return;
            }
            if (this.pausePath > 0) {
                this.pausePath -= deltaTime;
                if (this.pausePath <= 0) {
                    this.pausePath = 0;
                } else {
                    return;
                }
            }
            this.pathTime += deltaTime;
            if (this.path != null) {
                if (this.oriented) {
                    this.setAngle(this.path.derivativeAt(temp, this.pathTime).getAngle());
                }
                let p = this.path.valueAt(temp, this.pathTime);
                this.setPosition(p.x, p.y);
            }

            for (let i = this.animations.length - 1; i >= 0; i--) {
                let animation = this.animations[i];
                if (animation.time <= this.pathTime) {
                    this.startAnimation(animation);
                    this.animations.splice(i, 1);
                }
            }
        }
    }

    public isGroup(group: string): boolean {
        return group === "*" || this.group.toLowerCase() === group.toLowerCase();
    }

    public startAnimation(animation: Animation): boolean {
        if (animation.type === "sound") {
            let sound = getSound(animation.resource);
            if (sound)
                sound.play();
            return true;
        }
        if (animation.type === "path") {
            if (animation.action === "pause") {
                this.pausePath = animation.animationTime;
                return true;
            }
        }
        return false;
    }

    public abstract isAnimationDone(): boolean;

    public isDone(): boolean {
        if (this.path == null) {
            return this.animations.length === 0 && this.isAnimationDone();
        }
        return this.pathTime > this.path.getTotalTime();
    }

    public isStarted(): boolean {
        return this.startTime >= 0;
    }

    public shouldRender(): boolean {
        return this.startTime == 0 && (this.path == null || this.pathTime < this.path.getTotalTime());
    }
}

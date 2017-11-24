/**
 * License: zlib/libpng
 * @author Santo Pfingsten
 * @see https://github.com/Lusito/typed-asteroids
 */

import { Item } from "../Item";
import { Animation } from "../SceneAnimatorJson";
import { Sprite, Container } from "pixi.js";
import { SpriteEffect, SpriteEffectFadeIn, SpriteEffectFadeOut, SpriteEffectScaleIn, SpriteEffectScaleOut, SpriteEffectHide, SpriteEffectShow } from "./SpriteEffects";

const spriteEffectMap: { [s: string]: SpriteEffect } = {
    fade_in: new SpriteEffectFadeIn(),
    fade_out: new SpriteEffectFadeOut(),
    scale_in: new SpriteEffectScaleIn(),
    scale_out: new SpriteEffectScaleOut(),
    hide: new SpriteEffectHide(),
    show: new SpriteEffectShow()
};

export class SpriteItem extends Item {

    protected angleAdd: number;
    public readonly scale: number;
    protected sprite: Sprite | null;
    public effect: SpriteEffect | null = null;

    public constructor(parent: Container, type: string, group: string, scale: number, startTime: number, angle: number, oriented: boolean, opacity: number, resource: string) {
        super(parent, group, startTime, 0, oriented, opacity);
        this.angleAdd = angle;
        this.scale = scale;
        this.container.scale.set(scale);
        this.setSprite(type, resource);
        // this.originalResource = resource; // type as well
    }

    public setSprite(type: string, resourceName: string) {
        if (this.sprite) {
            this.sprite.destroy();
            this.sprite = null;
        }
        if (!resourceName)
            return;

        // this.animation = null;
        if (type === 'sprite') {
            let resource = PIXI.loader.resources[resourceName];
            if (resource && resource.texture) {
                this.sprite = new Sprite(resource.texture);
                this.sprite.anchor.set(0.5);
                this.container.addChild(this.sprite);
            }
        } else if (type === 'animation') {
            // this.animationTime = 0;
            // this.animation = getter.getAnimation(animation.animation);
            // this.totalAnimationTime = this.animation.getDuration();
        }
    }

    public setAngle(angle: number): void {
        super.setAngle(angle + this.angleAdd);
    }

    public update(deltaTime: number): void {
        super.update(deltaTime);

        this.animationTime += deltaTime;
        if (this.startTime == 0) {
            this.animationTime += deltaTime;
            if (this.effect != null)
                this.effect.update(this, deltaTime);
        }
    }

    public startAnimation(animation: Animation): boolean {
        if (super.startAnimation(animation) || animation.type !== "sprite")
            return true;
        if (animation.effect) {
            this.effect = spriteEffectMap[animation.effect] || null;
            if (this.effect)
                this.effect.prepare(this, animation);
            else
                console.warn('Could not find sprite animation: ' + animation.effect);
        } else if (animation.resource) {
            this.setSprite(animation.type, animation.resource);
        }
        return true;
    }

    public isAnimationDone(): boolean {
        return this.effect == null && this.animationTime > this.totalAnimationTime;
    }

    public reset(animations: Animation[]): void {
        super.reset(animations);

        // this.setSprite(this.originalResource);
        this.effect = null;
    }
}

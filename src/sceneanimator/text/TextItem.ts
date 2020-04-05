/**
 * License: zlib/libpng
 * @author Santo Pfingsten
 * @see https://github.com/Lusito/typed-asteroids
 */

import { Item } from "../Item";
import { TextChar } from "./TextChar";
import { Text, TextStyle, TextMetrics, Container } from "pixi.js";
import { Animation } from "../SceneAnimatorJson";
import { TextEffect, TextEffectFadeIn, TextEffectFadeOut, TextEffectConstruct, TextEffectType, TextEffectTypeInstant, TextEffectUntype, TextEffectUntypeInstant } from "./TextEffects";

const textEffectMap: { [s: string]: TextEffect } = {
    fade_in: new TextEffectFadeIn(),
    fade_out: new TextEffectFadeOut(),
    construct: new TextEffectConstruct(),
    construct_type: new TextEffectConstruct(),
    type: new TextEffectType(),
    type_instant: new TextEffectTypeInstant(),
    untype: new TextEffectUntype(),
    untype_instant: new TextEffectUntypeInstant()
};

export class TextItem extends Item {

    public readonly style: TextStyle;
    public readonly originalText: string;
    public readonly text: Text;
    public xOffset: number = 0;

    public chars: TextChar[] = [];
    public effect: TextEffect | null = null;

    public constructor(parent: Container, group: string, startTime: number, angle: number, opacity: number, text: string, style: TextStyle) {
        super(parent, group, startTime, angle, false, opacity);
        this.originalText = text;
        this.text = new Text(text, style);
        this.container.addChild(this.text);
        this.text.text = text;
        this.text.anchor.set(0, 0.5);
        this.style = style;
        if (style.align !== 'left') {
            let metrics = TextMetrics.measureText(text, style);
            if (style.align == 'right') {
                this.xOffset = -metrics.width;
            } else {
                this.xOffset = -metrics.width / 2;
            }
        }
    }

    public reset(animations: Animation[]): void {
        super.reset(animations);

        for (let ch of this.chars)
            ch.destroy();
        this.text.text = this.originalText;
        this.chars = [];
        this.effect = null;
    }

    public setPosition(x: number, y: number): void {
        super.setPosition(x + this.xOffset, y);
    }

    public update(delta: number): void {
        super.update(delta);

        if (this.startTime == 0) {
            this.animationTime += delta;
            if (this.effect != null)
                this.effect.update(this, delta);
        }
    }

    public startAnimation(animation: Animation): boolean {
        if (super.startAnimation(animation) || animation.type !== 'text')
            return true;
        this.effect = textEffectMap[animation.effect] || null;
        if (this.effect)
            this.effect.prepare(this, animation);
        else
            console.warn('Could not find text animation: ' + animation.effect);
        return true;
    }

    public isAnimationDone(): boolean {
        return this.effect == null;
    }
}

import { Text, TextStyle, TextMetrics, Container } from "pixi.js";

import { Item } from "../Item";
import type { TextChar } from "./TextChar";
import type { Animation } from "../SceneAnimatorJSON";
import { TextEffect } from "./effects/TextEffect";
import { TextEffectFadeIn } from "./effects/TextEffectFadeIn";
import { TextEffectFadeOut } from "./effects/TextEffectFadeOut";
import { TextEffectConstruct } from "./effects/TextEffectConstruct";
import { TextEffectType } from "./effects/TextEffectType";
import { TextEffectTypeInstant } from "./effects/TextEffectTypeInstant";
import { TextEffectUntype } from "./effects/TextEffectUntype";
import { TextEffectUntypeInstant } from "./effects/TextEffectUntypeInstant";
import { AssetLoader } from "../../services/AssetLoader";

const textEffectMap: { [s: string]: TextEffect } = {
    fade_in: new TextEffectFadeIn(),
    fade_out: new TextEffectFadeOut(),
    construct: new TextEffectConstruct(),
    construct_type: new TextEffectConstruct(),
    type: new TextEffectType(),
    type_instant: new TextEffectTypeInstant(),
    untype: new TextEffectUntype(),
    untype_instant: new TextEffectUntypeInstant(),
};

export class TextItem extends Item {
    public readonly style: TextStyle;

    public readonly originalText: string;

    public readonly text: Text;

    public xOffset = 0;

    public chars: TextChar[] = [];

    public effect: TextEffect | null = null;

    public constructor(
        assets: AssetLoader,
        parent: Container,
        group: string,
        startTime: number,
        angle: number,
        opacity: number,
        text: string,
        style: TextStyle
    ) {
        super(assets, parent, group, startTime, angle, false, opacity);
        this.originalText = text;
        this.text = new Text(text, style);
        this.container.addChild(this.text);
        this.text.text = text;
        this.text.anchor.set(0, 0.5);
        this.style = style;
        if (style.align !== "left") {
            const metrics = TextMetrics.measureText(text, style);
            if (style.align === "right") {
                this.xOffset = -metrics.width;
            } else {
                this.xOffset = -metrics.width / 2;
            }
        }
    }

    public override reset(animations: Animation[]) {
        super.reset(animations);

        for (const ch of this.chars) ch.destroy();
        this.text.text = this.originalText;
        this.chars = [];
        this.effect = null;
    }

    public override setPosition(x: number, y: number) {
        super.setPosition(x + this.xOffset, y);
    }

    public override update(delta: number) {
        super.update(delta);

        if (this.startTime === 0) {
            this.animationTime += delta;
            if (this.effect != null) this.effect.update(this, delta);
        }
    }

    public override startAnimation(animation: Animation) {
        if (super.startAnimation(animation) || animation.type !== "text") return true;
        this.effect = textEffectMap[animation.effect] || null;
        if (this.effect) this.effect.prepare(this, animation);
        else console.warn(`Could not find text animation: ${animation.effect}`);
        return true;
    }

    public isAnimationDone() {
        return this.effect == null;
    }
}

/**
 * License: zlib/libpng
 * @author Santo Pfingsten
 * @see https://github.com/Lusito/typed-asteroids
 */

import { Vec2 } from "../../Vec2";
import { TextStyle, TextMetrics, Container } from "pixi.js";
import { TextAnimation } from "../SceneAnimatorJson";
import { getDefault } from "../SceneAnimator";

const bezierTemp = new Vec2();
const bezierTempOut = new Vec2();

function quadraticBezier(out: Vec2, t: number, p0: Vec2, p1: Vec2, p2: Vec2): Vec2 {
    let dt = 1 - t;
    return out.setFrom(p0).scale(dt * dt).add(bezierTemp.setFrom(p1).scale(2 * dt * t)).add(bezierTemp.setFrom(p2).scale(t * t));
}

function randomFloat(min: number, max: number) {
    return min + Math.random() * (max - min);
}

export class TextChar {
    private readonly text: PIXI.Text;
    private readonly start = new Vec2();
    private readonly control = new Vec2();
    private readonly end = new Vec2();
    private animationTime: number = 0;
    private startTime: number = 0;

    public constructor(style: TextStyle, parent: Container, text: string, index: number, animation: TextAnimation, startTime: number, totalAnimationTime: number) {
        this.startTime = startTime;
        if (index > 0) {
            let bounds = TextMetrics.measureText(text.substr(0, index), style);
            this.end.x = bounds.width - style.strokeThickness;
        }

        this.text = new PIXI.Text(text[index], style);
        this.text.anchor.set(0, 0.5);
        this.text.visible = startTime <= 0;
        parent.addChild(this.text);

        let angle = this.getRandomAngle(getDefault(animation, 'minAngle', 0), getDefault(animation, 'maxAngle', 360));
        let radius = this.getRandomRadius(getDefault(animation, 'minRadius', 0), getDefault(animation, 'maxRadius', 50));
        this.start.setAngle(angle).scale(radius);
        this.start.x += this.end.x;

        let minCurveAngle = getDefault(animation, 'minCurveAngle', 45);
        let maxCurveAngle = getDefault(animation, 'maxCurveAngle', 135);
        if (Math.random() < 0.5) {
            angle += randomFloat(minCurveAngle, maxCurveAngle);
        } else {
            angle -= randomFloat(minCurveAngle, maxCurveAngle);
        }
        if (angle < 0) {
            angle += 360;
        } else if (angle > 360) {
            angle -= 360;
        }
        this.control.setAngle(angle).scale(radius);
        this.control.x += this.end.x;
    }

    public destroy() {
        this.text.destroy();
    }

    private getRandomRadius(minRadius: number, maxRadius: number): number {
        let radius;
        if (minRadius == maxRadius) {
            radius = minRadius;
        } else {
            radius = randomFloat(minRadius, maxRadius);
        }
        return radius;
    }

    private getRandomAngle(minAngle: number, maxAngle: number): number {
        let angle: number;
        if (minAngle == maxAngle) {
            angle = minAngle;
        } else if (minAngle < maxAngle) {
            angle = randomFloat(minAngle, maxAngle);
        } else {
            minAngle -= 360;
            angle = randomFloat(minAngle, maxAngle);
            if (angle < 0) {
                angle += 360;
            }
        }
        return angle;
    }

    public update(delta: number, totalAnimationTime: number): boolean {
        if (this.startTime > 0) {
            this.startTime -= delta;
            if (this.startTime < 0) {
                this.animationTime += -this.startTime;
                this.startTime = 0;
                this.text.visible = true;
            }
        } else {
            this.animationTime += delta;
            if (this.animationTime > totalAnimationTime)
                this.animationTime = totalAnimationTime;
        }
        if (this.startTime == 0) {
            let currentTime = this.animationTime / totalAnimationTime;
            quadraticBezier(bezierTempOut, currentTime, this.start, this.control, this.end);
            this.text.alpha = Math.min(1, currentTime * 2);
            this.text.scale.set(0.5 + currentTime * 0.5);
            this.text.x = bezierTempOut.x;
            this.text.y = bezierTempOut.y;
        }
        return this.animationTime >= totalAnimationTime;
    }

}

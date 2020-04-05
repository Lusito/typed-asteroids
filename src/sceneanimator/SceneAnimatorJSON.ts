/**
 * License: zlib/libpng
 * @author Santo Pfingsten
 * @see https://github.com/Lusito/typed-asteroids
 */

import { TextStyle } from "pixi.js";

type TextStyleOptions = ConstructorParameters<typeof TextStyle>[0];

export interface DestinationJSON {
    x: number;
    y: number;
    speed: number;
}
export interface PathJSON {
    type: "linear" | "catmull_rom";
    destinations: DestinationJSON[];
}

export interface BaseAnimation {
    time: number;
    group?: string;
}

export interface TextAnimation extends BaseAnimation {
    type: "text";
    effect:
        | "fade_in"
        | "fade_out"
        | "construct"
        | "construct_type"
        | "type"
        | "type_instant"
        | "untype"
        | "untype_instant";
    effectTime?: number;
    // For text explosion animation
    minRadius?: number;
    maxRadius?: number;
    minAngle?: number;
    maxAngle?: number;
    minCurveAngle?: number;
    maxCurveAngle?: number;
}
export interface SpriteAnimation extends BaseAnimation {
    type: "sprite";
    effect?: "fade_in" | "fade_out" | "scale_in" | "scale_out" | "hide" | "show";
    effectTime?: number;
    resource?: string;
}
export interface SoundAnimation extends BaseAnimation {
    type: "sound";
    resource: string;
}
export interface PathAnimation extends BaseAnimation {
    type: "path";
    action: string;
    animationTime: number;
}
export type Animation = TextAnimation | SpriteAnimation | SoundAnimation | PathAnimation;

export interface QueueJSON {
    layer?: number;
    time: number;
    next?: string;
    finalNext?: string;
    items: ItemJSON[];
    animations?: Animation[];
}

export interface BaseItemJSON {
    path?: string;
    group?: string;
    opacity?: number;
    delay: number;
    x?: number;
    y?: number;
    angle?: number;
}
export interface TextItemJSON extends BaseItemJSON {
    type: "text";
    style: string;
    text: string;
}
export interface SpriteItemJSON extends BaseItemJSON {
    type: "sprite";
    resource: string;
    scale?: number;
    oriented?: boolean;
}
export type ItemJSON = TextItemJSON | SpriteItemJSON;

export interface SceneAnimatorJSON {
    timeFactor?: number;
    textStyles: { [s: string]: TextStyleOptions };
    paths: { [s: string]: PathJSON };
    queues: { [s: string]: QueueJSON };
}

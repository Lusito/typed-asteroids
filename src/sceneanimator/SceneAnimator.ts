/**
 * License: zlib/libpng
 * @author Santo Pfingsten
 * @see https://github.com/Lusito/typed-asteroids
 */

import { Path } from "./Path";
import { Queue } from "./Queue";
import { SceneAnimatorJSON } from "./SceneAnimatorJson";
import { Destination } from "./Destination";
import { LinearPath } from "./LinearPath";
import { Item } from "./Item";
import { TextItem } from "./text/TextItem";
import { SpriteItem } from "./sprite/SpriteItem";
import { TextStyle, Container } from "pixi.js";

export function getDefault<T>(obj: any, key: string, def: T): T {
    if (obj.hasOwnProperty(key))
        return obj[key];
    return def;
}

export interface SceneAnimatorListener {
    onSceneEnd(): void;
}

export class SceneAnimator {
    private readonly container: Container;

    private readonly textStyles: { [s: string]: TextStyle } = {};
    private readonly queues: { [s: string]: Queue } = {};
    private readonly queueArray: Queue[] = [];
    private readonly paths: { [s: string]: Path } = {};
    private timeFactor: number;
    private listeners: SceneAnimatorListener[] = [];
    private doneTriggered = false;

    public constructor(credits: SceneAnimatorJSON, parent: Container) {
        this.container = new Container();
        parent.addChild(this.container);
        this.timeFactor = credits.timeFactor != null ? credits.timeFactor : 1;
        this.initStyles(credits);
        this.initPaths(credits);
        this.initQueues(credits);
    }

    public destroy() {
        this.container.destroy();
    }

    public getTimeFactor(): number {
        return this.timeFactor;
    }

    public setTimeFactor(timeFactor: number): void {
        this.timeFactor = timeFactor;
    }

    private initStyles(credits: SceneAnimatorJSON): void {
        for (let key in credits.textStyles) {
            this.textStyles[key] = new TextStyle(credits.textStyles[key]);
        }
    }

    private initPaths(credits: SceneAnimatorJSON): void {
        for (let key in credits.paths) {
            let value = credits.paths[key];
            let destinations: Destination[] = []

            for (let dest of value.destinations) {
                let destination = new Destination();
                destination.x = dest.x != null ? dest.x : 0;
                destination.y = dest.y != null ? dest.y : 0;
                destination.speed = dest.speed != null ? dest.speed : 0;
                destinations.push(destination);
            }

            let path = new LinearPath(destinations);
            this.paths[key] = path;
        }
    }

    private initQueues(credits: SceneAnimatorJSON): void {
        let style;
        let startTime, angle, opacity, scale;
        let layer;
        let oriented;
        let group;
        for (let key in credits.queues) {
            let value = credits.queues[key];

            let itemStartTime = 0;
            let items: Item[] = [];
            for (let itemData of value.items) {
                startTime = getDefault(itemData, 'delay', 0);
                opacity = getDefault(itemData, 'opacity', 1);
                group = getDefault(itemData, 'group', "");
                angle = getDefault(itemData, 'angle', 0);

                itemStartTime += startTime;

                let item = null;
                if (itemData.type === "sprite") {
                    oriented = getDefault(itemData, 'oriented', false);
                    scale = getDefault(itemData, 'scale', 1);
                    item = new SpriteItem(this.container, itemData.type, group, scale, itemStartTime, angle, oriented, opacity, itemData.resource);
                    if (itemData.hasOwnProperty('x') && itemData.hasOwnProperty('y')) {
                        item.setPosition(itemData.x || 0, itemData.y || 0);
                    }
                } else if (itemData.type === "text") {
                    style = this.textStyles[itemData.style];
                    item = new TextItem(this.container, group, itemStartTime, angle, opacity, itemData.text, style);

                    if (itemData.hasOwnProperty('x') && itemData.hasOwnProperty('y')) {
                        item.setPosition(itemData.x || 0, itemData.y || 0);
                    }
                }
                if (item != null) {
                    item.path = itemData.path ? this.paths[itemData.path] : null;
                    items.push(item);
                }
            }

            startTime = getDefault(value, 'startTime', 0);
            layer = getDefault(value, 'layer', 0);
            let queue = new Queue(startTime, layer, items, value.animations || []);
            this.queues[key] = queue;
        }

        // Solve next and finalNext
        for (let key in credits.queues) {
            let value = credits.queues[key];
            let queue = this.queues[key];
            if (value.next != null) {
                queue.next = this.queues[value.next];
            }
            if (value.finalNext != null) {
                queue.finalNext = this.queues[value.finalNext];
            }
        }

        for (let key in this.queues) {
            this.queueArray.push(this.queues[key]);
        }
        this.queueArray.sort((a, b) => a.layer - b.layer);
    }

    public reset(): void {
        for (let queue of this.queueArray)
            queue.reset();
        this.doneTriggered = false;
    }

    public abortPausePaths(): void {
        for (let queue of this.queueArray)
            queue.abortPausePaths();
    }

    public update(delta: number): void {
        delta *= this.timeFactor;
        let done = true;
        for (let queue of this.queueArray) {
            queue.update(delta);
            if (!queue.isDone())
                done = false;
        }
        if (done) {
            if (!this.doneTriggered) {
                this.doneTriggered = true;
                for (let listener of this.listeners)
                    listener.onSceneEnd();
            }
        }
    }

    public addListener(listener: SceneAnimatorListener): void {
        if (this.listeners.indexOf(listener) === -1)
            this.listeners.push(listener);
    }

    public removeListener(listener: SceneAnimatorListener): void {
        let index = this.listeners.indexOf(listener);
        if (index !== -1)
            this.listeners.splice(index, 1);
    }
}

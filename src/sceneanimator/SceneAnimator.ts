/**
 * License: zlib/libpng
 * @author Santo Pfingsten
 * @see https://github.com/Lusito/typed-asteroids
 */

import { TextStyle, Container } from "pixi.js";

import { Path } from "./Path";
import { Queue } from "./Queue";
import { SceneAnimatorJSON } from "./SceneAnimatorJSON";
import { Destination } from "./Destination";
import { LinearPath } from "./LinearPath";
import { Item } from "./Item";
import { TextItem } from "./text/TextItem";
import { SpriteItem } from "./sprite/SpriteItem";
import { getDefault } from "./sceneAnimatorUtils";

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

    public getTimeFactor() {
        return this.timeFactor;
    }

    public setTimeFactor(timeFactor: number) {
        this.timeFactor = timeFactor;
    }

    private initStyles(credits: SceneAnimatorJSON) {
        for (const key of Object.keys(credits.textStyles)) {
            this.textStyles[key] = new TextStyle(credits.textStyles[key]);
        }
    }

    private initPaths(credits: SceneAnimatorJSON) {
        for (const key of Object.keys(credits.paths)) {
            const value = credits.paths[key];
            const destinations: Destination[] = [];

            for (const dest of value.destinations) {
                const destination = new Destination();
                destination.x = dest.x != null ? dest.x : 0;
                destination.y = dest.y != null ? dest.y : 0;
                destination.speed = dest.speed != null ? dest.speed : 0;
                destinations.push(destination);
            }

            const path = new LinearPath(destinations);
            this.paths[key] = path;
        }
    }

    private initQueues(credits: SceneAnimatorJSON) {
        let style;
        let startTime;
        let angle;
        let opacity;
        let scale;
        let layer;
        let oriented;
        let group;
        for (const key of Object.keys(credits.queues)) {
            const value = credits.queues[key];

            let itemStartTime = 0;
            const items: Item[] = [];
            for (const itemData of value.items) {
                startTime = getDefault(itemData, "delay", 0);
                opacity = getDefault(itemData, "opacity", 1);
                group = getDefault(itemData, "group", "");
                angle = getDefault(itemData, "angle", 0);

                itemStartTime += startTime;

                let item = null;
                if (itemData.type === "sprite") {
                    oriented = getDefault(itemData, "oriented", false);
                    scale = getDefault(itemData, "scale", 1);
                    item = new SpriteItem(
                        this.container,
                        itemData.type,
                        group,
                        scale,
                        itemStartTime,
                        angle,
                        oriented,
                        opacity,
                        itemData.resource
                    );
                    if ("x" in itemData && "y" in itemData) {
                        item.setPosition(itemData.x ?? 0, itemData.y ?? 0);
                    }
                } else if (itemData.type === "text") {
                    style = this.textStyles[itemData.style];
                    item = new TextItem(this.container, group, itemStartTime, angle, opacity, itemData.text, style);

                    if ("x" in itemData && "y" in itemData) {
                        item.setPosition(itemData.x ?? 0, itemData.y ?? 0);
                    }
                }
                if (item != null) {
                    item.path = itemData.path ? this.paths[itemData.path] : null;
                    items.push(item);
                }
            }

            startTime = getDefault(value, "startTime", 0);
            layer = getDefault(value, "layer", 0);
            const queue = new Queue(startTime, layer, items, value.animations ?? []);
            this.queues[key] = queue;
        }

        // Solve next and finalNext
        for (const key of Object.keys(credits.queues)) {
            const value = credits.queues[key];
            const queue = this.queues[key];
            if (value.next != null) {
                queue.next = this.queues[value.next];
            }
            if (value.finalNext != null) {
                queue.finalNext = this.queues[value.finalNext];
            }
        }

        for (const key of Object.keys(this.queues)) {
            this.queueArray.push(this.queues[key]);
        }
        this.queueArray.sort((a, b) => a.layer - b.layer);
    }

    public reset() {
        for (const queue of this.queueArray) queue.reset();
        this.doneTriggered = false;
    }

    public abortPausePaths() {
        for (const queue of this.queueArray) queue.abortPausePaths();
    }

    public update(delta: number) {
        delta *= this.timeFactor;
        let done = true;
        for (const queue of this.queueArray) {
            queue.update(delta);
            if (!queue.isDone()) done = false;
        }
        if (done) {
            if (!this.doneTriggered) {
                this.doneTriggered = true;
                for (const listener of this.listeners) listener.onSceneEnd();
            }
        }
    }

    public addListener(listener: SceneAnimatorListener) {
        if (!this.listeners.includes(listener)) this.listeners.push(listener);
    }

    public removeListener(listener: SceneAnimatorListener) {
        const index = this.listeners.indexOf(listener);
        if (index !== -1) this.listeners.splice(index, 1);
    }
}

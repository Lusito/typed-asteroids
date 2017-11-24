/**
 * License: zlib/libpng
 * @author Santo Pfingsten
 * @see https://github.com/Lusito/typed-asteroids
 */

import { Item } from "./Item";
import { Animation } from "./SceneAnimatorJson";

export class Queue {

    protected readonly originalStartTime: number;
    protected startTime: number;
    public next: Queue;
    public finalNext: Queue;
    protected readonly items: Item[];
    public readonly animations: Animation[];
    public readonly layer: number;
    private done = false;
    private lastItemStarted = false;

    public constructor(time: number, layer: number, items: Item[], animations: Animation[]) {
        this.startTime = time;
        this.layer = layer;
        this.originalStartTime = time;
        this.items = items;
        this.animations = animations;
        this.reset();
    }

    public reset(): void {
        this.startTime = this.originalStartTime;
        this.done = false;
        this.lastItemStarted = false;
        for (let item of this.items) {
            item.reset(this.animations);
        }
    }

    public start(): void {
        this.startTime = 0;
        this.update(0);
    }

    public update(delta: number): void {
        if (this.startTime > 0) {
            this.startTime -= delta;
            if (this.startTime > 0) {
                return;
            } else if (this.startTime < 0) {
                delta = -this.startTime;
                this.startTime = 0;
            }
        }
        if (this.startTime == 0 && !this.done) {
            this.done = true;
            let allStarted = true;
            // update items
            for (let item of this.items) {
                item.update(delta);
                if (!item.isStarted()) {
                    allStarted = false;
                }
                if (this.done && !item.isDone()) {
                    this.done = false;
                }
            }
            if (!this.lastItemStarted) {
                if (allStarted && this.next != null) {
                    this.next.start();
                }
                this.lastItemStarted = true;
            }
            if (this.done && this.finalNext != null) {
                this.finalNext.start();
            }
        }
    }

    public isDone(): boolean {
        return this.startTime == 0 && this.done;
    }

    public abortPausePaths(): void {
        for (let item of this.items)
            item.abortPausePath();
    }
}

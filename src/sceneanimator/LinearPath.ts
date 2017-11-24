/**
 * License: zlib/libpng
 * @author Santo Pfingsten
 * @see https://github.com/Lusito/typed-asteroids
 */

import { Path } from "./Path";
import { Vec2 } from "../Vec2";
import { Destination } from "./Destination";

export class LinearPath implements Path {
    public readonly destinations: Destination[];
    private totalTime: number = 0;

    public constructor(destinations: Destination[]) {
        this.destinations = destinations;

        // Make sure all times are set correctly
        let temp = new Vec2();
        let index = 0;
        let lastIndex = destinations.length - 1;
        for (let dest of destinations) {
            if (index < lastIndex) {
                let next = destinations[index + 1];
                dest.moveTime = temp.setFrom(next).subtract(dest).length() / dest.speed;
            }
            dest.startTime = this.totalTime;
            this.totalTime += dest.moveTime;
            index++;
        }
    }

    private getStartIndex(t: number): number {
        let i = -1;
        for (let dest of this.destinations) {
            if (dest.startTime > t) {
                break;
            }
            i++;
        }
        return Math.max(0, i);
    }

    public derivativeAt(out: Vec2, t: number): Vec2 {
        let index = this.getStartIndex(t);
        if (index == this.destinations.length - 1) {
            index--;
        }
        let start = this.destinations[index];
        let next = this.destinations[index + 1];
        return out.setFrom(next).subtract(start).normalize();
    }

    public valueAt(out: Vec2, t: number): Vec2 {
        let index = this.getStartIndex(t);
        let start = this.destinations[index];

        if (index == this.destinations.length - 1) {
            return out.setFrom(start);
        }

        let next = this.destinations[index + 1];
        return out.setFrom(next).subtract(start).scale((t - start.startTime) / start.moveTime).add(start);
    }

    public getTotalTime(): number {
        return this.totalTime;
    }
}

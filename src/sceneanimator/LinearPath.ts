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

    private totalTime = 0;

    public constructor(destinations: Destination[]) {
        this.destinations = destinations;

        // Make sure all times are set correctly
        const temp = new Vec2();
        let index = 0;
        const lastIndex = destinations.length - 1;
        for (const dest of destinations) {
            if (index < lastIndex) {
                const next = destinations[index + 1];
                dest.moveTime = temp.setFrom(next).subtract(dest).length() / dest.speed;
            }
            dest.startTime = this.totalTime;
            this.totalTime += dest.moveTime;
            index++;
        }
    }

    private getStartIndex(t: number) {
        let i = -1;
        for (const dest of this.destinations) {
            if (dest.startTime > t) {
                break;
            }
            i++;
        }
        return Math.max(0, i);
    }

    public derivativeAt(out: Vec2, t: number) {
        let index = this.getStartIndex(t);
        if (index === this.destinations.length - 1) {
            index--;
        }
        const start = this.destinations[index];
        const next = this.destinations[index + 1];
        return out.setFrom(next).subtract(start).normalize();
    }

    public valueAt(out: Vec2, t: number) {
        const index = this.getStartIndex(t);
        const start = this.destinations[index];

        if (index === this.destinations.length - 1) {
            return out.setFrom(start);
        }

        const next = this.destinations[index + 1];
        return out
            .setFrom(next)
            .subtract(start)
            .scale((t - start.startTime) / start.moveTime)
            .add(start);
    }

    public getTotalTime() {
        return this.totalTime;
    }
}

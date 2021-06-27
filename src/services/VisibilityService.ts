import pixiSound from "pixi-sound";
import { Service } from "typedi";

// Set the name of the hidden property and the change event for visibility
let hidden: string | null = null;
let visibilityChange: string | null = null;
if (typeof document.hidden !== "undefined") {
    // Opera 12.10 and Firefox 18 and later support
    hidden = "hidden";
    visibilityChange = "visibilitychange";
} else if (typeof (document as any).msHidden !== "undefined") {
    hidden = "msHidden";
    visibilityChange = "msvisibilitychange";
} else if (typeof (document as any).webkitHidden !== "undefined") {
    hidden = "webkitHidden";
    visibilityChange = "webkitvisibilitychange";
}

@Service({ global: true })
export class VisibilityService {
    public constructor() {
        if (!this.isVisible()) pixiSound.muteAll();
        this.onChange((visible) => {
            if (visible) pixiSound.unmuteAll();
            else pixiSound.muteAll();
        });
    }

    public isVisible() {
        return !hidden || !(document as any)[hidden];
    }

    public onChange(callback: (visible: boolean) => void) {
        if (typeof document.addEventListener === "undefined" || !hidden || !visibilityChange) {
            console.error("Can't use Visibility API.");
        } else {
            return document.addEventListener(visibilityChange, () => callback(this.isVisible()), false);
        }
    }
}

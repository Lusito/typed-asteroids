/**
 * License: zlib/libpng
 * @author Santo Pfingsten
 * @see https://github.com/Lusito/typed-asteroids
 */

import { Application } from "pixi.js";
import { StateManager } from "./states/StateManager";
import { LoadingState } from "./states/LoadingState";
import { setLoader } from "./loader";

const app = new Application({
    width: 800,
    height: 600,
    backgroundColor: 0
});
document.body.appendChild(app.view);

setLoader(app.loader);

const stateManager = new StateManager(app.stage);
new LoadingState(stateManager);
// Listen for animate update
app.ticker.add(() => {
    stateManager.update(Math.min(0.032, app.ticker.elapsedMS / 1000));
});

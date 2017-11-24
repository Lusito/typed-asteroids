/**
 * License: zlib/libpng
 * @author Santo Pfingsten
 * @see https://github.com/Lusito/typed-asteroids
 */

import { Application } from "pixi.js";
import { StateManager } from "./states/StateManager";
import { LoadingState } from "./states/LoadingState";

const app = new Application(800, 600, { backgroundColor: 0 });
document.body.appendChild(app.view);

const stateManager = new StateManager(app.stage);
new LoadingState(stateManager);
// Listen for animate update
app.ticker.add(function (delta) {
	stateManager.update(Math.min(0.032, app.ticker.elapsedMS / 1000));
});

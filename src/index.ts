import { Application } from "pixi.js";
import "@abraham/reflection";
import Container from "typedi";

import { StateManager } from "./states/StateManager";
import { LoadingState } from "./states/LoadingState";
import { VisibilityService } from "./services/VisibilityService";

const app = new Application({
    width: 800,
    height: 600,
    backgroundColor: 0,
});
document.body.appendChild(app.view);

Container.set(Application, app);
Container.get(VisibilityService);

const stateManager = new StateManager(app.stage);
// eslint-disable-next-line no-new
new LoadingState(stateManager);

// Listen for animate update
app.ticker.add(() => {
    stateManager.update(Math.min(0.032, app.ticker.elapsedMS / 1000));
});

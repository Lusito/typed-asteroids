import { createComponentFactoryRegistry } from "typed-ecstasy";

import type { AsteroidsContext, AsteroidsEntityConfig } from "../types";

export const componentFactories = createComponentFactoryRegistry<AsteroidsEntityConfig, AsteroidsContext>();

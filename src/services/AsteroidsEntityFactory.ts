import { ComponentBlueprint, EntityFactory, PoolAllocator } from "typed-ecstasy";
import { Service } from "typedi";

import { blueprints } from "../blueprints";
import { componentFactories } from "../components/componentFactories";
import { AsteroidsEntityConfig, AsteroidsContext } from "../types";
import { AssetLoader } from "./AssetLoader";

@Service()
export class AsteroidsEntityFactory extends EntityFactory<AsteroidsEntityConfig, AsteroidsContext> {
    public constructor(assets: AssetLoader) {
        super(componentFactories, { assets }, new PoolAllocator());

        // Add all entity blueprints
        for (const name of Object.keys(blueprints)) {
            const entityConfig = blueprints[name];

            // An entity blueprint is essentially just an array of ComponentBlueprint objects.
            const entityBlueprint = Object.keys(entityConfig).map(
                // eslint-disable-next-line no-loop-func
                (key) => new ComponentBlueprint(key, entityConfig[key as keyof AsteroidsEntityConfig])
            );
            this.addEntityBlueprint(name, entityBlueprint);
        }
    }
}

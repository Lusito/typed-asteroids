/**
 * License: zlib/libpng
 * @author Santo Pfingsten
 * @see https://github.com/Lusito/typed-asteroids
 */

import { ComponentFactory, Entity } from "typed-ecstasy";

import { InputComponent } from "./InputComponent";

export class InputComponentFactory extends ComponentFactory {
    public assemble(entity: Entity) {
        entity.add(new InputComponent());
        return true;
    }
}

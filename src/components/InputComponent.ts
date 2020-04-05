import { Component, Entity } from "typed-ecstasy";

export class InputComponent extends Component {}

export function inputComponentFactory(entity: Entity) {
    entity.add(new InputComponent());
    return true;
}

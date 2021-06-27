import { Component } from "typed-ecstasy";

import { componentFactories } from "./componentFactories";

export class InputComponent extends Component {}

export type InputConfig = Record<string, never>;

componentFactories.add("Input", (obtain) => obtain(InputComponent));

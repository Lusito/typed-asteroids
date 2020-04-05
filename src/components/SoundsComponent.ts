import { Component } from "typed-ecstasy";
import pixiSound from "pixi-sound";

export class SoundsComponent extends Component {
    spawn?: pixiSound.Sound;

    die?: pixiSound.Sound;

    pickup?: pixiSound.Sound;
}

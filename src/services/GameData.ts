import { Service } from "typedi";

@Service()
export class GameData {
    playing = false;

    lifes = 5;

    level = 0; // i.e. not playing

    public reset() {
        this.lifes = 5;
        this.level = 0;
    }
}

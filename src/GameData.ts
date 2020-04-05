/**
 * License: zlib/libpng
 * @author Santo Pfingsten
 * @see https://github.com/Lusito/typed-asteroids
 */

export class GameData {
    playing = false;

    lifes = 5;

    level = 0; // i.e. not playing

    public reset() {
        this.lifes = 5;
        this.level = 0;
    }
}

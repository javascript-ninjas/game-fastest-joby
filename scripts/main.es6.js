import {Game} from './engine/Game';

class Main {
    constructor() {
        this.game = new Game();
    }
}

let m = new Main();
m.game.setup();

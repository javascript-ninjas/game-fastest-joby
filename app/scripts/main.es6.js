import {Game} from './engine/Game';

class Main {
    constructor() {
        console.log('Main');

        this.game = new Game();
    }
}

let m = new Main();
m.game.setup();

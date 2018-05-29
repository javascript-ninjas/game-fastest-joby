import { Game } from './engine/game';

class Main {
    constructor() {
        this.game = new Game();
    }
}

const m = new Main();
m.game.setup();

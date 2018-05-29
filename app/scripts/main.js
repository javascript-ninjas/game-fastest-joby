import { Game } from './engine/game';

class Main {
    constructor() {
        this.game = new Game();
        this.game.setup();
    }
}

new Main();

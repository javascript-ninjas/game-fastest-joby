import { Loader } from './loader';
import { BootState } from './states/boot-state';
import { PreloadState } from './states/preload-state';
import { TheGameState } from './states/the-game-state';
import { GameOverState } from './states/game-over-state';
import { WinnerState } from './states/winner-state';

export class Game {
    constructor() {
        Loader.update(10);
    }

    setup() {
        Loader.update(20);
        let game = new Phaser.Game(Game.WIDTH, Game.HEIGHT, Phaser.AUTO, 'canvas');

        game.state.add('Boot', BootState);
        game.state.add('Preload', PreloadState);
        game.state.add('TheGame', TheGameState);
        game.state.add('GameOver', GameOverState);
        game.state.add('Winner', WinnerState);

        game.state.start('Boot');
        Loader.update(30);
    }
}

Game.WIDTH = 800;
Game.HEIGHT = 320;

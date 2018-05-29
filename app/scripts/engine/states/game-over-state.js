import { Game } from '../game';
import { clearGame, displayScoreBoard } from '../scope';

export class GameOverState extends Phaser.State {

    preload() {
        this.game.add.sprite(0, 0, 'game-over');

        let retryButton = this.game.add.button(Game.WIDTH / 2, Game.HEIGHT / 1.3, 'button-retry', this.retryTheGame, this);
        retryButton.anchor.setTo(0.5, 0.5);

        displayScoreBoard(this.game);
        clearGame();
    }

    retryTheGame() {
        this.game.state.start('TheGame');
    }

}

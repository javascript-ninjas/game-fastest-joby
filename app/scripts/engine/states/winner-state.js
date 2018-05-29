import { Game } from '../game';
import { clearGame, displayScoreBoard } from '../scope';

export class WinnerState extends Phaser.State {

    preload() {
        this.game.add.sprite(0, 0, 'game-winner');

        let oneMoreTimeButton = this.game.add.button(Game.WIDTH / 2, Game.HEIGHT / 1.3, 'button-retry', this.oneMoreTimeTheGame, this);
        oneMoreTimeButton.anchor.setTo(0.5, 0.5);

        displayScoreBoard(this.game);
        clearGame();
    }

    oneMoreTimeTheGame() {
        this.game.state.start('TheGame');
    }

}

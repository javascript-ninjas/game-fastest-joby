import { Game } from '../game';
import { Loader } from '../loader';

export class PreloadState extends Phaser.State {

    preload() {
        Loader.update(90);
        this.game.add.sprite(0, 0, 'game-title');

        let playButton = this.game.add.button(Game.WIDTH / 2, Game.HEIGHT / 1.3, 'button-play', this.playTheGame, this);
        playButton.anchor.setTo(0.5, 0.5);

        Loader.update(100);
        Loader.hide();
    }

    playTheGame() {
        this.game.state.start('TheGame');
    }
}

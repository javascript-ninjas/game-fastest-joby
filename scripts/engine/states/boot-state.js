import { Loader } from '../loader';

export class BootState extends Phaser.State {
    preload() {
        this.game.load.spritesheet('2-32x32', 'assets/spritesheets/2-32x32.png', 32, 32);

        Loader.update(40);
        this.game.load.image('car-1', 'assets/sprites/car-1.png', 32, 32);
        this.game.load.image('car-2', 'assets/sprites/car-2.png', 32, 32);
        Loader.update(50);

        this.game.load.image('game-title', 'assets/images/backgrounds/game-title.png');
        this.game.load.image('game-over', 'assets/images/backgrounds/game-over.png');
        this.game.load.image('game-winner', 'assets/images/backgrounds/game-winner.png');
        Loader.update(60);

        this.game.load.tilemap('map-1', 'assets/tilemaps/map-1.json', null, Phaser.Tilemap.TILED_JSON);
        Loader.update(70);

        this.game.load.image('button-play', 'assets/images/buttons/button-play.png');
        this.game.load.image('button-retry', 'assets/images/buttons/button-retry.png');
        Loader.update(80);
    }

    create() {
        setTimeout(() => {
            this.game.state.start('Preload');
        }, 1000);
    }
}

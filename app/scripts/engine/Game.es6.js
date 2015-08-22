import {Loader} from './Loader';

export class Game {
    constructor() {
        Loader.update(10);
    }

    setup() {
        Loader.update(20);
        let game = new Phaser.Game(Game.WIDTH, Game.HEIGHT, Phaser.AUTO, 'game');

        game.state.add('Boot', this.stateBoot);
        game.state.add('Preload', this.statePreload);
        game.state.add('TheGame', this.stateTheGame);
        game.state.add('GameOver', this.stateGameOver);

        game.state.start('Boot');
        Loader.update(30);
    }

    /**
     * Ładujemy wszystkie assets.
     */
    stateBoot() {
        return {
            preload() {
                this.game.load.spritesheet('2-32x32', 'assets/spritesheets/2-32x32.png', 32, 32);

                Loader.update(40);
                this.game.load.image('car-1', 'assets/sprites/car-1.png', 32, 32);
                this.game.load.image('car-2', 'assets/sprites/car-2.png', 32, 32);
                Loader.update(50);

                this.game.load.image('game-title', 'assets/images/backgrounds/game-title.png');
                this.game.load.image('game-over', 'assets/images/backgrounds/game-over.png');
                Loader.update(60);

                this.game.load.tilemap('map-1', 'assets/tilemaps/map-1.json', null, Phaser.Tilemap.TILED_JSON);
                Loader.update(70);

                this.game.load.image('button-play', 'assets/images/buttons/button-play.png');
                this.game.load.image('button-retry', 'assets/images/buttons/button-retry.png');
                Loader.update(80);
            },

            create() {
                setTimeout(() => {
                    this.game.state.start('Preload');
                }, 1000);
            }
        }
    }

    /**
     * Początkowy ekran.
     */
    statePreload() {
        return {
            preload() {
                Loader.update(90);
                this.game.add.sprite(0, 0, 'game-title');

                let playButton = this.game.add.button(Game.WIDTH / 2, Game.HEIGHT / 1.3, 'button-play', this.playTheGame, this);
                playButton.anchor.setTo(0.5, 0.5);

                Loader.update(100);
                Loader.hide();
            },

            playTheGame() {
                this.game.state.start('TheGame');
            }
        }
    }

    /**
     * Sama gra.
     */
    stateTheGame() {
        let worldLayer;
        let cursors;
        let car1;

        return {
            preload() {
                car1 = this.game.add.sprite(0, Game.HEIGHT / 2, 'car-1', 8);
                // car1.anchor.setTo(0.5, 0.5);

                cursors = this.game.input.keyboard.createCursorKeys();

                let map = this.game.add.tilemap('map-1');
                map.addTilesetImage('2-32x32');

                map.setCollisionBetween(1, 256);

                map.setTileIndexCallback(29, this._collisionWithBomb, this);
                map.setTileIndexCallback(54, this._collisionWithRedDiamond, this);
                map.setTileIndexCallback(60, this._collisionWithYellowDiamond, this);
                map.setTileIndexCallback(80, this._collisionWithPurpleRock, this);

                worldLayer = map.createLayer('Tile Layer 1');
                worldLayer.resizeWorld();
            },

            _collisionWithBomb(car1, item) {
                item.alpha = 0.2;
                worldLayer.dirty = true;
            },

            _collisionWithRedDiamond(car, item) {
                item.alpha = 0.2;
                worldLayer.dirty = true;
            },

            _collisionWithYellowDiamond(car, item) {
                item.alpha = 0.2;
                worldLayer.dirty = true;
            },

            _collisionWithPurpleRock(car, item) {
                item.alpha = 0.2;
                worldLayer.dirty = true;
            },

            create() {
                this.game.camera.follow(car1);
                this.game.physics.arcade.enable(car1);

                car1.body.collideWorldBounds = true;
            },

            update() {
                this._supportCarMove();

                this.game.physics.arcade.collide(car1, worldLayer);

                if (this.game.world.width - car1.x - car1.width <= 0) {
                    this.game.state.start('GameOver');
                }
            },

            _supportCarMove() {
                // Każdy w oddzielnym warunku, bo dajemy możliwość przytrzymania dwóch klawiszy na raz.

                if (cursors.up.isDown) {
                    car1.body.y -= 1.5;
                }

                if (cursors.down.isDown) {
                    car1.body.y += 1.5;
                }

                if (cursors.left.isDown) {
                    car1.body.x -= 2.5;
                }

                if (cursors.right.isDown) {
                    car1.body.x += 2.5;
                }
            },

            render() {
                // this.game.debug.spriteInfo(car1, 32, 32);
                // this.game.debug.body(car1);
            }
        }
    }

    /**
     * Porażka gry.
     */
    stateGameOver() {
        return {
            preload() {
                this.game.add.sprite(0, 0, 'game-over');

                let retryButton = this.game.add.button(Game.WIDTH / 2, Game.HEIGHT / 1.3, 'button-retry', this.retryTheGame, this);
                retryButton.anchor.setTo(0.5, 0.5);
            },

            retryTheGame() {
                this.game.state.start('TheGame');
            }
        }
    }
}

Game.WIDTH = 800;
Game.HEIGHT = 320;

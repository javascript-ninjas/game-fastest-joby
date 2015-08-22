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
        game.state.add('Winner', this.stateWinner);

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
                this.game.load.image('game-winner', 'assets/images/backgrounds/game-winner.png');
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
        let map;
        let worldLayer;
        let cursors;
        let car1;

        let redDiamonds;
        let redDiamondsPositions = [
            [3, 1], [7, 4], [15, 5], [22, 8], [29, 1], [44, 1], [51, 8], [64, 5], [72, 2], [89, 6], [97, 8]
        ];

        return {
            preload() {
                redDiamonds = this.game.add.group();
                this._appendRedDiamondList();

                car1 = this.game.add.sprite(0, Game.HEIGHT / 2, 'car-1');

                map = this.game.add.tilemap('map-1');
                map.addTilesetImage('2-32x32');
                map.setCollisionBetween(1, 256);

                worldLayer = map.createLayer('Tile Layer 1');
                worldLayer.resizeWorld();

                cursors = this.game.input.keyboard.createCursorKeys();
            },

            _appendRedDiamondList() {
                redDiamondsPositions.forEach((position) => {
                    let [x, y] = position;
                    redDiamonds.add(this.game.add.tileSprite(32 * x, 32 * y, 32, 32, '2-32x32', 54));
                });
                redDiamonds.enableBody = true;
            },

            create() {
                this.game.camera.follow(car1);
                this.game.physics.arcade.enable(car1);
                this.game.physics.arcade.enable(redDiamonds);

                car1.body.collideWorldBounds = true;
                car1.body.setSize(32, 22, 0, 5);
            },

            update() {
                this._supportCarMove();
                this._clearVelocity();

                this.game.physics.arcade.collide(car1, worldLayer);
                this.game.physics.arcade.collide(car1, redDiamonds, function (car, item) {
                    item.destroy();
                });

                if (this.game.world.width - car1.x - car1.width <= 0) {
                    this.game.state.start('Winner');
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

            _clearVelocity() {
                // Czyścimy prędkość
                if (!cursors.up.isDown && !cursors.down.isDown && !cursors.left.isDown && !cursors.right.isDown) {
                    car1.body.velocity.x = 0;
                }
            },

            render() {
                this.game.debug.spriteInfo(car1, 10, 50);
                this.game.debug.body(car1);
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

    /**
     * Zwycięstwo
     */
    stateWinner() {
        return {
            preload() {
                this.game.add.sprite(0, 0, 'game-winner');

                let oneMoreTimeButton = this.game.add.button(Game.WIDTH / 2, Game.HEIGHT / 1.3, 'button-retry', this.oneMoreTimeTheGame, this);
                oneMoreTimeButton.anchor.setTo(0.5, 0.5);
            },

            oneMoreTimeTheGame() {
                this.game.state.start('TheGame');
            }
        }
    }
}

Game.WIDTH = 800;
Game.HEIGHT = 320;

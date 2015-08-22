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
                Loader.update(40);
                this.game.load.spritesheet('car-1', 'images/sprites/car-1.png', 66, 66);
                this.game.load.spritesheet('car-2', 'images/sprites/car-2.png', 76, 76);
                Loader.update(50);

                this.game.load.image('game-title', 'images/backgrounds/game-title.png');
                this.game.load.image('game-over', 'images/backgrounds/game-over.png');
                Loader.update(60);

                this.game.load.image('button-play', 'images/buttons/button-play.png');
                this.game.load.image('button-retry', 'images/buttons/button-retry.png');
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
        let cursors;
        let car1;

        return {
            preload() {
                car1 = this.game.add.sprite(0, Game.HEIGHT / 2, 'car-1', 8);
                this.game.physics.enable(car1, Phaser.Physics.ARCADE);
                car1.anchor.setTo(0.5, 0.5);
                car1.body.collideWorldBounds = true;

                cursors = this.game.input.keyboard.createCursorKeys();
            },

            create() {
                setTimeout(() => {
                    this.game.state.start('GameOver');
                }, 5000);
            },

            update() {
                this._supportCarMove();
            },

            /**
             * Każdy w oddzielnym warunku - czyli dajemy możliwość przytrzymania dwóch klawiszy na raz.
             */
            _supportCarMove() {
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
                this.game.debug.spriteInfo(car1, 32, 32);
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
}

Game.WIDTH = 800;
Game.HEIGHT = 300;

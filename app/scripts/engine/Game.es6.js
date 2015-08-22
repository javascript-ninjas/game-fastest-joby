import {Loader} from './Loader';
import {Player} from './Player';

let players = [];

let displayScoreBoard = (game) => {
    let scoreText = players.map((player) => {
        return player.name + ': ' + player.score + ' points';
    });

    // score board
    game.add.text(Game.WIDTH / 2.5, Game.HEIGHT / 2.5, scoreText, { fontSize: '24px', fill: '#fff' });
};

let clearGame = () => {
    players.forEach((player, index) => {
        player.getSprite().destroy();
        delete players[index];
    });

    players = [];
};

let appendList = (game, positions, group, index) => {
    positions.forEach((position) => {
        let [x, y] = position;
        group.add(game.add.tileSprite(32 * x, 32 * y, 32, 32, '2-32x32', index));
    });
    group.enableBody = true;
};

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

    stateBoot() {
        // Ładujemy wszystkie assets.
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

    statePreload() {
        // Początkowy ekran.
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

    stateTheGame() {
        // Sama gra.
        let map;
        let worldLayer;
        let cursors;
        let car1;

        let diamondsGroup;
        let diamondsPositions = [
            [3, 1], [7, 4], [15, 5], [22, 8], [29, 1], [44, 1], [51, 8], [64, 5], [72, 2], [89, 6], [97, 8]
        ];
        let goldGroup;
        let goldPositions = [
            [4, 8], [20, 1], [45, 8], [57, 1], [77, 3], [99, 2]
        ];

        return {
            preload() {
                console.clear();

                diamondsGroup = this.game.add.group();
                goldGroup = this.game.add.group();

                appendList(this.game, diamondsPositions, diamondsGroup, 54);
                appendList(this.game, goldPositions, goldGroup, 59);

                car1 = new Player('Car #1', this.game);
                players.push(car1);

                map = this.game.add.tilemap('map-1');
                map.addTilesetImage('2-32x32');
                map.setCollisionBetween(1, 256);

                worldLayer = map.createLayer('Tile Layer 1');
                worldLayer.resizeWorld();

                cursors = this.game.input.keyboard.createCursorKeys();
            },

            create() {
                this.game.camera.follow(car1.getSprite());
                this.game.physics.arcade.enable(car1.getSprite());
                this.game.physics.arcade.enable(diamondsGroup);
                this.game.physics.arcade.enable(goldGroup);

                car1.updateBody();
                car1.refreshScore();
            },

            update() {
                car1.supportCarMove(cursors);
                car1.clearVelocity(cursors);

                this.game.physics.arcade.collide(car1.getSprite(), worldLayer);
                this.game.physics.arcade.collide(car1.getSprite(), diamondsGroup, (car, item) => {
                    item.destroy();

                    car1.score += 10;
                    car1.refreshScore();
                });
                this.game.physics.arcade.collide(car1.getSprite(), goldGroup, (car, item) => {
                    item.destroy();

                    car1.score += 50;
                    car1.refreshScore();
                });

                if (this.game.world.width - car1.getSprite().x - car1.getSprite().width <= 0) {
                    this.game.state.start('Winner');
                }
            },

            render() {
                // this.game.debug.spriteInfo(car1, 10, 50);
                // this.game.debug.body(car1);
            }
        }
    }

    stateGameOver() {
        // Porażka gry.
        return {
            preload() {
                this.game.add.sprite(0, 0, 'game-over');

                let retryButton = this.game.add.button(Game.WIDTH / 2, Game.HEIGHT / 1.3, 'button-retry', this.retryTheGame, this);
                retryButton.anchor.setTo(0.5, 0.5);

                displayScoreBoard(this.game);
                clearGame();
            },

            retryTheGame() {
                this.game.state.start('TheGame');
            }
        }
    }

    stateWinner() {
        // Zwycięstwo
        return {
            preload() {
                this.game.add.sprite(0, 0, 'game-winner');

                let oneMoreTimeButton = this.game.add.button(Game.WIDTH / 2, Game.HEIGHT / 1.3, 'button-retry', this.oneMoreTimeTheGame, this);
                oneMoreTimeButton.anchor.setTo(0.5, 0.5);

                displayScoreBoard(this.game);
                clearGame();
            },

            oneMoreTimeTheGame() {
                this.game.state.start('TheGame');
            }
        }
    }
}

Game.WIDTH = 800;
Game.HEIGHT = 320;

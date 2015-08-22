import {Loader} from './Loader';
import {Player} from './models/Player';
import {Enemy} from './models/Enemy';

let players = [];

let displayScoreBoard = (game) => {
    // Sortujemy po liczbie punktów, aby zwycięzca był pierwszy.
    players = players.sort(function (player) {
        return player.score;
    });

    let scoreText = players.map((player, index) => {
        return `${index + 1}. ${player.name}: ${player.score} points`;
    });

    // Score Board
    game.add.text(Game.WIDTH - 300, 40, scoreText.join("\n"), { fontSize: '24px', fill: '#fff' });
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
        let game = new Phaser.Game(Game.WIDTH, Game.HEIGHT, Phaser.AUTO, 'canvas');
        game.stage.backgroundColor = 0x000000;

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
        let car1;
        let car2;

        let diamondsGroup;
        let diamondsPositions = [
            [3, 1], [7, 4], [15, 5], [22, 8], [29, 1], [44, 1], [51, 8], [64, 5], [72, 2], [89, 6], [97, 8]
        ];
        let goldGroup;
        let goldPositions = [
            [4, 8], [20, 1], [45, 8], [57, 1], [77, 3], [99, 2]
        ];
        let bombsGroup;
        let bombsPositions = [
            [8, 8], [21, 4], [56, 8]
        ];

        return {
            preload() {
                console.clear();

                diamondsGroup = this.game.add.group();
                goldGroup = this.game.add.group();
                bombsGroup = this.game.add.group();

                appendList(this.game, diamondsPositions, diamondsGroup, 79);
                appendList(this.game, goldPositions, goldGroup, 171);
                appendList(this.game, bombsPositions, bombsGroup, 28);

                map = this.game.add.tilemap('map-1');
                map.addTilesetImage('2-32x32');
                map.setCollisionBetween(1, 256);

                worldLayer = map.createLayer('Tile Layer 1');
                worldLayer.resizeWorld();
            },

            create() {
                this.game.physics.arcade.enable(diamondsGroup);
                this.game.physics.arcade.enable(goldGroup);
                this.game.physics.arcade.enable(bombsGroup);

                // ---

                car1 = new Player(this.game);
                players.push(car1);

                this.game.camera.follow(car1.getSprite());
                this.game.physics.arcade.enable(car1.getSprite());
                car1.updateBody();
                car1.refreshScore();

                // ---

                car2 = new Enemy(this.game);
                players.push(car2);

                this.game.camera.follow(car2.getSprite());
                this.game.physics.arcade.enable(car2.getSprite());
                car2.updateBody();
                car2.refreshScore();
            },

            applyRules(player) {
                let cursors = player.getControl();

                player.supportCarMove(cursors);
                player.clearVelocity(cursors);

                this.game.physics.arcade.collide(player.getSprite(), worldLayer);
                this.game.physics.arcade.collide(player.getSprite(), diamondsGroup, (car, item) => {
                    item.destroy();

                    player.score += 10;
                    player.refreshScore();
                });
                this.game.physics.arcade.collide(player.getSprite(), goldGroup, (car, item) => {
                    item.destroy();

                    player.score += 50;
                    player.refreshScore();
                });
                this.game.physics.arcade.collide(player.getSprite(), bombsGroup, (car, item) => {
                    item.destroy();
                    this.game.state.start('GameOver');
                });

                if (this.game.world.width - player.getSprite().x - player.getSprite().width <= 0) {
                    this.game.state.start('Winner');
                }
            },

            update() {
                this.applyRules(car1);
                this.applyRules(car2);
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

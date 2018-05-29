import { Player } from '../models/player';
import { Enemy } from '../models/enemy';
import { players, appendList } from '../scope';

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

export class TheGameState extends Phaser.State {

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
    }

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
    }

    applyRules(player) {
        let cursors = player.getControl();

        player.supportCarMove(cursors);

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
    }

    update() {
        this.applyRules(car1);
        this.applyRules(car2);
    }
}

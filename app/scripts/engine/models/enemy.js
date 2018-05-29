import { AbstractPlayer } from './abstract-player';

export class Enemy extends AbstractPlayer {
    constructor(game) {
        super(...Array.prototype.slice.call(arguments));

        this.name = 'Enemy';
        this.spriteName = 'car-1';
        this.scorePosition = [600, 5];

        this._setupSprite();

        console.info('new Enemy()');
    }

    getControl() {
        let cursors2 = this.game.input.keyboard.createCursorKeys();

        cursors2.up = this.game.input.keyboard.addKey(Phaser.Keyboard.W);
        cursors2.down = this.game.input.keyboard.addKey(Phaser.Keyboard.S);
        cursors2.left = this.game.input.keyboard.addKey(Phaser.Keyboard.A);
        cursors2.right = this.game.input.keyboard.addKey(Phaser.Keyboard.D);

        return cursors2;
    }
}

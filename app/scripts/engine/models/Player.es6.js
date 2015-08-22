import {AbstractPlayer} from './AbstractPlayer';

export class Player extends AbstractPlayer {
    constructor(game) {
        super(...Array.prototype.slice.call(arguments));

        this.name = 'Player';
        this.spriteName = 'car-2';
        this.scorePosition = [20, 5];

        this._setupSprite();

        console.info('new Player()');
    }

    getControl() {
        return this.game.input.keyboard.createCursorKeys();
    }
}

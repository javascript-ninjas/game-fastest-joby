export class AbstractPlayer {
    constructor(game) {
        this.score = 0;
        this.game = game;
    }

    getSprite() {
        return this._sprite;
    }

    _setupSprite() {
        this._sprite = this.game.add.sprite(0, 160, this.spriteName);
    }

    updateBody() {
        this._sprite.body.collideWorldBounds = true;
        this._sprite.body.setSize(32, 22, 0, 5);

        this._scoreText = this.game.add.text(...this.scorePosition, '', { fontSize: '16px', fill: '#fff' });
        this._scoreText.fixedToCamera = true;
        this._scoreText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 5);
    }

    refreshScore() {
        this._scoreText.setText(`${this.name} score: ${this.score} points`);
    }

    supportCarMove(cursors) {
        // Każdy w oddzielnym warunku, bo dajemy możliwość przytrzymania dwóch klawiszy na raz.
        if (cursors.up.isDown) {
            this._sprite.body.y -= 2.5;
        }

        if (cursors.down.isDown) {
            this._sprite.body.y += 2.5;
        }

        if (cursors.left.isDown) {
            this._sprite.body.x -= 3.5;
        }

        if (cursors.right.isDown) {
            this._sprite.body.x += 3.5;
        }
    }
}

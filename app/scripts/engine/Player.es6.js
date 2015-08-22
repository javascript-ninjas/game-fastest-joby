export class Player {
    constructor(name, game) {
        this.score = 0;
        this.name = name;
        this.game = game;

        this._setupSprite();

        console.info('new Player(%s)', name);
    }
    
    getSprite() {
        return this._sprite;
    }

    _setupSprite() {
        this._sprite = this.game.add.sprite(0, 160, 'car-1');
    }
    
    updateBody() {
        this._sprite.body.collideWorldBounds = true;
        this._sprite.body.setSize(32, 22, 0, 5);

        this._scoreText = this.game.add.text(20, 5, '', { fontSize: '16px', fill: '#fff' });
        this._scoreText.fixedToCamera = true;
        this._scoreText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 5);
    }

    refreshScore() {
        this._scoreText.setText('Score: ' + this.score + ' points');
    }

    supportCarMove(cursors) {
        // Każdy w oddzielnym warunku, bo dajemy możliwość przytrzymania dwóch klawiszy na raz.
        if (cursors.up.isDown) {
            this._sprite.body.y -= 1.5;
        }

        if (cursors.down.isDown) {
            this._sprite.body.y += 1.5;
        }

        if (cursors.left.isDown) {
            this._sprite.body.x -= 2.5;
        }

        if (cursors.right.isDown) {
            this._sprite.body.x += 2.5;
        }
    }

    clearVelocity(cursors) {
        // Czyścimy prędkość
        if (!cursors.up.isDown && !cursors.down.isDown && !cursors.left.isDown && !cursors.right.isDown) {
            this._sprite.body.velocity.x = 0;
        }
    }
}

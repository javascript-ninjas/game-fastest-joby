import { Game } from './game';

export let players = [];

export let displayScoreBoard = (game) => {
    // Sortujemy po liczbie punktów, aby zwycięzca był pierwszy.
    players = players.sort(function (player1, player2) {
        if (player1.score < player2.score) {
            return 1;
        } else if (player1.score > player2.score) {
            return -1;
        } else {
            return 0;
        }
    });

    let scoreText = players.map((player, index) => {
        return `${index + 1}. ${player.name}: ${player.score} points`;
    });

    // Score Board
    game.add.text(Game.WIDTH - 300, 40, scoreText.join('\n'), {
        fontSize: '24px',
        fill: '#fff'
    });
};

export let clearGame = () => {
    players.forEach((player, index) => {
        player.getSprite().destroy();
        delete players[index];
    });

    players = [];
};

export let appendList = (game, positions, group, index) => {
    positions.forEach((position) => {
        let [x, y] = position;
        group.add(game.add.tileSprite(32 * x, 32 * y, 32, 32, '2-32x32', index));
    });
    group.enableBody = true;
};

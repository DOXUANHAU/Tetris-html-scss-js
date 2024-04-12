const tetris = new TetrisGame(ctx);

let startAudio = document.querySelector('#startAudio');
let completeAudio = document.querySelector('#complete');
let overtAudio = document.querySelector('#gameOver');
let pop = document.querySelector('#pop');
let winner = document.querySelector('#winner');

document.querySelector('.play').addEventListener('click', (e) => {
    tetris.startGame();
    tetris.controller();
});


let pause = 1;
document.querySelector('.pause').addEventListener('click', (e) => {
    if (pause % 2 === 1) {
        tetris.pauseGame(true);
        console.log(pause)
    } else {

        tetris.pauseGame(false);
    }
    pause++;
});

document.querySelector('.destroy').addEventListener('click', () => {
    tetris.gameReplay();
});
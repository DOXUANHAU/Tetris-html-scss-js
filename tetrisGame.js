class TetrisGame {
    constructor(ctx) {
        this.gameOver = false;
        this.board = new Board(ctx);
        this.arrProcess = new ArrayProcess();
        this.tetroManager = new Tetrominoes();
        this.x = 3;
        this.y = -2;
        this.activeTetro = this.tetroManager.getRandomTetromino();
        this.arrData = this.arrProcess.generateGridNumLayout();
        this.score = 0;
        this.myInterval = undefined;
        // biến xử lí time
        this.time = new Date();
        this.startTime = 0;
        this.timeLoop = 0;
        this.timeInterval = undefined;
    }


    keyUpAction() {
        // lấy ra next Pattern sau khi rotate activeTetro
        let tetroFutureShape = this.arrProcess.rotate(this.activeTetro.shape);

        // kiểm tra collision tại x,y hiện tại sau khi rotate có bị xung đột collision ko
        let kick = 0;
        if (this.arrProcess.collision(this.x, this.y, tetroFutureShape, this.arrData)) {
            if (this.x > BOARD_WIDTH / 2) {
                kick = -1;
            } else {
                kick = 1;
            }
        }

        // kiễm tra xung đột collision tại kick và y sau khi rotate
        if (!this.arrProcess.collision(this.x + kick, this.y, tetroFutureShape, this.arrData)) {
            this.board.clear();
            this.x += kick;
            this.activeTetro.shape = this.arrProcess.rotate(this.activeTetro.shape);
            this.board.drawBoard(this.arrData);
            this.board.drawTetrominoAt(this.x, this.y, this.activeTetro);
        }
    }

    moveDown() {
        // check collision nhận vào giá trị tùy theo sự kiện để có thể lấy ra giá trị x,ty tưởng lai
        if (!this.arrProcess.collision(this.x, this.y + 1, this.activeTetro.shape, this.arrData)) {
            this.board.clear();
            this.y += 1;

            this.board.drawBoard(this.arrData);
            this.board.drawTetrominoAt(this.x, this.y, this.activeTetro);
        } else {
            this.gameOver = this.arrProcess.updateDataIntoArrData(this.x, this.y, this.activeTetro.shape, this.activeTetro.color, this.arrData);
            this.updateData();
            this.x = 3;
            this.y = -2;
            this.activeTetro = this.tetroManager.getRandomTetromino();
            this.board.clear();
            this.board.drawBoard(this.arrData);
            this.board.drawTetrominoAt(this.x, this.y, this.activeTetro);
        }
    }

    moveLeft() {
        if (!this.arrProcess.collision(this.x - 1, this.y + 0, this.activeTetro.shape, this.arrData)) {
            this.board.clear();
            this.x -= 1;
            this.board.drawBoard(this.arrData);
            this.board.drawTetrominoAt(this.x, this.y, this.activeTetro);
        }
    }

    moveRight() {
        if (!this.arrProcess.collision(this.x + 1, this.y + 0, this.activeTetro.shape, this.arrData)) {
            this.board.clear();
            this.x += 1;
            this.board.drawBoard(this.arrData);
            this.board.drawTetrominoAt(this.x, this.y, this.activeTetro);
        }
    }


    startGame() {
        startAudio.currentTime = 10;
        startAudio.play();
        this.board.drawBoard(this.arrData);
        this.startTimer();
        this.myInterval = setInterval(() => {
            this.moveDown();
        }, 1000);
    }

    controller() {
        document.addEventListener('keydown', (e) => {
            switch (e.keyCode) {
                case 38:
                    //         up
                    this.keyUpAction();
                    break;
                case 39:
                    this.moveRight();
                    break;
                case 40:
                    this.moveDown();
                    break;
                case 37:
                    this.moveLeft();
                    break;
            }
        });
    }

    updateData() {
        if (this.gameOver) {
            this.pauseGame(true);
            startAudio.pause();
            overtAudio.play();
            clearInterval(this.myInterval);
            clearInterval(this.timeInterval);


        }
        let newScore = this.arrProcess.getScoreAfterMoveDown(this.arrData);
        if (this.score >= 100) {
            this.pauseGame(true);
            startAudio.pause();
            winner.play();
        }
        if (newScore > 0) {
            completeAudio.play();
            this.score += (newScore * 10);
            this.updateScore(this.score);
        }
        this.arrData = this.arrProcess.updateBoardAfterMoveDown(this.arrData);

    }

    updateScore(score) {
        document.querySelector('#score__show').innerHTML = score + " / 100";
    }


    pauseGame(pasue) {

        if (pasue) {
            clearInterval(this.myInterval);
            clearInterval(this.timeInterval);

        } else {
            this.myInterval = setInterval(() => {
                this.moveDown();
            }, 1000);
            this.timeInterval = setInterval(() => {
                let currentTime = new Date().getTime();
                pop.play();
                this.timeLoop = currentTime - this.startTime;
                let display = timeDisplay(this.timeLoop);
                document.querySelector('#time__show').innerHTML = display + "";
            }, 1000);
        }
    }

    startTimer() {
        this.startTime = this.time.getTime();
        this.timeInterval = setInterval(() => {
                let currentTime = new Date().getTime();
                this.timeLoop = currentTime - this.startTime;
                let display = timeDisplay(this.timeLoop);
                pop.play();
                document.querySelector('#time__show').innerHTML = display + "";
            },
            1000);
    }

    gameReplay() {
        clearInterval(this.myInterval);
        clearInterval(this.timeInterval);
        this.arrData = this.arrProcess.generateGridNumLayout();
        this.y = -1;
        this.x = 3;     
        this.startGame();
    }

}

function timeDisplay(milisc) {

    // Chuyển đổi thời gian từ milliseconds sang giờ, phút và giây
    let hours = Math.floor(milisc / 3600000);
    let minutes = Math.floor((milisc % 3600000) / 60000);
    let seconds = Math.floor((milisc % 60000) / 1000);

    // Hiển thị thời gian bấm giờ trong định dạng chuỗi

    return hours.toString().padStart(2, '0') + ':' +
        minutes.toString().padStart(2, '0') + ':' +
        seconds.toString().padStart(2, '0');
}


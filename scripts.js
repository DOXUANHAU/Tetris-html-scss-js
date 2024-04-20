const BOARD_WIDTH = 10; // độ rộng
const BOARD_HEIGHT = 16;//độ dài
const CELL_SIZE = 24; // kích cỡ khối ô vuông
const canvas = document.querySelector('.board');
const CELL_FILL = {num :0,color : "black"}; // object chứa 1 ô trống
const ctx = canvas.getContext('2d');
ctx.canvas.width = BOARD_WIDTH * CELL_SIZE;
ctx.canvas.height = BOARD_HEIGHT * CELL_SIZE;
let timePlayLoop = 900; // tốc độ rơi của khối tetro

// các audio
let startAudio = document.querySelector('#startAudio');
let completeAudio = document.querySelector('#complete');
let overtAudio = document.querySelector('#gameOver');
let pop = document.querySelector('#pop');
let winner = document.querySelector('#winner');


let level_show = document.querySelector('#level__show');
// xong khai báo các elemnt của game và giao diện

// ARRAYPROCESS CLASS
class ArrayProcess {
    constructor() {
    }

    // method  để kiễm tra xung đột collision
    collision(x, y, shape, arrData) {

        //     duyêt shape
        for (let row = 0; row < shape.length; row++) {
            //kiem tra cot dau tien co rong hay k
            for (let col = 0; col < shape[row].length; col++) {
                //     kiễm tra arrData tại row col c tồn ta ko
                if (shape[row][col] !== 0) {
//     lấy ra giá trị x và y ở tương lại để kiểm tra
                    let xFuture = x + col;
                    let yFuture = y + row;
// nếu xFture nhở hơn 0 thì tức nó sẽ ra ngaoif board trái => return true
// nếu xFture >= BOARD_WIDTH thì tức nó sẽ ra ngaoif board phải => return true
// nếu yFuture > BOARD_WIDTH tức là nó đã ra ngoài board dưới => return true
                    if (xFuture < 0 || xFuture >= BOARD_WIDTH || yFuture >= BOARD_HEIGHT) {
                        return true;
                    }

                    // yFuture < 0 vãn continue vì bắt đầu chạy sẽ băt sđầu từ y < 0
                    if (yFuture < 0) {
                        continue;
                    }
                    if (yFuture > BOARD_HEIGHT || arrData[yFuture][xFuture].num !== 0) {
                        console.log()
                        return true;
                    }

                }


            }
        }
        return false;
    }

    // method để xoay 1 tetromino 90deg từ theo chiều kim đồng hồ
    rotate(arr) {
        let m = arr.length;// độ rộng mảng
        let n = arr[0].length; // độ dài mảng
        let r = [];
        // tạo r có n phần tử thứ i là 1 mảng có độ dài m
        for (let i = 0; i < n; i++) {
            r[i] = new Array(m).fill(undefined);
        }

        for (let i = 0; i < m; i++) {
            for (let j = 0; j < n; j++) {
                //phần tử được xoay của a[i][j] là [j][m -1 - i]
                r[j][m - 1 - i] = arr[i][j];
            }
        }
        return r;
    }

    // method để tạo 1 2d array đc fill bằng 1 object { num :0 ,color :'black'}
    generateGridNumLayout() {
        return Array.from({length: BOARD_HEIGHT}, () => Array(BOARD_WIDTH).fill(CELL_FILL));

    }

//     method để cập nhật giá trị của shape active sau khi hoàn thành moveDown
    isGameOver(x, y, shape) {
        for (let row = 0; row < shape.length; row++) {
            for (let col = 0; col < shape[row].length; col++) {
                // check da game ove chưa
                if (y + row <= 0) {
                    return true;
                }
            }
        }
        return false;

    }

    // phương thức để thêm 1 object tại vị trí x,y trong arr
    addCellIntoArr(x, y, num, color, arr) {
        let cellFill = {...arr[x][y]};
        cellFill.num = num;
        cellFill.color = color;
        // Cập nhật đối tượng mới vào mảng arrData
        arr[x][y] = cellFill;
        return arr;
    }

    //method để thêm 1 tetro obj vào trong arrData tại vị trí x v y
    addTetroIntoBoardArray(x, y, shape, color, arrData) {
        for (let row = 0; row < shape.length; row++) {
            for (let col = 0; col < shape[row].length; col++) {
                //cập nhật tetro vào trong arrData
                if (shape[row][col] !== 0) {
                    arrData = this.addCellIntoArr(y + row, x + col, shape[row][col], color, arrData);
                }
            }
        }
        return arrData;
    }

    getScoreAfterMoveDown(arrData) {
        // duyệt qua từng hàng và từng item tỏng hàng nếu hàng đóa thão mẵng diều diện th bỏ vào rừullValid
        // lấy ra nhữn hàng dduojc fill
        const rowFullValid = arrData.filter((row) => {
            return row.every(cell => {
                return cell.num !== CELL_FILL.num && cell.color !== CELL_FILL.color;
            });
        });
        //nếu tồn tại rowFullvlaid cậpnhật điểm
        return rowFullValid.length;

    }

    updateBoardAfterGetScore(arrData) {
        //lấy ra những hàng chauw đc fill
        const rowFullInvalid = arrData.filter((row) => {
            return row.some(cell => {
                return cell.num === CELL_FILL.num && cell.color === CELL_FILL.color;
            });
        });
        // taọ hàng mới bằng số lượng hàng đã hoàn thành
        const newRow = Array.from({length: BOARD_HEIGHT - rowFullInvalid.length}, () => Array(BOARD_WIDTH).fill(CELL_FILL));
        //     trả về 1 board arr mới với newRow được đua lên trc rowFullInvald đc đưa xuống dưới
        return [...newRow, ...rowFullInvalid];
    }


    // phương thức trả về vị trí ngẫu nhiên cho 1 ô vuông
    setUpTetroForSecondLevel(tetro, arrData) {
// duyệt arrData
        for (let i = arrData.length - 5; i < arrData.length; i++) {

            for (let j = 0; j < arrData[i].length; j++) {

                // vẽ những ô tại đó i + j % 2 là số lẻ
                if ((i + j) % 2 === 0) {
                    arrData = this.addCellIntoArr(i, j, tetro[0], tetro.color, arrData);
                }

            }
        }

        return arrData;
    }


    // phương thức tạo hàng cuối cùng và xóa hàng đầu tiên
    setUpTetroForThirdLevel(count, tetro, arrData) {
        // tọa hàng cuối cùng
        let list = Array(BOARD_WIDTH).fill(CELL_FILL);
        for (let i = 0; i < list.length; i++) {
            if ((count + i) % 2 === 0) {
                list[i] = {num: tetro.shape[0], color: tetro.color};
            }
        }
        // loại bỏ hàng đầu tiên để thêm 1 hàng va cuois cùng
        // arrData.shift();
        arrData.shift();
        return [...arrData, ...[list]];

    }


}

// END ARRAYPROCESS CLASS
// TETRO CLASS
class Tetrominoes {
    constructor() {
        this.tetrominoesManager = this.createShapeTetrominoes();
    }
    // hàm return cac khối tetro
    createShapeTetrominoes() {
        return [
            {shape: [[0, 0, 0, 0], [0, 1, 1, 0], [0, 1, 1, 0], [0, 0, 0, 0]], color: 'red'},
            {shape: [[0, 2, 0], [2, 2, 2], [0, 0, 0]], color: 'blue'},
            {shape: [[0, 3, 3], [3, 3, 0], [0, 0, 0]], color: 'yellow'},
            {shape: [[4, 4, 0], [0, 4, 4], [0, 0, 0]], color: 'orange'},
            {shape: [[0, 5, 0], [0, 5, 0], [5, 5, 0]], color: 'green'},
            {shape: [[0, 6, 0], [0, 6, 0], [0, 6, 6]], color: '#ff6400'},
            {shape: [[0, 7, 0, 0], [0, 7, 0, 0], [0, 7, 0, 0], [0, 7, 0, 0]], color: '#00b5ff'}
        ];

    }

    //hàm tạo khối tetro cho level 2 trở đii
    createShapeRandomForLevel2() {
        return {shape: [8], color: 'white'}
    }

    // hàm tạo 1 khối tetro ngẫu nhiên
    getRandomTetromino() {
        let ranIndex = Math.floor(Math.random() * this.tetrominoesManager.length);
        return this.tetrominoesManager[ranIndex];
    }
}
// END TETRO CLASS
// BOARD CLASS
class Board {
    constructor(ctx) {
        this.ctx = ctx;
    }
    clear() {
        this.ctx.clearRect(0, 0, BOARD_WIDTH * CELL_SIZE, BOARD_HEIGHT * CELL_SIZE);
    }

    //method để vẽ board game

    drawBoard(arrData) {
        this.clear();
        this.ctx.beginPath();
        for (let col = 0; col < arrData.length; col++) {
            for (let row = 0; row < arrData[col].length; row++) {
                // vẽ tại x , y những duyệt là theo y , x
                this.drawCell(row, col,arrData[col][row].color);
            }
        }
        this.drawLineBoard();
        this.ctx.closePath();
    }

// method để vẽ 1 ô trên board
    drawCell(xAxis, yAxis, color) {
        this.ctx.fillStyle = color || 'black';
        this.ctx.fillRect(xAxis * CELL_SIZE, yAxis * CELL_SIZE, CELL_SIZE, CELL_SIZE);
        this.ctx.strokeStyle ='black';
        this.ctx.strokeRect(xAxis*CELL_SIZE,yAxis*CELL_SIZE,CELL_SIZE,CELL_SIZE);
    }

    // method đê vẽ những đường line trên board
    drawLineBoard() {
        this.ctx.strokeStyle = 'white';
        // vẽ đường line ngang của board
        for (let row = 0; row < BOARD_HEIGHT; row++) {
            this.ctx.moveTo(0, row * CELL_SIZE);
            this.ctx.lineTo(BOARD_WIDTH * CELL_SIZE, row * CELL_SIZE);

        }


        // vẽ đường line dọc của board
        for (let col = 0; col < BOARD_WIDTH; col++) {
            this.ctx.moveTo(col * CELL_SIZE, 0);
            this.ctx.lineTo(col * CELL_SIZE, BOARD_HEIGHT * CELL_SIZE)
        }

        this.ctx.lineWidth = 5 + 'px';
        this.ctx.stroke();
    }

    // method để vẽ khối brick tại vị tri x , y trên array
    drawTetrominoAt(x, y, tetro) {
        let shape = tetro.shape
        let color = tetro.color
        for (let row = 0; row < shape.length; row++) {
            for (let col = 0; col < shape[row].length; col++) {
                if (shape[row][col] !== 0) {
                    // vẽ từng cell của 1 tetro
                    this.drawCell(x + col, y + row, color);
                }
            }
        }
    }


}
// END BOAD CLASS
// TETRIS GAME CLASS
class TetrisGame {
    constructor(ctx) {
        this.gameLevel = 1;
        this.gameOver = false;
        this.board = new Board(ctx);
        // phần tử xử lí các dữ liệu về arr
        this.arrProcess = new ArrayProcess();
        // phần tử xử lí các dử liệu về tetro
        this.tetroManager = new Tetrominoes();
        // tọa độ khibatwst đàu rơi của 1 khối hình
        this.x = 3;
        this.y = -2;
        this.activeTetro = this.tetroManager.getRandomTetromino();
        this.arrData = this.arrProcess.generateGridNumLayout();
        this.score = 0;
        // interval để xử lí thời gian chạy
        this.timeInterval = undefined;
        // inteval để xử lí các game trong các level
        this.levelInterval = undefined;
        //interval để điều chinỉnh tốc độ ro của các khối tetro
        this.myInterval = undefined;
        // biến xử lí time
        this.timeLoop = 0; //dùng để lấy thơi gian cho từng giây
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
            this.x += kick;
            this.activeTetro.shape = this.arrProcess.rotate(this.activeTetro.shape);
            this.board.drawBoard(this.arrData);
            this.board.drawTetrominoAt(this.x, this.y, this.activeTetro);
        }
    }

    moveDown() {
        // check collision nhận vào giá trị tùy theo sự kiện để có thể lấy ra giá trị x,ty tưởng lai
        if (this.arrProcess.collision(this.x, this.y + 1, this.activeTetro.shape, this.arrData)) {
            // kiểm tra gameOver chưa
            this.gameOver = this.arrProcess.isGameOver(this.x, this.y, this.activeTetro.shape);
            // cập nhât board vào trong arrData
            this.arrData = this.arrProcess.addTetroIntoBoardArray(this.x, this.y, this.activeTetro.shape, this.activeTetro.color, this.arrData)
            // cập nhật trạngthaisis game
            this.updateStatusGame();
            this.activeTetro = this.tetroManager.getRandomTetromino();
            this.x = 3;
            this.y = -2;
            this.board.drawBoard(this.arrData);
            this.board.drawTetrominoAt(this.x, this.y, this.activeTetro);
        } else {
            this.y += 1;
            this.board.drawBoard(this.arrData);
            this.board.drawTetrominoAt(this.x, this.y, this.activeTetro);
            this.updateStatusGame();
        }

    }

    moveLeft() {
        // kiểm tra khi di chuyển sang trais cod bị đụng hay ko
        if (!this.arrProcess.collision(this.x - 1, this.y, this.activeTetro.shape, this.arrData)) {
            this.x -= 1;
            this.board.drawBoard(this.arrData);
            this.board.drawTetrominoAt(this.x, this.y, this.activeTetro);
        }
    }

    moveRight() {
        // kiểm tra khi di chuyển sang phải cod bị đụng hay ko
        if (!this.arrProcess.collision(this.x + 1, this.y, this.activeTetro.shape, this.arrData)) {
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
        // bắt đầu thời gian rơi của khối tetro mối giây tùy theo biến timePlay
        this.myInterval = setInterval(() => {
            this.moveDown();
            // pop.play();
        }, timePlayLoop);
    }

    controller() {
        document.addEventListener('keydown', (e) => {
            switch (e.key) {
                case `ArrowUp`:
                    //         up
                    this.keyUpAction();
                    break;
                case `ArrowRight`:
                    this.moveRight();
                    break;
                case `ArrowDown`:
                    this.moveDown();
                    break;
                case `ArrowLeft`:
                    this.moveLeft();
                    break;
                case 'm':
                    this.muted(true);

            }
        });
    }


    updateStatusGame() {
        // nến đủ điểm game dừng còn ko thì cứ tiếp tục
        if (this.score >= 100) { // level 1 đủ 100 điểm dừng và chuyển sang level tieep theo
            this.pauseGame(true);
            startAudio.pause();
            winner.play();
            showNotifications(this.gameOver);

        }
        // xử lí khi có điểm nếu gameOver = false trò chơi kết thúc
        if (this.gameOver) {
            this.pauseGame(true);
            startAudio.pause();
            overtAudio.play();
            showNotifications(this.gameOver);
        }

        //kiểm tra điểm nếu lơn hơn 0 thì cập nhật
        let newScore = this.arrProcess.getScoreAfterMoveDown(this.arrData);
        if (newScore > 0) {
            completeAudio.play();
            this.score += (newScore * 10);
            this.updateScore(this.score);
            this.arrData = this.arrProcess.updateBoardAfterGetScore(this.arrData);
        }
    }

    updateScore(score) {
        document.querySelector('#score__show').innerHTML = score + " / 100";
    }

    // hàm xử lí dừng game
    pauseGame(pasue) {
        // nếu pause = true thì clear các setInterval để tạm dùng game
        // ngược lại tạo interval mới
        if (pasue) {
            clearInterval(this.myInterval);
            clearInterval(this.timeInterval);
        } else {
            this.startTimer();
            this.myInterval = setInterval(() => {
                this.moveDown();
            }, timePlayLoop);

        }
    }


    // hàm xử lí thời gian chạy từng giây
    startTimer() {
        this.timeInterval = setInterval(() => {
            //lấy thời gian từ timeloop display để đưa vào html
            this.timeLoop += 1;
            let display = timeDisplay(this.timeLoop);
            document.querySelector('#time__show').innerHTML = display + "";

        }, 1000);
    }


    // hàm reset lại game bắt đầu chơi

    gameReplay() {
        clearInterval(this.myInterval);
        clearInterval(this.timeInterval);
        this.gameOver = false;
        this.score = 0;
        this.timeLoop = 0;
        this.y = -2;
        this.arrData = this.arrProcess.generateGridNumLayout();
        this.updateScore(this.score);
        this.startGame();
    }

//    hàm sử lí tắt âm thanh
    muted(muted) {
        if (muted) {
            changeMuteStatus(startAudio);
            changeMuteStatus(pop);
        } else {
            startAudio.currentTime = 10;
            changeMuteStatus(startAudio);
            changeMuteStatus(pop);

        }
    }

    changeLevel(level) {

        switch (level) {
            case 1:
                clearInterval(this.levelInterval);
                this.gameReplay();
                this.gameLevel = level;
                break;
            case 2:
                clearInterval(this.levelInterval);
                this.gameReplay();
                this.gameLevel = level;
                // level 2 sẽ có thêm những ô được xuất hiện trông mỗi hàng từ hàng thứ BOARD_HEIGHT - 5
                this.secondLevel();
                break;
            case 3:
                clearInterval(this.levelInterval);
                this.gameReplay();
                this.gameLevel = level;
                // level 3 cứ mối 15s là sẽ có thêm 1 hàng đc thêm vào dưới cuối cùng
                let count = 0;
                this.levelInterval = setInterval(() => {
                    this.thirdLevel(count);
                    count++;
                    if (this.gameOver) {
                        clearInterval(this.levelInterval);
                    }
                }, 15000);
                break;
            case 4:
                clearInterval(this.levelInterval);
                this.gameReplay();
                this.gameLevel = level;
                // level 4 khi đang di chuyển tới giữamafanf hình  đc random vị trí
                this.levelInterval = setInterval(() => {
                    if (this.y === 5) {
                        this.fourLevel();
                    }
                }, 0);
                break;
            case 5:
                clearInterval(this.levelInterval);
                this.gameReplay();
                this.gameLevel = level;
                let disapperList = undefined; // mảng để lưu những tetro đã đc đưa vào mảng
                // biến để kiểm tra trang thái thay đổi màu nếu lẽ thì đổi nêếu chẵng thì hiện
                let countDis = 1;
                // level 5 khi di chuyen gan xuong toi no sẽ biến mất gần tới thì nó sẽ hiện ra
                this.levelInterval = setInterval(() => {
                    // lấy ra vị trí đầu tiên có
                    let indexOfFirstRowHasBrick = this.arrData.findIndex((row) => {
                        return row.some(e => {
                            return e.num !== 0 || e.color !== 'black';
                        });
                    });

                    // nếu this.y >= 2 thì biến mất hết tất cả các o trong mảng
                    if (this.y >= 2 && countDis % 2 === 1) {
                        disapperList = this.fiveLevel();
                        countDis++;
                    }

                    // nếu this.y >= index hàng đầu tiền có 1 tetro / 2 thì hiện ra các components
                    if (countDis % 2 === 0 && disapperList && this.y >= (indexOfFirstRowHasBrick / 2)) {
                        // fill màu lại tất cả
                        disapperList.forEach(e => {
                            this.arrData[e.i][e.j] = Object.assign({}, {num: e.num, color: e.color});
                        });
                        countDis--;
                    }
                }, 0);
                break;
            case 6:
                clearInterval(this.levelInterval);
                this.gameReplay();
                this.gameLevel = level;
                // tọa độ của ô vuông được di chuyển
                let dy = 5;
                let dx = BOARD_WIDTH;
                let randomBirk = this.tetroManager.createShapeRandomForLevel2();

                // cứ mõi s sẽ có 1 o vuông bay ngang tùy vị tr nếu đụng tetro => bến mất phần đụng vào khối
                this.levelInterval = setInterval(() => {
                    //     thêm randomBirk vao arr với x = W y = dy
                    this.arrData[dy][dx] = Object.assign({}, {
                        num: randomBirk.shape[0][0],
                        color: randomBirk.color
                    });
                    this.arrData[dy][dx + 1] = Object.assign({}, {num: 0, color: 'black'});
                    if (dx === -1) {
                        dx = BOARD_WIDTH;
                    }
                    dx--;
                }, 1000);
                break;
            default:
                break;
        }
    }

    secondLevel() {
        // tạo 1 khối tetro mới
        let randomBirk = this.tetroManager.createShapeRandomForLevel2();
        // hàm để tạo ra 5 hàng có các khối randomBrick
        this.arrData = this.arrProcess.setUpTetroForSecondLevel(randomBirk, this.arrData);
    }

    thirdLevel(count) {
        // tạo 1 khối tetro mới
        let randomBirk = this.tetroManager.createShapeRandomForLevel2();
        this.arrData = this.arrProcess.setUpTetroForThirdLevel(count, randomBirk, this.arrData);
    }

    fourLevel() {
        // lấy vị trí ngẫu nhiên trong booard để set cho x và y
        let dx = Math.floor(Math.random() * (BOARD_WIDTH - 2));
        let dy = Math.floor(Math.random() * (BOARD_HEIGHT - 3));
        this.x = dx;
        this.y = dy;
    }

    fiveLevel() {
        // lấy ra những ô !== cell_fill và lưu vào list
        let disapperBoard = [];
        this.arrData.forEach((e, i) => {
            e.forEach((r, j) => {
                if (r.num !== 0) {
                    let obj = {i: i, j: j, num: r.num, color: r.color};
                    disapperBoard.push(obj); // lưu obj vào mảng
                    r.color = 'black'; // set color để tàn hình
                }
            });
        });
        return disapperBoard;
    }

}

// function để chuyển trạng thái audio sang muted
function changeMuteStatus(audio) {
    audio.muted = !audio.muted;
}

//function để display seconds
function timeDisplay(seconds) {

    // chuyển số giây sang hour , minute, và second
    let hours = Math.floor(seconds / 3600);
    let minutes = Math.floor((seconds % 3600) / 60);
    let remainingSeconds = Math.floor(seconds % 60);

    // chuyển  số giờ, phút và giây được định dạng thành 2 chữ số
    let Hours = hours < 10 ? '0' + hours : hours;
    let Minutes = minutes < 10 ? '0' + minutes : minutes;
    let Seconds = remainingSeconds < 10 ? '0' + remainingSeconds : remainingSeconds;

    return Hours + ':' + Minutes + ':' + Seconds;

}

function showNotifications(gameOver) {
    //nếu gameover = f => show và xoa nút next level
    if (gameOver) {
        let notifications = document.querySelector('.notifications__defeat');
        notifications.style.display='flex';
        notifications.classList.add('notifi_anima_show');
    } else {
        console.log(gameOver);
        let notification__victory = document.querySelector('.notifications__victory');
        notification__victory.style.display='flex';
        notification__victory.classList.add('notifi_anima_show');

    }
}
// END TETRIS GAME CLASS

// CONTROLL EVENT
const tetris = new TetrisGame(ctx);


// xử lí nút play
let play = document.querySelector('#play');
play.addEventListener('click', (e) => {
    document.querySelector('.game_infor').style.animation = 'disapper 2s forwards';
    document.querySelector('.game_infor').style.display = 'none';
    document.querySelector('main').style.display = 'flex';
    tetris.startGame();
    tetris.controller();
});


// xử lí nút pause
// let pauseCount = 0;
let pauseClicked = false;
let pause = document.querySelector('.pause');
pause.addEventListener('click', (e) => {
    pauseClicked = !pauseClicked;
    if (pauseClicked) {
        tetris.pauseGame(pauseClicked);
        pause.innerHTML = `Un Pause`;

    } else {
        tetris.pauseGame(pauseClicked);
        pause.innerHTML = `Pause`;
    }
});

// xử lí nút replay
let replay = document.querySelector('.destroy');
replay.addEventListener('click', () => {
    tetris.gameReplay();
});


// xử l nút sound
let sound = document.querySelector('.sound');
let soundClicked = false;
sound.addEventListener('click', () => {
    soundClicked = !soundClicked;
    if (soundClicked) {
        sound.innerHTML = `Un Mute`;
        tetris.muted(soundClicked);
    } else {
        sound.innerHTML = `Mute`;
        tetris.muted(soundClicked);
    }
});

//xử lí nút level
let level = 1;

let level_increment = document.querySelector('.level__increment');

level_increment.addEventListener('click', () => {
    level++;
    if (level <= 6) {
        level_show.innerHTML = `Level ${level}`;
        tetris.changeLevel(level);
    } else {
        level = 6;
    }

});

let level_decrement = document.querySelector('.level__decrement');
level_decrement.addEventListener('click', () => {
    level--;
    if (level >= 1) {
        level_show.innerHTML = `Level ${level}`;
        tetris.changeLevel(level);
    } else {
        level = 1;
    }

});

let notification__victory = document.querySelector(".notifications__victory");
let btn_next_victory = document.querySelector('.notifi__next--victory');

function addAndRemoveAniamtion() {
    notification__victory.classList.remove('notifi_anima_show'); // xóa animation
    notification__victory.classList.add('notifi_anima_up'); // them aniamation
    notification__victory.addEventListener('animationend', (evt) => {
        if (evt.animationName === 'notifi_up') {//kiểm tra xem tên animation có phải là notifi_up thì mới set dispaly
            notification__victory.style.display = 'none';
        }
        notification__victory.classList.remove('notifi_anima_up');
        tetris.changeLevel(level);
    });
}

btn_next_victory.addEventListener('click', () => {
    level++;
    console.log(level);
    if (level <= 6) {
        level_show.innerHTML = `Level ${level}`;
        addAndRemoveAniamtion();
    } else {
        level = 6;
    }

});
let btn_replay_victory = document.querySelector('.notifi__replay--victory');
btn_replay_victory.addEventListener('click', () => {
    addAndRemoveAniamtion();
});

// DEFEAT


let notification__defeat = document.querySelector(".notifications__defeat");
let btn_replay_defeat = notification__defeat.querySelector('.notifi__replay--defeat');
btn_replay_defeat.addEventListener('click',()=>{
    notification__defeat.classList.remove('notifi_anima_show'); // xóa animation
    notification__defeat.classList.add('notifi_anima_up'); // them aniamation
    notification__defeat.addEventListener('animationend', (evt) => {
        if (evt.animationName === 'notifi_up') {//kiểm tra xem tên animation có phải là notifi_up thì mới set dispaly
            notification__defeat.style.display = 'none';
        }
        notification__defeat.classList.remove('notifi_anima_up');
        tetris.changeLevel(level);
    });
});

// profile=================================
let profile = document.querySelector('#profile');
profile.addEventListener('click', () => {
    document.querySelector('.pop_up').style.animation = 'showUp 3s forwards';
    document.querySelector('.pop_up').style.display = 'flex';
});

let closeProfilebtn = document.querySelector('#close');
closeProfilebtn.addEventListener('click', () => {
    document.querySelector('.pop_up').style.animation = 'hiddenUp 3s forwards';
});


// END controll event

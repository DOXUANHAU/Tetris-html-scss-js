class Board {
    constructor(ctx) {
        this.ctx = ctx;
    }
    clear() {
        this.ctx.clearRect(0, 0, BOARD_WIDTH * CELL_SIZE, BOARD_HEIGHT * CELL_SIZE);
    }

    //method để vẽ board game

    drawBoard(arrData) {
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
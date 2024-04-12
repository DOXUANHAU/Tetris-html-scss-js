class Tetrominoes {
    constructor() {
        this.tetrominoesManager = this.createShapeTetrominoes();
    }

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

    getRandomTetromino() {
        let ranIndex = Math.floor(Math.random() * this.tetrominoesManager.length);
        return this.tetrominoesManager[ranIndex];
    }
}
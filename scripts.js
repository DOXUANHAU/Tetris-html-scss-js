const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 16;
const CELL_SIZE = 24;
const canvas = document.querySelector('.board');
const CELL_FILL = {num :0,color : "black"};
const ctx = canvas.getContext('2d');
ctx.canvas.width = BOARD_WIDTH * CELL_SIZE;
ctx.canvas.height = BOARD_HEIGHT * CELL_SIZE;








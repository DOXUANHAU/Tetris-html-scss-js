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
        let m = arr.length;
        let n = arr[0].length;
        let r = [];
        for (let i = 0; i < n; i++) {
            r[i] = new Array(m).fill(undefined);
        }
        for (let i = 0; i < m; i++) {
            for (let j = 0; j < n; j++) {
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
    updateDataIntoArrData(x, y, shape, color, arrData) {

        for (let row = 0; row < shape.length; row++) {
            for (let col = 0; col < shape[row].length; col++) {
                // check da game ove chưa
                if (y + row < 0) {
                   return true;
                }

                //cập nhật tetro vào trong arrData
                if (shape[row][col] !== 0) {
                    // Tạo một bản sao của đối tượng tại vị trí cụ thể
                    let cellFill = {...arrData[y + row][x + col]};
                    cellFill.num = shape[row][col];
                    cellFill.color = color;
                    // Cập nhật đối tượng mới vào mảng arrData
                    arrData[y + row][x + col] = cellFill;

                }
            }
        }
       return  false;

    }

    getScoreAfterMoveDown(arrData) {

        // duyệt qua từng hàng và từng item tỏng hàng nếu hàng đóa thão mẵng diều diện th bỏ vào rừullValid
        // lấy ra nhữn hàng dduojc fill
        const rowFullValid = arrData.filter((row) => {
            return row.every(cell => {
                return cell.num !== CELL_FILL.num && cell.color !== CELL_FILL.color;
            });
        });

        //nếu tồn tại rowFullvlaid caapj nhật điểm , dồn hàng xuống dưới
        return rowFullValid.length;

    }

    updateBoardAfterMoveDown(arrData) {
        //lấy ra những hàng chauw đc fill
        const rowFullInvalid = arrData.filter((row) => {
            return row.some(cell => {
                return cell.num === CELL_FILL.num && cell.color === CELL_FILL.color;
            });
        });
        const newRow = Array.from({length: BOARD_HEIGHT - rowFullInvalid.length}, () => Array(BOARD_WIDTH).fill(CELL_FILL));
        //     cập nhật
        return [...newRow, ...rowFullInvalid];
    }
}


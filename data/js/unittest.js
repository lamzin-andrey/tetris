function runUnittest() {
	TestSquareCheckSpace();
	TestTetrisDrawBrick();
}

function TestTetrisDrawBrick() {
	console.log('call TestTetrisDrawBrick');
	console.log('Отрисовываю фигуру');
	var data = [
		5, 5,
		6, 5,
		5, 6,
		6, 6
	];
	var sprites = [];
	for (var i = 0; i < data.length; i += 2) {
		sprites.push( SE2D.app.drawBrick(data[i], data[i + 1]) );
	}
	console.log('Проверяю состояние сетки');
	
	for (var i = 0; i < data.length; i += 2) {
		if (SE2D.app.workGrid[data[i + 1] ][ data[i] ] != 2) {
			throw new Error('In cell (' + data[i + 1] + ', ' + data[i] + ') expect 2, got ' + SE2D.app.workGrid[ data[i + 1] ][ data[i] ]);
		}
	}
	console.log('Удалить фигуры');
	for (var i = 0; i < sprites.length; i++) {
		SE2D.remove(sprites[i]);
	}
	console.log('===============================');
}

function TestSquareCheckSpace() {
	console.log('call TestSquareCheckSpace');
	console.log('Заполняю первую строку 1-ками');
	var store = [];
	_fillRow(1, store);
	var originalAddFigure = TetrisFigure.prototype.addFigure;
	TetrisFigure.prototype.addFigure = function() {};
	var sq = new TetrisSquare(SE2D.app);
	var info = {}, success = sq.checkSpace(info);
	//console.log(SE2D.app.workGrid);
	/*console.log(info);
	return;*/
	if (success) {
		throw new Error('Expect false. got true');
	}
	if (info.v != 1) {
		throw new Error('Expect 1. got ' + info.v);
	}
	console.log('test 1 success');
	_resetRow(1, store);
	store = [];
	_fillRow(0, store);
	console.log('Заполняю вторую строку 1-ками');
	info = {};
	success = sq.checkSpace(info);
	if (success) {
		throw new Error('Expect false. got true');
	}
	if (info.v != 2) {
		throw new Error('Expect 2. got ' + info.v);
	}
	console.log('test 2 success');
	_resetRow(0, store);
	
	info = {};
	success = sq.checkSpace(info);
	if (!success) {
		throw new Error('Expect true. got false');
	}
	if (info.v ) {
		throw new Error('Expect null, got ' + info.v);
	}
	console.log('test 2 success');
	console.log('exit from TestSquareCheckSpace');
	console.log('===============================');
	TetrisFigure.prototype.addFigure = originalAddFigure;
}

function _fillRow(numRow, store) {
	for (var i = 0; i < SE2D.app.workGridNumCell; i++) {
		store.push(SE2D.app.workGrid[numRow][i]);
		SE2D.app.workGrid[numRow][i] = 1;
	}
}

function _resetRow(numRow, store) {
	for (var i = 0; i < SE2D.app.workGridNumCell; i++) {
		SE2D.app.workGrid[numRow][i] = store[i];
	}
}



//TODO фигуры всегда инициализуем сверху вниз (верхний ряд первый в blocks @see TetrisSquare, TetrisFigure.init)
/**
 * @class TetrisFigure
 * @var {Tetris} tetris
*/
function TetrisSquare(t, n) {
	n = n ? n : 2;
	this.init(t, n);
	this.createBlock(1, 1, 0)
	this.createBlock(2, 0, 1);
	this.createBlock(3, 1, 1);
	this.addFigure();
}
U.extend(TetrisFigure, TetrisSquare);
/**
 * @description записывает в info количество занятых рядов в пространстве в которое собираемся поместить фигуру, info.v может быть 0, 1 ,2
 * @param info
 * @return {Bool}   true если пространство свободно
*/
TetrisFigure.prototype.checkSpace = function(info) {
	return this.checkSpaceUtil(info, 2, 1);
}
/**
 * @description Смещает фигуру вправо
*/
TetrisFigure.prototype.moveRight = function() {
	if (this.cellJ < this.t.workGridNumCell - 2) {
		this.move(1, 1);
	}
}
//======================================================================

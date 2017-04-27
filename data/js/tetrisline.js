//TODO фигуры всегда инициализуем сверху вниз (верхний ряд первый в blocks @see TetrisSquare, TetrisFigure.init)
/**
 * @class TetrisFigure
 * @var {Tetris} tetris
*/
function TetrisLine(t, n) {
	n = n ? n : 4;
	this.isH = 1;
	this.init(t, n);
	this.createBlock(1, 1, 0)
	this.createBlock(2, 2, 0);
	this.createBlock(3, 3, 0);
	this.addFigure();
}
U.extend(TetrisFigure, TetrisLine);
/**
 * @description записывает в info количество занятых рядов в пространстве в которое собираемся поместить фигуру, info.v может быть 0, 1 ,2
 * @param info
 * @return {Bool}   true если пространство свободно
*/
TetrisLine.prototype.checkSpace = function(info) {
	if (this.isH == 1) {
		return this.checkSpaceUtil(info, 1);
	}
	return this.checkSpaceUtil(info, 4);
}
/**
 * @description Смещает фигуру вправо
*/
TetrisLine.prototype.moveRight = function() {
	var n = this.isH ? 4 : 1;
	if (this.cellJ < this.t.workGridNumCell - n) {
		this.move(1, 1);
	}
}
/**
 * @description Повернуть
*/
TetrisLine.prototype.rotate = function() {
	if (this.isH) {
		this.rotateToV();
	} else {
		this.rotateToH();
	}
}
/**
 * @description Повернуть с вертикального состояния в горизонтальное
*/
TetrisLine.prototype.rotateToH = function() {
	var i, info = {};
	for (i = 1; i < U.sz(this.blocks); i++) {
		this.blocks[i].offsetX = i;
		this.blocks[i].offsetY = 0;
	}
	this.isH = 1;
	if (!this.checkSpace(info)) {
		for (i = 1; i < U.sz(this.blocks); i++) {
			this.blocks[i].offsetX = 0;
			this.blocks[i].offsetY = i;
		}
		this.isH = 0;
	} else {
		for (i = 1; i < U.sz(this.sprites); i++) {
			this.sprites[i].go(this.sprites[0].x + i * this.t.workGridCellSz.x, this.sprites[0].y);
		}
	}
},
/**
 * @description Повернуть с горизонтального состояния в вертикальное
*/
TetrisLine.prototype.rotateToV = function() {
	var i, info = {};
	for (i = 1; i < U.sz(this.blocks); i++) {
		this.blocks[i].offsetX = 0;
		this.blocks[i].offsetY = i;
	}
	this.isH = 0;
	if (!this.checkSpace(info)) {
		for (i = 1; i < U.sz(this.blocks); i++) {
			this.blocks[i].offsetX = i;
			this.blocks[i].offsetY = 0;
		}
		this.isH = 1;
	} else {
		for (i = 1; i < U.sz(this.sprites); i++) {
			this.sprites[i].go(this.sprites[0].x, this.sprites[0].y + i * this.t.workGridCellSz.x);
		}
	}
}
//======================================================================

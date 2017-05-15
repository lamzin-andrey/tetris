//TODO фигуры всегда инициализуем сверху вниз (верхний ряд первый в blocks @see TetrisSquare, TetrisFigure.init)
/**
 * @class TetrisL
 * @var {Tetris} tetris
*/
function TetrisZ(t, n) {
	n = n ? n : 2;
	this.isH = 0;//Горизонтальная - Это z повернутая по часовой стрелке	
	//this.state = 1;
	this.init(t, n);
	this.createBlock(1, 1, 0)
	this.createBlock(2, 1, 1);
	this.createBlock(3, 2, 1);
	this.addFigure();
}
U.extend(TetrisFigure, TetrisZ);
/**
 * @description записывает в info количество занятых рядов в пространстве в которое собираемся поместить фигуру, info.v может быть 0, 1 ,2
 * @param info
 * @return {Bool} true если пространство свободно
*/
TetrisZ.prototype.checkSpace = function(info) {
	if (this.isH == 0) {
		return this.checkSpaceUtil(info, 2, 1);
	}
	return this.checkSpaceUtil(info, 2, 1);
}
/**
 * @description Смещает фигуру вправо
*/
TetrisZ.prototype.moveRight = function() {
	var n = this.isH ? 1 : 2;
	if (this.cellJ < this.t.workGridNumCell - n) {
		this.move(1, 1);
	}
}
/**
 * @description Повернуть
*/
TetrisZ.prototype.rotate = function() {
	if (this.isH) {
		this.rotateToV();
	} else {
		this.rotateToH();
	}
}
/**
 * @description Повернуть с горизонтального состояния в вертикальное
*/
TetrisZ.prototype.rotateToV = function() {
	var i, info = {}, s = this.t.workGridCellSz.x;
	
	
	this.blocks[1].offsetX = 1;
	this.blocks[1].offsetY = 0;
	
	this.blocks[2].offsetX = 1;
	this.blocks[2].offsetY = 1;
	
	this.blocks[3].offsetX = 2;
	this.blocks[3].offsetY = 1;
	
	this.isH = 0;
	if (!this.checkSpace(info)) {
		
		this.blocks[1].offsetX = 1;
		this.blocks[1].offsetY = 0;
		
		this.blocks[2].offsetX = 1;
		this.blocks[2].offsetY = -1;
		
		this.blocks[3].offsetX = 0;
		this.blocks[3].offsetY = 1;
			
		this.isH   = 0;
	} else {
	    this.sprites[1].go(this.sprites[0].x + s, this.sprites[0].y);
		this.sprites[2].go(this.sprites[0].x + s, this.sprites[0].y + s);
		this.sprites[3].go(this.sprites[0].x + 2 * s, this.sprites[0].y + s);
	}
}
/**
 * @description Повернуть с вертикального состояния в горизонтальное
*/
TetrisZ.prototype.rotateToH = function() {
	var i, info = {}, s = this.t.workGridCellSz.x;
	
	//this.cellJ += 1;
	this.blocks[1].offsetX = 1;
	this.blocks[1].offsetY = 0;
	
	this.blocks[2].offsetX = 1;
	this.blocks[2].offsetY = -1;
	
	this.blocks[3].offsetX = 0;
	this.blocks[3].offsetY = 1;
	
	
	this.isH = 1;
	if (!this.checkSpace(info)) {
		this.blocks[1].offsetX = 1;
		this.blocks[1].offsetY = 0;
		
		this.blocks[2].offsetX = 1;
		this.blocks[2].offsetY = 1;
		
		this.blocks[3].offsetX = 2;
		this.blocks[3].offsetY = 1;
			
		this.isH   = 0;
	} else {
		this.sprites[1].go(this.sprites[0].x + s, this.sprites[0].y);
		this.sprites[2].go(this.sprites[0].x + s, this.sprites[0].y - s);
		this.sprites[3].go(this.sprites[0].x, this.sprites[0].y + s);
	}
}
//======================================================================

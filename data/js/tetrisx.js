//TODO фигуры всегда инициализуем сверху вниз (верхний ряд первый в blocks @see TetrisSquare, TetrisFigure.init)
/**
 * @class TetrisX
 * @var {Tetris} tetris
*/
function TetrisX(t, n) {
	n = n ? n : 3;
	this.isH = 1;//Горизонтальная - Это три в ряд и одна смотрит вниз
	this.state = 1;
	this.init(t, n);
	this.createBlock(1, 1, 0)
	this.createBlock(2, 2, 0);
	this.createBlock(3, 1, 1);
	this.addFigure();
}
U.extend(TetrisFigure, TetrisX);
/**
 * @description записывает в info количество занятых рядов в пространстве в которое собираемся поместить фигуру, info.v может быть 0, 1 ,2
 * @param info
 * @return {Bool} true если пространство свободно
*/
TetrisX.prototype.checkSpace = function(info) {
	if (this.isH == 1) {
		return this.checkSpaceUtil(info, 2, 1);
	}
	return this.checkSpaceUtil(info, 3, 2, 1);
}
/**
 * @description Смещает фигуру вправо
*/
TetrisX.prototype.moveRight = function() {
	var n = this.isH ? 3 : 2;
	if (this.cellJ < this.t.workGridNumCell - n) {
		this.move(1, 1);
	}
}
/**
 * @description Повернуть
*/
TetrisX.prototype.rotate = function() {
	if (this.isH) {
		this.rotateToV();
	} else {
		this.rotateToH();
	}
}
/**
 * @description Повернуть с горизонтального состояния в вертикальное состояния 2
*/
TetrisX.prototype.rotateToH = function() {
	var o = this;
	if (o.state == 2) {
		o.rotateToH3();
	} else {
		o.rotateToH1();
	}
}
/**
 * @description Повернуть с горизонтального состояния в вертикальное состояния 2
*/
TetrisX.prototype.rotateToV = function() {
	var o = this;
	if (o.state == 1) {
		o.rotateToV2();
	} else {
		o.rotateToV4();
	}
}
/**
 * @description Повернуть с горизонтального состояния в вертикальное выступ слева
*/
TetrisX.prototype.rotateToV2 = function() {
	var i, info = {}, s = this.t.workGridCellSz.x;
	
	this.blocks[1].offsetX = 1;
	this.blocks[1].offsetY = -1;
	
	this.blocks[2].offsetX = 1;
	this.blocks[2].offsetY = 0;
	
	this.blocks[3].offsetX = 1;
	this.blocks[3].offsetY = 1;
	
	if (!this.checkSpace(info)) {
		this.blocks[1].offsetX = 1;
		this.blocks[1].offsetY = 0;
		
		this.blocks[2].offsetX = 2;
		this.blocks[2].offsetY = 0;
		
		this.blocks[3].offsetX = 1;
		this.blocks[3].offsetY = 1;
		this.isH = 1;
	} else {
		this.sprites[1].go(this.sprites[0].x + s, this.sprites[0].y - s);
		this.sprites[2].go(this.sprites[0].x + s, this.sprites[0].y + 0 * s);
		this.sprites[3].go(this.sprites[0].x + s, this.sprites[0].y + s);/**/
		this.isH = 0;
		this.state = 2
	}
}
/**
 * @description Повернуть с вертикального состояния в горизонтальное, выступ вверх
*/
TetrisX.prototype.rotateToH3 = function() {
	var i, info = {}, s = this.t.workGridCellSz.x;
	
	//this.cellJ += 1;
	this.blocks[1].offsetX = 1;
	this.blocks[1].offsetY = 0;
	
	this.blocks[2].offsetX = 2;
	this.blocks[2].offsetY = 0;
	
	this.blocks[3].offsetX = 1;
	this.blocks[3].offsetY = -1;
	
	if (!this.checkSpace(info)) {
		this.blocks[1].offsetX = 1;
		this.blocks[1].offsetY = -1;
		
		this.blocks[2].offsetX = 1;
		this.blocks[2].offsetY = 0;
		
		this.blocks[3].offsetX = 1;
		this.blocks[3].offsetY = 1;
	} else {
		this.sprites[1].go(this.sprites[0].x + s,     this.sprites[0].y);
		this.sprites[2].go(this.sprites[0].x + 2 * s, this.sprites[0].y);
		this.sprites[3].go(this.sprites[0].x + s,     this.sprites[0].y - s);
		this.isH = 1
		this.state = 3;
	}
}
/**
 * @description Повернуть с горизонтального состояния в вертикальное выступ справа
*/
TetrisX.prototype.rotateToV4 = function() {
	var i, info = {}, s = this.t.workGridCellSz.x;
	
	//this.cellJ += 1;
	this.blocks[1].offsetX = 0;
	this.blocks[1].offsetY = -1;
	
	this.blocks[2].offsetX = 1;
	this.blocks[2].offsetY = 0;
	
	this.blocks[3].offsetX = 0;
	this.blocks[3].offsetY = 1;
	
	if (!this.checkSpace(info)) {
		this.blocks[1].offsetX = 1;
		this.blocks[1].offsetY = 0;
		
		this.blocks[2].offsetX = 2;
		this.blocks[2].offsetY = 0;
		
		this.blocks[3].offsetX = 1;
		this.blocks[3].offsetY = -1;
	} else {
		this.sprites[1].go(this.sprites[0].x,     this.sprites[0].y - s);
		this.sprites[2].go(this.sprites[0].x + s, this.sprites[0].y);
		this.sprites[3].go(this.sprites[0].x,     this.sprites[0].y + s);
		this.isH = 0;
		this.state = 4;
	}
}
/**
 * @description Повернуть с  состояния в вертикальное выступ справа
*/
TetrisX.prototype.rotateToH1 = function() {
	var i, info = {}, s = this.t.workGridCellSz.x;
	//this.cellJ += 1;
	this.blocks[1].offsetX = 1;
	this.blocks[1].offsetY = 0;
	
	this.blocks[2].offsetX = 2;
	this.blocks[2].offsetY = 0;
	
	this.blocks[3].offsetX = 1;
	this.blocks[3].offsetY = 1;
	
	if (!this.checkSpace(info)) {
		this.blocks[1].offsetX = 0;
		this.blocks[1].offsetY = -1;
		
		this.blocks[2].offsetX = 1;
		this.blocks[2].offsetY = 0;
		
		this.blocks[3].offsetX = 0;
		this.blocks[3].offsetY = 1;
	} else {
		this.sprites[1].go(this.sprites[0].x + s,     this.sprites[0].y);
		this.sprites[2].go(this.sprites[0].x + 2 * s, this.sprites[0].y);
		this.sprites[3].go(this.sprites[0].x + s,     this.sprites[0].y + s);
		this.isH = 1;
		this.state = 1;
	}
}
//======================================================================

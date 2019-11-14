//TODO фигуры всегда инициализуем сверху вниз (верхний ряд первый в blocks @see TetrisSquare, TetrisFigure.init)
/**
 * @class TetrisLM
 * @var {Tetris} tetris
*/
function TetrisLM(t, n) {
	n = n ? n : 3;
	this.isH = 0;
	this.state = 1;
	this.init(t, n);
	this.createBlock(1, 1, 0)
	this.createBlock(2, 1, -1);
	this.createBlock(3, 1, -2);
	this.addFigure();
	this.moveDown();
	this.moveDown();
}
U.extend(TetrisFigure, TetrisLM);
/**
 * @description записывает в info количество занятых рядов в пространстве в которое собираемся поместить фигуру, info.v может быть 0, 1 ,2
 * @param info
 * @return {Bool} true если пространство свободно
*/
TetrisLM.prototype.checkSpace = function(info) {
	if (this.isH == 1) {
		return this.checkSpaceUtil(info, 2, 1);
	}
	return this.checkSpaceUtil(info, 3, 1, 2);
}
/**
 * @description Смещает фигуру вправо
*/
TetrisLM.prototype.moveRight = function() {
	var n = this.isH ? 3 : 1;
	if (this.cellJ < this.t.workGridNumCell - n) {
		return this.move(1, 1);
	}
	return false;
}
/**
 * @description Повернуть
*/
TetrisLM.prototype.rotate = function() {
	if (this.isH) {
		this.rotateToV();
	} else {
		this.rotateToH();
	}
}
/**
 * @description Повернуть с горизонтального состояния в вертикальное
*/
TetrisLM.prototype.rotateToV = function() {
	if (this.state == 2) {
		this.rotateToV3();
	} else if (this.state == 4){
		this.rotateToV1();
	}
}
/**
 * @description Повернуть с вертикального состояния в горизонтальное
*/
TetrisLM.prototype.rotateToH = function() {
	if (this.state == 1) {
		this.rotateToH2();
	} else if (this.state == 3){
		this.rotateToH4();
	}
}
/**
 * @description Повернуть с вертикального состояния 1 в горизонтальное 2
*/
TetrisLM.prototype.rotateToH2 = function() {
	var i, info = {}, s = this.t.workGridCellSz.x;
	this.blocks[1].offsetX = 1;
	this.blocks[1].offsetY = 0;
	
	this.blocks[2].offsetX = 2;
	this.blocks[2].offsetY = 0;
	
	this.blocks[3].offsetX = 0;
	this.blocks[3].offsetY = -1;
	this.isH = 1;
	this.state = 2;
	if (!this.checkSpace(info)) {
		this.blocks[1].offsetX = 1;
		this.blocks[1].offsetY = 0;
		
		this.blocks[2].offsetX = 1;
		this.blocks[2].offsetY = -1;
		
		this.blocks[3].offsetX = 1;
		this.blocks[3].offsetY = -2;
			
		this.isH   = 0;
		this.state = 1;
	} else {
		this.sprites[1].go(this.sprites[0].x + s, this.sprites[0].y);
		this.sprites[2].go(this.sprites[0].x + 2 * s, this.sprites[0].y);
		this.sprites[3].go(this.sprites[0].x, this.sprites[0].y - s);
		//this.moveLeft();
		this.moveDown();
	}
},
/**
 * @description Повернуть с горизонтального состояния в вертикальное 3
*/
TetrisLM.prototype.rotateToV3 = function() {
	var i, info = {}, s = this.t.workGridCellSz.x;
	this.blocks[1].offsetX = 1;
	this.blocks[1].offsetY = 0;
	
	this.blocks[2].offsetX = 0;
	this.blocks[2].offsetY = 1;
	
	this.blocks[3].offsetX = 0;
	this.blocks[3].offsetY = 2;
	
	this.isH = 0;
	this.state = 3;
	if (!this.checkSpace(info)) {
		this.blocks[1].offsetX = 1;
		this.blocks[1].offsetY = 0;
		
		this.blocks[2].offsetX = 2;
		this.blocks[2].offsetY = 0;
		
		this.blocks[3].offsetX = 0;
		this.blocks[3].offsetY = -1;
	
		this.isH = 1;
		this.state = 2;
	} else {
		this.sprites[1].go(this.sprites[0].x + s, this.sprites[0].y);
		this.sprites[2].go(this.sprites[0].x + 0*s, this.sprites[0].y + s);
		this.sprites[3].go(this.sprites[0].x + 0*s, this.sprites[0].y + 2 * s);
		//this.moveRight();
	}
}
/**
 * @description Повернуть с вертикального состояния 3 в горизонтальное 4
*/
TetrisLM.prototype.rotateToH4 = function() {
	var i, info = {}, s = this.t.workGridCellSz.x;
	this.blocks[1].offsetX = 1;
	this.blocks[1].offsetY = 0;
	
	this.blocks[2].offsetX = 2;
	this.blocks[2].offsetY = 0;
	
	this.blocks[3].offsetX = 2;
	this.blocks[3].offsetY = 1;
	
	this.isH = 1;
	this.state = 4;
	if (!this.checkSpace(info)) {
		this.blocks[1].offsetX = 1;
		this.blocks[1].offsetY = 0;
		
		this.blocks[2].offsetX = 0;
		this.blocks[2].offsetY = 1;
		
		this.blocks[3].offsetX = 0;
		this.blocks[3].offsetY = 2;
	
		this.isH = 0;
		this.state = 3;
	} else {
		this.sprites[1].go(this.sprites[0].x + s, this.sprites[0].y);
		this.sprites[2].go(this.sprites[0].x + 2 * s, this.sprites[0].y);
		this.sprites[3].go(this.sprites[0].x + 2 * s, this.sprites[0].y + s);
		//this.moveRight();
	}
}
/**
 * @description Повернуть с горизонтального состояния 4 в вертикальное 1
*/
TetrisLM.prototype.rotateToV1 = function() {
	var i, info = {}, s = this.t.workGridCellSz.x;
	//this.moveRight();
	this.blocks[1].offsetX = 1;
	this.blocks[1].offsetY = 0;
	
	this.blocks[2].offsetX = 1;
	this.blocks[2].offsetY = -1;
	
	this.blocks[3].offsetX = 1;
	this.blocks[3].offsetY = -2;
	
	this.isH = 0;
	this.state = 1;
	if (!this.checkSpace(info)) {
		//this.moveLeft();
		this.blocks[1].offsetX = 1;
		this.blocks[1].offsetY = 0;
		
		this.blocks[2].offsetX = 2;
		this.blocks[2].offsetY = 0;
		
		this.blocks[3].offsetX = 2;
		this.blocks[3].offsetY = 1;
		this.cellG--;
	
		this.isH = 1;
		this.state = 4;
	} else {
		this.sprites[1].go(this.sprites[0].x + s, this.sprites[0].y);
		this.sprites[2].go(this.sprites[0].x + s, this.sprites[0].y - 1 * s);
		this.sprites[3].go(this.sprites[0].x + s, this.sprites[0].y - 2 * s);
		//this.moveDown();
	}
}
//======================================================================

//TODO фигуры всегда инициализуем сверху вниз (верхний ряд первый в blocks @see TetrisSquare, TetrisFigure.init)
/**
 * @class TetrisZM
 * @var {Tetris} tetris
 *   01 
 *  23
 *   
*/
function TetrisZM(t, n) {
	n = n ? n : 3;
	this.isH = 1;
	//this.state = 1;
	this.init(t, n);
	this.createBlock(1, 1, 0)
	this.createBlock(2, -1, 1);
	this.createBlock(3, 0, 1);
	this.addFigure();
	this.moveDown();
}
U.extend(TetrisFigure, TetrisZM);
/**
 * @description записывает в info количество занятых рядов в пространстве в которое собираемся поместить фигуру, info.v может быть 0, 1 ,2
 * @param info
 * @return {Bool} true если пространство свободно
*/
TetrisZM.prototype.checkSpace = function(info) {
	if (this.isH == 0) {
		console.log('ZM is vertiacal');
								  //info, max, secondRowI, thirdRowI, fourthRowI, fifthRowI, dbg
		var r = this.checkSpaceUtil(info, 2, 0, 1);
		/*if (!r) {
			console.log('ZM is finish!', info);
		}*/
		return r;
	}
	return this.checkSpaceUtil(info, 3, 1);
}
/**
 * @description Смещает фигуру вправо
*/
TetrisZM.prototype.moveRight = function() {
	var n = this.isH ? 3 : 1;
	if (this.cellJ < this.t.workGridNumCell - n) {
		return this.move(1, 1);
	}
	return false;
}
/**
 * @description Повернуть
*/
TetrisZM.prototype.rotate = function() {
	if (this.isH) {
		this.rotateToV();
	} else {
		this.rotateToH();
	}
}
/**
 * @description Повернуть с горизонтального состояния в вертикальное
 *   01    -> 0
 *  23        21
 *             3
 * (при этом 0 остается на месте) 
*/
TetrisZM.prototype.rotateToV = function() {
	var i, info = {}, s = this.t.workGridCellSz.x,
		safeOffsets = this.getAllOffsets();//TODO getAllOffsets in base
	
	this.blocks[0].offsetX = 0;
	this.blocks[0].offsetY = 0;
	
	this.blocks[1].offsetX = 1;
	this.blocks[1].offsetY = 1;
	
	this.blocks[2].offsetX = 0;
	this.blocks[2].offsetY = 1;
	
	this.blocks[3].offsetX = 1;
	this.blocks[3].offsetY = 2;
	
	
	if (!this.checkSpace(info)) {
		this.restoreOffsets(safeOffsets); //TODO restoreOffsets in base
	} else {
		this.sprites[1].go(this.sprites[0].x + s, this.sprites[0].y + s);
		this.sprites[2].go(this.sprites[0].x, this.sprites[0].y + s);
		this.sprites[3].go(this.sprites[0].x + s, this.sprites[0].y + 2 * s);
		this.isH = 0;
	}
}
/**
 * @description Повернуть с вертикального состояния в горизонтальное
 * 
 *   01 
 *  23
 * 
 * this.createBlock(1, 1, 0)
	this.createBlock(2, -1, 1);
	this.createBlock(3, 0, 1)
*/
TetrisZM.prototype.rotateToH = function() {
	var i, info = {}, s = this.t.workGridCellSz.x, safeOffsets = this.getAllOffsets();
	this.blocks[1].offsetX = 1;
	this.blocks[1].offsetY = 0;
	
	this.blocks[2].offsetX = -1;
	this.blocks[2].offsetY = 1;
	
	this.blocks[3].offsetX = 0;
	this.blocks[3].offsetY = 1;
	this.isH = 1;
	this.state = 2;
	if (!this.checkSpace(info)) {
		this.restoreOffsets(safeOffsets); //restoreOffsets in base
		this.isH   = 0;
		this.state = 1;
	} else {
		this.sprites[1].go(this.sprites[0].x + s, this.sprites[0].y);
		this.sprites[2].go(this.sprites[0].x - s, this.sprites[0].y + s);
		this.sprites[3].go(this.sprites[0].x, this.sprites[0].y + s);
		//this.moveDown();
	}
}

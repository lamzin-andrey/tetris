//TODO фигуры всегда инициализуем сверху вниз (верхний ряд первый в blocks @see TetrisSquare, TetrisFigure.init)
/**
 * @class TetrisL
 * @var {Tetris} tetris
*/
function TetrisL(t, n) {
	n = n ? n : 3;
	this.isH = 0;
	this.state = 1;
	this.init(t, n);
	this.createBlock(1, 0, 1)
	this.createBlock(2, 0, 2);
	this.createBlock(3, 1, 2);
	this.addFigure();
}
U.extend(TetrisFigure, TetrisL);
/**
 * @description записывает в info количество занятых рядов в пространстве в которое собираемся поместить фигуру, info.v может быть 0, 1 ,2
 * @param info
 * @return {Bool} true если пространство свободно
*/
TetrisL.prototype.checkSpace = function(info) {
	if (this.isH == 1) {
		return this.checkSpaceUtil(info, 2, 1);
	}
	return this.checkSpaceUtil(info, 3, 1, 2);
}
/**
 * @description Смещает фигуру вправо
*/
TetrisL.prototype.moveRight = function() {
	var n = this.isH ? 3 : 2;
	if (this.cellJ < this.t.workGridNumCell - n) {
		this.move(1, 1);
	}
}
/**
 * @description Повернуть
*/
TetrisL.prototype.rotate = function() {
	if (this.isH) {
		this.rotateToV();
	} else {
		this.rotateToH();
	}
}
/**
 * @description Повернуть с горизонтального состояния в вертикальное
*/
TetrisL.prototype.rotateToV = function() {
	if (this.state == 2) {
		this.rotateToV3();
	} else if (this.state == 4){
		this.rotateToV1();
	}
}
/**
 * @description Повернуть с вертикального состояния в горизонтальное
*/
TetrisL.prototype.rotateToH = function() {
	if (this.state == 1) {
		this.rotateToH2();
	} else if (this.state == 3){
		this.rotateToH4();
	}
}
/**
 * @description Повернуть с вертикального состояния 1 в горизонтальное 2
*/
TetrisL.prototype.rotateToH2 = function() {
	var i, info = {}, s = this.t.workGridCellSz.x;
	/*for (i = 2; i < U.sz(this.blocks); i++) {
		this.blocks[i].offsetX = i;
		this.blocks[i].offsetY = 0;
	}*/
	
	this.blocks[1].offsetX = 1;
	this.blocks[1].offsetY = 0;
	
	this.blocks[2].offsetX = 2;
	this.blocks[2].offsetY = 0;
	
	this.blocks[3].offsetX = 0;
	this.blocks[3].offsetY = 1;
	
	
	this.isH = 1;
	this.state = 2;
	if (!this.checkSpace(info)) {
		
		this.blocks[1].offsetX = 0;
		this.blocks[1].offsetY = 1;
		
		this.blocks[2].offsetX = 0;
		this.blocks[2].offsetY = 2;
		
		this.blocks[3].offsetX = 1;
		this.blocks[3].offsetY = 2;
			
		this.isH   = 0;
		this.state = 1;
	} else {
		/*for (i = 2; i < U.sz(this.sprites); i++) {
			this.sprites[i].go(this.sprites[0].x + (i - 1) * this.t.workGridCellSz.x, this.sprites[0].y);
		}*/
		this.sprites[1].go(this.sprites[0].x + s, this.sprites[0].y);
		this.sprites[2].go(this.sprites[0].x + 2 * s, this.sprites[0].y);
		this.sprites[3].go(this.sprites[0].x, this.sprites[0].y + s);
	}
},
/**
 * @description Повернуть с горизонтального состояния в вертикальное 3
*/
TetrisL.prototype.rotateToV3 = function() {
	var i, info = {}, s = this.t.workGridCellSz.x;
	this.blocks[1].offsetX = 1;
	this.blocks[1].offsetY = 0;
	
	this.blocks[2].offsetX = 1;
	this.blocks[2].offsetY = 1;
	
	this.blocks[3].offsetX = 1;
	this.blocks[3].offsetY = 2;
	
	this.isH = 0;
	this.state = 3;
	if (!this.checkSpace(info)) {
		this.blocks[1].offsetX = 0;
		this.blocks[1].offsetY = 1;
		
		this.blocks[2].offsetX = 2;
		this.blocks[2].offsetY = 0;
		
		this.blocks[3].offsetX = 3;
		this.blocks[3].offsetY = 0;
	
		this.isH = 1;
		this.state = 2;
	} else {
		this.sprites[1].go(this.sprites[0].x + s, this.sprites[0].y);
		this.sprites[2].go(this.sprites[0].x + s, this.sprites[0].y + s);
		this.sprites[3].go(this.sprites[0].x + s, this.sprites[0].y + 2 * s);
	}
}
/**
 * @description Повернуть с  вертикального состояния 3 в горизонтальное 4
*/
TetrisL.prototype.rotateToH4 = function() {
	var i, info = {}, s = this.t.workGridCellSz.x;
	this.blocks[1].offsetX = 1;
	this.blocks[1].offsetY = 0;
	
	this.blocks[2].offsetX = 2;
	this.blocks[2].offsetY = 0;
	
	this.blocks[3].offsetX = 2;
	this.blocks[3].offsetY = -1;
	
	this.isH = 1;
	this.state = 4;
	if (!this.checkSpace(info)) {
		this.blocks[1].offsetX = 1;
		this.blocks[1].offsetY = 0;
		
		this.blocks[2].offsetX = 1;
		this.blocks[2].offsetY = 1;
		
		this.blocks[3].offsetX = 1;
		this.blocks[3].offsetY = 2;
	
		this.isH = 0;
		this.state = 3;
	} else {
		this.sprites[1].go(this.sprites[0].x + s, this.sprites[0].y);
		this.sprites[2].go(this.sprites[0].x + 2 * s, this.sprites[0].y);
		this.sprites[3].go(this.sprites[0].x + 2 * s, this.sprites[0].y - s);
	}
}
/**
 * @description Повернуть с горизонтального состояния 4 в вертикальное 1
*/
TetrisL.prototype.rotateToV1 = function() {
	var i, info = {}, s = this.t.workGridCellSz.x;
	this.blocks[1].offsetX = 0;
	this.blocks[1].offsetY = 1;
	
	this.blocks[2].offsetX = 0;
	this.blocks[2].offsetY = 2;
	
	this.blocks[3].offsetX = 1;
	this.blocks[3].offsetY = 2;
	
	this.isH = 0;
	this.state = 1;
	if (!this.checkSpace(info)) {
		this.blocks[1].offsetX = 1;
		this.blocks[1].offsetY = 0;
		
		this.blocks[2].offsetX = 2;
		this.blocks[2].offsetY = 0;
		
		this.blocks[3].offsetX = 2;
		this.blocks[3].offsetY = -1;
	
		this.isH = 1;
		this.state = 4;
	} else {
		this.sprites[1].go(this.sprites[0].x, this.sprites[0].y + s);
		this.sprites[2].go(this.sprites[0].x, this.sprites[0].y + 2 * s);
		this.sprites[3].go(this.sprites[0].x + s, this.sprites[0].y + 2 * s);
	}
}
//======================================================================

/**
 * @class TetrisFigure
 * @var {Tetris} tetris
 * @var {Number} cellJ номер столбца верхнего левого блока
 * @var {Number} cellI номер строки верхнего левого блока
 * @var {Number} countBlock количество блоков
 * @var {Array} blocks Array of {offsetX, offsetY}  смещение задается в ячейках, offsetX вправо от левого верхнего блока, offsetY - вниз от левого верхнего блока
 * @var {Array} sprites Array of Sprite массив отрисованых клипов
 * @var {Bool} moveProcess true клгда двигаем фигуру
*/
function TetrisFigure(t) {
	this.init(t);
}
/**
 * @class TetrisFigure
 * @var {Tetris} tetris
*/
/**
 * @description 
 * @param {Tetris} tetris
 * @param {Number} n - ширина фигуры в блоках (например для квадрата 2, для повернутой L было бы 3)
*/
TetrisFigure.prototype.init = function(tetris, n) {
	this.t = tetris;
	this.cellJ = U.rand(0, tetris.workGridNumCell - n); //номер ячейки верхнего левого кирпича
	this.cellI = 0;
	this.countBlock = 4;
	this.blocks = [];
	this.sprites = [];
	this.blocks[0] = {offsetX:0, offsetY:0};
}
/**
 * @description Добавляет фигуру в начальную позицию.
*/
TetrisFigure.prototype.addFigure = function() {
	//проверяем, не заняты ли ячейки, которые собираемся занять
	//checkSpace записывает в info количество занятых рядов в пространстве в которое собираемся поместить фигуру, info.v может быть 0, 1 ,2
	var info = {}, success = this.checkSpace(info), i, obj = this;
	if (!success) {
		obj.cellJ -= info.v;
		//если нет, отрисовываем где надо
	}
	for (i = 0; i < obj.countBlock; i++) {
		obj.sprites.push( obj.t.drawBrick(obj.cellJ + obj.blocks[i].offsetX, obj.cellI + obj.blocks[i].offsetY) );
	}
	if (!success) {
		obj.t.onVRowComplete();
	} else {
		obj.t.setActiveFigure(obj);
	}
}
/**
 * @description записывает в info количество занятых рядов в пространстве в которое собираемся поместить фигуру, info.v может быть 0, 1 ,2
 * @param {Object}  {v} info
 * @param {Number}  max   максимальное количество рядов в фигуре
 * @var   {Number}  firstRowI   если i > этого значения, пошел первый ряд фигуры
 * @param {Number}  secondRowI  если i > этого значения, пошел второй ряд фигуры
 * @param {Number}  thirdRowI   если i > этого значения, пошел третий ряд фигуры
 * @param {Number}  fourthRowI  если i > этого значения, пошел четвертый ряд фигуры
 * @param {Number}  fifthRowI   если i > этого значения, пошел пятый ряд фигуры
 * @return {Bool}   true если пространство свободно
*/
TetrisFigure.prototype.checkSpaceUtil = function(info, max, secondRowI, thirdRowI, fourthRowI, fifthRowI) {
	thirdRowI  = thirdRowI ? thirdRowI : 9;
	fourthRowI = fourthRowI ? fourthRowI : 9;
	fifthRowI  = fifthRowI ? fifthRowI : 9;
	var result = true, i, I, J, v = 0, firstRowI = -1;
	for (i = 0; i < this.countBlock; i++) {
		J = this.cellJ + this.blocks[i].offsetX;
		I = this.cellI + this.blocks[i].offsetY;
		if (this.t.workGrid[I][J] == 1) {
			result = false;
			if (i > fifthRowI) { 
				v = 5;
			} else if (i > fourthRowI)  {
				v = 4;
			} else if (i > thirdRowI)   {
				v = 3;
			}  else if (i > secondRowI) {
				v = 2;
			}  else if (i > firstRowI)  {
				v = 1;
			}
			info.v = max - v + 1;
			info.i = i;
			break;
		}
	}
	return result;
}
/**
 * @description Общая функция перемещения фигур
 * @param {Bool} isH true если по горизонтали
 * @param {Number} direct -1 - left, 1 right or bottom
*/
TetrisFigure.prototype.move = function(isH, direct) {
	this.moveProcess = true;
	var varname = isH ? 'cellJ' : 'cellI', 
		step = this.t.workGridCellSz.x, newX, newY;
	direct = direct > 0 ? 1 : -1;
	step *= direct;
	if ((!isH && direct) == 1 || isH ) {
		var storeCellJ = this[varname], info = {},
			success;
		this[varname] += direct;
		success = this.checkSpace(info);
		if (success) {
			for (var i = 0; i < this.countBlock; i++) {
				if (isH) {
					newX = this.sprites[i].x + step;
					newY = this.sprites[i].y;
				} else {
					newY = this.sprites[i].y + step;
					newX = this.sprites[i].x;
				}
				this.sprites[i].go(newX, newY);
			}
		} else {
			this[varname] -= direct;
		}
	}
	this.moveProcess = false;
	return success;
}
/**
 * @description Смещает фигуру влево
*/
TetrisFigure.prototype.moveLeft = function() {
	if (this.cellJ > 0) {
		this.move(1, -1);
	}
}
/**
 * @description Смещает фигуру вниз
 * #return {Bool} true если удалось сместить
*/
TetrisFigure.prototype.moveDown = function() {
	return this.move(0, 1);
}
/**
 * @description 
*/
TetrisFigure.prototype.rotate = function() {}
/**
 * @param {Number} index
 * @param {Number} offsetX
 * @param {Number} offsetY
*/
TetrisFigure.prototype.createBlock = function(index, offsetX, offsetY) {
	this.blocks[index] = {offsetX:offsetX, offsetY:offsetY};
}
//======================================================================

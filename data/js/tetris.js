/**
 * @class Tetris
 * @var {Number} areaW - ширина "стакана"
 * @var {Array}  workGrid - массив i, j, представляющий собой сетку тетриса i - строки, j - столюбцы
 * @var {Object x, y}  workGridCellSz - размеры ячейки workGrid
 * @var {Number}  workGridNumRow      - количество строк в сетке
 * @var {Number}  workGridNumCell     - количество столбцов в сетке
 * @var {TetrisFigure}  figure        - активная на данный момент фигура
*/
function Tetris() {
	SE2D.app = SE2D.canvas.app = this;// SE2D.setApp(this);
	SE2D.gridCell = 8; //для оптимизации расчета столкновений, 8 взято как сторона "кирпича"
	SE2D.onLoadImages = this.onInit;
	SE2D.addGraphResources(["data/images/phone.png", "fon",
		"data/images/brick.png", "c_brick",
		"data/images/quest.png", "quest",
		"data/images/left.png", "left",
		"data/images/right.png", "right",
		"data/images/bottom.png", "bottom",
		"data/images/rotate.png", "rotate",
		"data/images/vl.png", "c_vert_line"
	]);
	//SE2D.canvas.onmousemove = this.onMouseMove;
	SE2D.onEnterFrame = this.onEnterFrame;
}
/**
 * @description this is SE2D
*/
Tetris.prototype.onInit = function() {
		this.app.fon = SE2D._root.fon;
		this.app.c_brick = SE2D._root.c_brick;
		this.app.vl = SE2D._root.c_vert_line;
		this.app.fon.is_image = 1;
		this.app.fon.visible = 1;
		this.app.addConrtolsArea();
		this.app.loadMap();
		var t = new TetrisZM(this.app);
		return;
		if (window.runUnittest && runUnittest instanceof Function) {
			runUnittest();
		}
}
/**
 * @description this is SE2D
*/
Tetris.prototype.onEnterFrame = function(e) {
	//this.app.moveBoard(this.app.board.x);
	//this.app.moveBall();
	
	//пока раз в секунду двигаем
	if (!this.app.figure) {
		return;
	}
	var N = this.app.lastTetrisTick;
	if (!N) {
		N = this.app.lastTetrisTick = U.time();
	}
	if (U.time() - N > 0 && !this.app.figure.moveProcess) {
		this.app.moveDown();
		this.app.lastTetrisTick = U.time();
	}
}
/**
 * @description this is Tetris. Перемещает фигуру вниз, если неудачно, записывает данные ячеек фигуры в ячейки сетки (меняя 2 на 1)
 * и добавляет новую фигуру.
*/
Tetris.prototype.moveDown = function() {
	if (!this.figure) {
		return;
	}
	if (!this.figure.moveDown()) {
		this.writeFigureCells(); // заменяем 2-ки фигуры 1 сетки
		delete this.figure;      //на всякий случай
		this.figure = new TetrisZM(this);/**@TODO *///надо заменить на рандомное создание
	}
}
/**
 * @description this is Tetris
*/
Tetris.prototype.writeFigureCells = function() {
	for (var i = 0; i < this.figure.sprites.length; i++) {
		//console.log(i);
		this.writeWorkGridCell(this.figure.sprites[i], 1, false);
	}
}
/**
 * @TODO deprecated
 * @description this is Tetris
*/
Tetris.prototype.moveBall = function() {
	var mc = this.ball;
	if (!mc) return;
	//bounds screen
	var  x = mc.x + mc.dx, y = mc.y + mc.dy, i, hitInfo = {};
	
	if ( x <= 0 ) {
		mc.dx *= -1;
		x = 1;
		this.random(mc);
	}
	if (x >= SE2D.w - mc.w) {
		x = SE2D.w - mc.w -1;
		mc.dx *= -1;
		this.random(mc);
	}
	if (y <= 0) {
		y = 1;
		mc.dy *= -1;
		this.random(mc);
	}
	if(y >= 1.3*SE2D.h /*- mc.h*/) {
		/*y = SE2D.h - mc.h -1;
		mc.dy *= -1;*/
		x = 12;
		y = 10;
		this.random(mc);
	}
	
	//TODO
	//получить координаты квадрата от координат шара
	//получить список спрайтов в этом квадрате
	//для каждого спрайта выполнить код ниже
	if (mc.dc) {//if danger collision
		for (i = 0; i < mc.dc; i++) {
			var id = mc.nearSprites[i],
				collision = 0;
			
			//console.log(id);
			if ( SE2D._root[id].hitTest && SE2D._root[id].hitTest({x:x, y:y, w:mc.w, h:mc.h}, hitInfo) ) {
				if (SE2D._root[id].vertical) {
					mc.dx *= -1;
					x = mc.x + mc.dx;
				} else if (SE2D._root[id].horizontal) {
					mc.dy *= -1;
					y = mc.y + mc.dy;
				} else {
					if (hitInfo.t) {
						mc.dy *= -1;
						y = mc.y + mc.dy;
						collision = 1;
					}
					if (hitInfo.b) {
						mc.dy *= -1;
						y = mc.y + mc.dy;
						collision = 1;
					}
					if (hitInfo.l) {
						mc.dx *= -1;
						x = mc.x + mc.dx;
						collision = 1;
					}
					if (hitInfo.r) {
						mc.dx *= -1;
						x = mc.x + mc.dx;
						collision = 1;
					}
					/*if (collision && (mc.dx == mc.dy)) {
						mc.dx++;
						if (!mc.dx) {
							mc.dx -= 2;
						}
						x = mc.x + mc.dx;
					}*/
				}
			}
		}
	}
	this.random(mc);
	//это лишь пример обработки
	if ( this.board.hitTest({x:x, y:y, w:mc.w, h:mc.h}) ) {
		mc.dy *= -1;
		y = mc.y + mc.dy;
	}
	mc.go(x, y);
}

/**
 * @description 
*/
Tetris.prototype.loadMap = function() {
	var p = this.c_brick, iX = this.areaW - 2*p.w, iY/* = SE2D.h - U.round(8 * SE2D.h / 70)*/, siY = iY, mc,
		countSpace = 0, lastSpace = 0, y;
		//беру 10 процентов от высоты сетки и выравниваю по верхней строке
		y = U.getPercents(10, SE2D.h);
		y = Math.ceil(y / SE2D.gridCell);//сколько ячеек укладывается в 5 процентах
		iY = SE2D.h - y * SE2D.gridCell;
	
	//render hor wall
	//TODO set map values
	console.log( this.workGrid );
	while (iX >= 0) {
		if (!lastSpace && U.rand(1, 100) % 5 == 0) {
			countSpace++;
			iX -= p.w;
			lastSpace = 1;
			continue;
		}
		lastSpace = 0;
		mc = p.clone(iX, iY, '', 1);
		mc.horizontal = 1;
		this.writeWorkGridCell(mc, 1);
		iX -= p.w;
	}
}

/**
 * @description Вычисляет ширину "стакана", размещает кнопки, устанавливает для них обработчики,
 * TODO устанавливает массив связанный с рабочей областью
 */
Tetris.prototype.addConrtolsArea = function() {
	var workAr = /*4 * SE2D.w / 5*/SE2D.w - 64, x, y, br = this.c_brick, iX, iY, vl = this.vl;
	this.areaW = x =  Math.floor(workAr / br.w) * br.w;
	//TODO set workmap
	y = SE2D.gridCell;
	this.initWorkGrid(this.areaW, SE2D.h, {x:y, y:y});
	//render right wall
	iX = x;
	iY = SE2D.h + vl.h;
	while (iY > 0) {
		mc = vl.clone(iX, iY, '', 1);
		mc.vertical = 1;
		iY -= vl.h;
	}
	//get button place
	var toolbarW = SE2D.w - this.areaW, bw = SE2D._root.left.w, i,
		quantityButtons = 5,
		space = U.round( (SE2D.h  - quantityButtons * bw) / quantityButtons ),
		names = ['left', 'right', 'rotate', 'bottom', 'quest']; 
	x = this.areaW + U.round((toolbarW - bw) / 2);
	space = space < 0 ? 0 : space;
	y = 0;
	
	//add button
	for (i in names) {
		var n = names[i];
		this[n] = SE2D._root[n];
		this[n].visible = 1;
		this[n].go(x, y);
		y += space + bw;
	}
	
	//set button handlers
	SE2D.setButtons(names);
	for (i in names) {
		var n = names[i],
			q = n.substring(0, 1).toUpperCase() + n.substring(1);
			s = "on" + q + "ButtonClick";
		
		this[n].onclick = this[s];
	}
}
/**
 * @description 
 * @param {Number} width
 * @param {Number} height
 * @param {x, y}   cellSize
*/
Tetris.prototype.initWorkGrid = function(width, height, cellSiz) {
	if (!width) width = SE2D.w;
	if (!height) height = SE2D.h;
	this.workGrid = [];
	this.workGridCellSz = cellSiz;
	var w = Math.floor(width / cellSiz.x), 
		h = Math.floor(height / cellSiz.y), i, j, item = [];
	for (i = 0; i < h; i++) {
		this.workGrid.push([]);
		for (j = 0; j < w; j++) {
			item.push(this.workGrid[i].push(0));
		}
	}
	this.workGridNumRow  = h;
	this.workGridNumCell = w;
}
/**
 * @description Записать в ячейки, занимаемыми клипом значение v
 * @param {Object x, y, w, h} clip
 * @param {Number} v
*/
Tetris.prototype.writeWorkGridCell = function(clip, v, all) {
	if (String(all) == "undefined") {
		all = true;
	}
	var self = this;
	//console.log(self.workGrid);
	function _write(x, y, v) {
		var j = Math.floor(x / self.workGridCellSz.x),
			i = Math.floor(y / self.workGridCellSz.y);
		if (self.workGrid[i]) {
			if (self.workGrid[i][j] || self.workGrid[i][j] === 0) {
				self.workGrid[i][j] = v;
			} else {
				throw new Error('Cell ' + i + ', ' + j + ' not exists in workGrid');
			}
		} else {
			throw new Error('Row ' + i + ' not exists in workGrid');
		}
	}
	_write(clip.x, clip.y, v);
	if (all) {
		_write(clip.x, clip.y + clip.h, v);
		_write(clip.x + clip.w, clip.y, v);
		_write(clip.x + clip.w, clip.y + clip.h, v);
	}
}
/**
 * @description 
 */
Tetris.prototype.onLeftButtonClick = function(e) {
	var self = e.target;
	SE2D.app.figure.moveLeft();
	console.log('aga');
}
/**
 * @description 
 */
Tetris.prototype.onRightButtonClick = function(e) {
	var self = e.target;
	SE2D.app.figure.moveRight();
	console.log('aga r');
}
/**
 * @description 
*/
Tetris.prototype.onBottomButtonClick = function(e) {
	var self = e.target;
	SE2D.app.moveDown();
	console.log('aga btm');
}
/**
 * @description 
*/
Tetris.prototype.onRotateButtonClick = function(e) {
	var self = e.target;
	console.log('aga rt');
	SE2D.app.figure.rotate();
}
/**
 * @description 
*/
Tetris.prototype.onQuestButtonClick = function(e) {
	var self = e.target;
	console.log('aga QQ');
}
/**
 * @description отрисовывает одну составляющую фигуры
 * @param {Number} cellJ номер столбца
 * @param {Number} cellI номер строки
*/
Tetris.prototype.drawBrick = function(cellJ, cellI) {
	var p = this.c_brick, iX = this.workGridCellSz.x * cellJ,
		iY = this.workGridCellSz.y * cellI;
	mc = p.clone(iX, iY, '', 1);
	if (this.workGrid[cellI]) {
		this.workGrid[cellI][cellJ] = 2;
	}
	return mc;
}
/**
 * @description Обработка заполненого вертикального столбца, по сути gameOver
*/
Tetris.prototype.onHRowComplete = function() {
	//startGameOverAnimation
	//onFin = function( callGameOverScreen)
	//onFin = function(callBeginScreen )
}
/**
 * @description установить активную фигуру
*/
Tetris.prototype.setActiveFigure = function(figure) {
	this.figure = figure;
}

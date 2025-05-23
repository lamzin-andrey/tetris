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
	SE2D.addGraphResources(["data/images/phone0.png", "fon",
		"data/images/brick.png", "c_brick",
		"data/images/quest.png", "quest",
		"data/images/left.png", "left",
		"data/images/right.png", "right",
		"data/images/bottom.png", "bottom",
		"data/images/rotate.png", "rotate",
		"data/images/vl.png", "c_vert_line",
		[[
			[1, "data/images/anim0/01.png"],
			[24, "data/images/anim0/02.png"],
			[48, "data/images/anim0/02.png"]
		], 
		   0/*lvl*/, [60, 50]/*[xy]*/, [100, 200]/*wh*/, [0.5, 0.7]/*scale*/, 'parentClipId'], "first_anim"
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
		
		// first anim
		this.app.first_anim = SE2D._root.first_anim;
		this.app.first_anim.visible = 1;
		//this.app.first_anim.go(50, 50);
		// /first anim
		
		this.app.addConrtolsArea();
		this.app.loadMap();
		this.app.reset();
		
		var t = this.app.getRandomFigure();
		return;
		if (window.runUnittest && runUnittest instanceof Function) {
			runUnittest();
		}
}
/**
 * @description this is Tetris. Сбрасывает все переменные относящиеся к состоянию игры
 * 
*/
Tetris.prototype.reset = function() {
	//Сбрасывает только те переменные, которые не относятся к переходу на следующий уровень (например, не сбрасывает очки)
	this.resetForNextLevel();
	this.scoreForOneRow = 10;
	this.score = 0;
}
/**
 * TODO
 * @description this is Tetris. Сбрасывает только те переменные, которые не относятся к переходу на следующий уровень (например, не сбрасывает очки)
 * 
*/
Tetris.prototype.resetForNextLevel = function() {
	
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
	
	//SE2D._root.rotate.rotation += 1;
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
		try {
			this.writeFigureCells(); // заменяем 2-ки фигуры 1 сетки
		}catch (e) {
			this.onVRowComplete();
		}
		delete this.figure;      //на всякий случай
		this.checkHRow();
		this.figure = this.getRandomFigure();
		
		// Это просто тест goto* методов.
		if (!window.dbgGSP) {
			this.first_anim.gotoAndStop(1);
			window.dbgGSP = 1;
		} else {
			this.first_anim.gotoAndStop(25); 
			window.dbgGSP = 0;
		}
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
 * @description 
*/
Tetris.prototype.loadMap = function() {
	/** @property {Number} areaW ширина холста минус область кнопок, приведённая к целому */
	
	var p = this.c_brick, iX = this.areaW - 2*p.w, iY/* = SE2D.h - U.round(8 * SE2D.h / 70)*/, siY = iY, mc,
		countSpace = 0, lastSpace = 0, y,
		scoreView, tf;
		//беру 10 процентов от высоты сетки и выравниваю по верхней строке
		y = U.getPercents(10, SE2D.h);
		y = Math.ceil(y / SE2D.gridCell);//сколько ячеек укладывается в 5 процентах
		iY = SE2D.h - y * SE2D.gridCell;
	this.lastRowIndex = this.getRowIndex(iY);
	//render hor wall
	//TODO set map values
	//console.log( this.workGrid );
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
		this.writeWorkGridCell(mc, 1, false, true);
		iX -= p.w;
	}
	scoreView = new TextField("scoreView");
	scoreView.go(10, 200);
	scoreView.visible = 1;
	scoreView._level = 1;
	tf = new TextFormat("Arial", 24, 0x00AA00);
	scoreView.setTextFormat(tf);
	scoreView.text = "Hello!";
	SE2D._root.addChild(scoreView);
}

/**
 * @description Вычисляет ширину "стакана", размещает кнопки, устанавливает для них обработчики,
 * 	устанавливает массив связанный с рабочей областью
 */
Tetris.prototype.addConrtolsArea = function() {
	var workAr = /*4 * SE2D.w / 5*/SE2D.w - 64, x, y, br = this.c_brick, iX, iY, vl = this.vl;
	/** @property {Number} areaW ширина холста минус область кнопок, приведённая к целому */
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
Tetris.prototype.writeWorkGridCell = function(clip, v, all, dbg) {
	if (String(all) == "undefined") {
		all = true;
	}
	var self = this;
	//console.log(self.workGrid);
	function _write(x, y, v) {
		var j = self.getCellIndex(x),
			i = self.getRowIndex(y);
		if (self.workGrid[i]) {
			if (self.workGrid[i][j] || self.workGrid[i][j] === 0) {
				if (dbg) {
					console.log('i', i);
				}
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
	//console.log('aga');
}
/**
 * @description 
 */
Tetris.prototype.onRightButtonClick = function(e) {
	var self = e.target;
	SE2D.app.figure.moveRight();
}
/**
 * @description 
*/
Tetris.prototype.onBottomButtonClick = function(e) {
	var self = e.target;
	SE2D.app.moveDown();
	//console.log('aga btm');
}
/**
 * @description 
*/
Tetris.prototype.onRotateButtonClick = function(e) {
	var self = e.target;
	//console.log('aga rt');
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
Tetris.prototype.onVRowComplete = function() {
	console.log('ICall');
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
Tetris.prototype.getRandomFigure = function() {
	//Это фикс бага, три предопределенных фигуры
	/*if (String(window.dbgI) == 'undefined') {
		window.dbgI = 0;
	}
	var s = '';
	if (window.dbgI < 3) {
		switch (dbgI) {
			case 0:
				s = 'Line';
				break;
			case 1:
				s = 'L';
				break;
			case 2:
				s = 'Z';
				break;
		}
		var n = 'Tetris' + s;
		console.log(n);
		dbgI++;
		return new window[n](this);
	}*/
	//end fix code
	
	//это рабочий код
	var n = U.rand(0, 9),
		classes = ['L', 'Square', 'Line', 'LM', 'Z', 'ZM', 'X'];
	if (n > 6 && n < 8) {
		n = 6;
	}else if(n > 6) {
		n = 0;
	}
	n = 'Tetris' + classes[n];
	return new window[n](this);
}
/**
 * @description Проверяет, нет ли заполненного  горизонтального ряда, удаляет такой ряд.
*/
Tetris.prototype.checkHRow = function() {
	var i, j, h = this.workGrid[0] ? this.workGrid[0].length : 0,
		complete = 0;
	for (i = 0; i < this.lastRowIndex /*this.workGrid.length*/ ; i++) {
		for (j = 0; j < h; j++) {
			if (this.workGrid[i][j] == 1) {
				complete = 1;
			} else {
				complete = 0;
				break;
			}
		}
		if (complete) {
			//TODO score
			
			//TODO сделать так, что если проворонили планку, пусть сверху новая летит
			//TODO ряд, изображающий границу снизу "не обслуживается". 
			//  Подумать, зачем это и не стоит ли это пофиксить
			
			this.removeRow(i, h);
			this.shiftDown(i - 1, h);//TODO сдвинуть вниз все связанные кирпичи
		}
	}
}
/**
 * @description Перемещаем все кирпичи расположенные выше вниз
 * @param {Number} nR номер строки (ряда)
 * @param {Number} n Количество "кирпичей" в ряде
*/
Tetris.prototype.shiftDown = function(nR, n) {
	var i, j, next, sp, id, aClipsIdList, k, y, x;
	for (i = nR; i > -1; i-- ) {
		//console.log('process nR = ' + i);
		for (j = 0; j < n; j++) {
			//if next cell containts 0
			if (this.workGrid[i + 1][j] == 0) {
				//sp = getSprite
				id = i + '_' + j;
				aClipsIdList = SE2D.grid && SE2D.grid[id] ? SE2D.grid[id] : 0;
				if (aClipsIdList) {
					for (k in aClipsIdList) {
						y = SE2D._root[k] ? SE2D._root[k].y : 'nl';
						x = SE2D._root[k] ? SE2D._root[k].x : 'nl';
						if (y != 'nl' && i == Math.floor(y / SE2D.gridCell)) {
							if (x != 'nl' && j  == Math.floor(x / SE2D.gridCell)) {
								sp = SE2D._root[k];
								if (sp) {
									sp.go(x, y + SE2D.gridCell);
									//console.log('clear cell ' + i + ', j = ' + j);
									this.workGrid[i][j] = 0;
									this.workGrid[i + 1][j] = 1;
								} else {
									//console.log(k + ' not found, next is ' + this.workGrid[i + 1][j] + ' for cell ' + j + ', nR = ' + nR);
								}
							}
						}
					}
				} else {
					//console.log('Cell has not clips, clear cell ' + i + ', j = ' + j);
					this.workGrid[i][j] = 0;
				}
				
			}/* else {
				console.log(i + ' = nR, next is ' + this.workGrid[i + 1][j] + ' for cell ' + j);
			}*/
		}
	}
	this.checkHRow();//TODO тут есть опасность бесконечной рекурсии, подумать
}
/**
 * @description Удаляем заполненную строку
 * @param {Number} nR номер строки (ряда)
 * @param {Number} n Количество "кирпичей" в ряде
*/
Tetris.prototype.removeRow = function(nR, n) {
	//Попробуем использовать SE2D.grid
	//console.log('Will remove ' + i);
	//console.log(SE2D.grid);
	var i, id, aClipsIdList, j, y;
	//Удаляем связанные спрайты
	for (i = 0; i < n; i++) {
		id = nR + '_' + i;
		aClipsIdList = SE2D.grid && SE2D.grid[id] ? SE2D.grid[id] : 0;
		aClipsIdList = U.clone(aClipsIdList);
		if (aClipsIdList) {
			for (j in aClipsIdList) {
				y = SE2D._root[j] ? SE2D._root[j].y : 0;
				if (y && nR == Math.floor(y / SE2D.gridCell)) {
					SE2D.remove(j);
				}
			}
		}
		//В соответствующие ячейки WorkGrid пишем, что там свободно
		this.workGrid[nR][i] = 0;
	}
	
	
}
/**
 * @description Получить номер "строки" по y координате "кирпича"
 * @param {Number} y
*/
Tetris.prototype.getRowIndex = function(y) {
	return Math.floor(y / this.workGridCellSz.y);
}

/**
 * @description Получить номер "строки" по x координате "кирпича"
 * @param {Number} x
*/
Tetris.prototype.getCellIndex = function(x) {
	return Math.floor(x / this.workGridCellSz.x);
}

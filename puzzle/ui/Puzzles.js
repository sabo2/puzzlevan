// Puzzles.js
/* global ui:false */

(function(){

var _refinfo = new WeakMap();

// メニュー描画/取得/html表示系
ui.puzzles = {
	length : 0,

	//---------------------------------------------------------------------------
	// puzzles.add()   パズルを追加する
	//---------------------------------------------------------------------------
	add : function(pzl, filename){
		/* パズルオブジェクトの作成 */
		var puzzle = new pzpr.Puzzle();
		this.push(puzzle);
		
		var info = {};
		info.filename = filename || '';
		info.filetype = pzl.type || 0;
		
		var element = info.canvas = document.createElement('div');
		element.className = 'puzzles';
		document.querySelector('#quesboard').appendChild(element);
		puzzle.setCanvas(element);
		
		if(ui.isMDI){
			var itemel = info.listel = document.createElement('div');
			itemel.className = 'puzzleitem';
			itemel.innerHTML = '<span class="modified"></span><span class="puzzleinfo"></span><br><span class="filename"></span>';
			document.querySelector('#puzzlelist').appendChild(itemel);
			itemel.addEventListener('click', function(){ ui.puzzles.select(puzzle);}, false);
		}
		
		_refinfo.set(puzzle, info);
		
		ui.listener.setListeners(puzzle);
		
		// 単体初期化処理のルーチンへ
		puzzle.once('fail-open', ui.misc.failOpen);
		puzzle.open(pzl);
	},

	//---------------------------------------------------------------------------
	// puzzles.delete()   パズルを削除する
	//---------------------------------------------------------------------------
	delete : function(puzzle){
		if(this.length===1){ ui.menuconfig.savePuzzle();}
		var idx = this.indexOf(puzzle);
		if(idx>=0){
			_refinfo.get(puzzle).canvas.remove();
			_refinfo.get(puzzle).listel.remove();
			
			_refinfo.delete(puzzle);
			
			this.splice(idx,1);
			if(idx>=this.length){ idx = this.length-1;}
			
			ui.puzzle = null;
		}
		ui.puzzles.select(this[idx] || null);
	},

	//---------------------------------------------------------------------------
	// puzzles.select()   複数あるうち表示するパズルを選択する
	//---------------------------------------------------------------------------
	select : function(puzzle){
		var prevpuzzle = ui.puzzle;
		ui.puzzle = puzzle;
		pzpr.connectKeyEvents(puzzle);
		if(ui.isMDI){
			if(prevpuzzle){ _refinfo.get(prevpuzzle).canvas.style.display = 'none';}
			if(puzzle)    { _refinfo.get(puzzle).canvas.style.display = '';}
			
			if(prevpuzzle){ _refinfo.get(prevpuzzle).listel.className = 'puzzleitem';}
			if(puzzle)    { _refinfo.get(puzzle).listel.className = 'puzzleitem puzzleitemsel';}
		}
		if(puzzle){ ui.menuconfig.restorePuzzle();}
		ui.misc.displayAll(true);
	},

	getInfo : function(puzzle){ return _refinfo.get(puzzle);},
	getCurrentInfo : function(){ return (ui.puzzle ? _refinfo.get(ui.puzzle) : {});},

	push    : Array.prototype.push,
	indexOf : Array.prototype.indexOf,
	splice  : Array.prototype.splice,
	forEach : Array.prototype.forEach,
	some    : Array.prototype.some
};

require('electron').ipcRenderer.on('update-filename', function(e, filename, filetype){
	if(ui.puzzle){
		ui.puzzle.opemgr.initpos = ui.puzzle.opemgr.position; /* modified状態を解消する */
		
		var info = _refinfo.get(ui.puzzle);
		info.filename = filename || info.filename || '';
		info.filetype = filetype || info.filetype || 0;
		_refinfo.set(ui.puzzle, info);
		
		ui.misc.setTitle();
		ui.misc.setListCaption(ui.puzzle);
	}
});

})();

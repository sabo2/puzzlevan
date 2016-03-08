// UI.js v3.4.0
/* global ui:false */
/* exported ui, _doc, getEL, createEL */

/* ui.js Locals */
var _doc = document;
function getEL(id){ return _doc.getElementById(id);}
function createEL(tagName){ return _doc.createElement(tagName);}

//---------------------------------------------------------------------------
// ★uiオブジェクト UserInterface側のオブジェクト
//---------------------------------------------------------------------------
/* extern */
window.ui = {
	/* このサイトで使用するパズルのオブジェクト */
	puzzle    : null,
	puzzles   : [],
	refinfo   : new WeakMap(),
	
	/* Electron用のオブジェクト */
	remote    : require('electron').remote,
	win       : require('electron').remote.getCurrentWindow(),
	isMDI     :(require('electron').ipcRenderer.sendSync('get-app-preference').windowmode==='mdi'),
	debugmode : require('electron').ipcRenderer.sendSync('get-app-preference').debugmode,
	
	/* メンバオブジェクト */
	event     : null,
	menuconfig: null,
	menuarea  : null,
	toolarea  : null,

	//---------------------------------------------------------------------------
	// ui.appendPuzzle()   パズルを追加する
	//---------------------------------------------------------------------------
	appendPuzzle : function(pzl, filename){
		/* パズルオブジェクトの作成 */
		var puzzle = new pzpr.Puzzle();
		ui.puzzles.push(puzzle);
		
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
			itemel.addEventListener('click', function(){ ui.selectPuzzle(puzzle);}, false);
		}
		
		ui.refinfo.set(puzzle, info);
		
		ui.listener.setListeners(puzzle);
		
		// 単体初期化処理のルーチンへ
		puzzle.once('fail-open', ui.misc.failOpen);
		puzzle.open(pzl);
	},

	//---------------------------------------------------------------------------
	// ui.removePuzzle()   パズルを削除する
	//---------------------------------------------------------------------------
	removePuzzle : function(puzzle){
		if(!ui.isMDI){ return;}
		var idx = ui.puzzles.indexOf(puzzle);
		if(idx>=0){
			ui.refinfo.get(puzzle).canvas.remove();
			ui.refinfo.get(puzzle).listel.remove();
			
			ui.refinfo.delete(puzzle);
			
			ui.puzzles.splice(idx,1);
			if(idx>=ui.puzzles.length){ idx = ui.puzzles.length-1;}
			
			ui.puzzle = null;
		}
		ui.selectPuzzle(ui.puzzles[idx] || null);
	},

	//---------------------------------------------------------------------------
	// ui.selectPuzzle()   複数あるうち表示するパズルを選択する
	//---------------------------------------------------------------------------
	selectPuzzle : function(puzzle){
		var prevpuzzle = ui.puzzle;
		ui.puzzle = puzzle;
		pzpr.connectKeyEvents(puzzle);
		if(ui.isMDI){
			if(prevpuzzle){ ui.refinfo.get(prevpuzzle).canvas.style.display = 'none';}
			if(puzzle)    { ui.refinfo.get(puzzle).canvas.style.display = '';}
			
			if(prevpuzzle){ ui.refinfo.get(prevpuzzle).listel.className = 'puzzleitem';}
			if(puzzle)    { ui.refinfo.get(puzzle).listel.className = 'puzzleitem puzzleitemsel';}
		}
		ui.misc.displayAll(true);
	},

	//--------------------------------------------------------------------------------
	// ui.openPuzzle()  指定されたデータのパズルを開く　
	//--------------------------------------------------------------------------------
	openPuzzle : function(data){
		require('electron').ipcRenderer.send('open-puzzle', data, (ui.puzzle ? ui.puzzle.pid : null));
	},

	//---------------------------------------------------------------------------
	// ui.closePuzzle() パズルのクローズ要求が出された時の処理
	//---------------------------------------------------------------------------
	closePuzzle : function(){
		if(ui.isMDI && ui.puzzles.length===0){
			ui.win.close();
		}
		if(ui.puzzle && (!ui.puzzle.ismodified() || ui.misc.closePuzzleInquiry())){
			ui.removePuzzle(ui.puzzle);
		}
		if(!ui.isMDI && ui.puzzles.length===0){
			ui.win.close();
		}
	}
};

require('electron').ipcRenderer.on('update-filename', function(e, filename, filetype){
	if(ui.puzzle){
		ui.puzzle.opemgr.initpos = ui.puzzle.opemgr.position; /* modified状態を解消する */
		
		var info = ui.refinfo.get(ui.puzzle);
		info.filename = filename || info.filename || '';
		info.filetype = filetype || info.filetype || 0;
		ui.refinfo.set(ui.puzzle, info);
		
		ui.misc.setTitle();
		ui.misc.setListCaption(ui.puzzle);
	}
});

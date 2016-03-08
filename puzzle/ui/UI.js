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
	
	reffile   : new WeakMap(),
	reffiletype:new WeakMap(),
	reflist   : new WeakMap(),
	refcanvas : new WeakMap(),
	
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
		
		if(!!filename && pzl.isfile){
			ui.reffile.set(puzzle, filename);
			ui.reffiletype.set(puzzle, pzl.type);
		}
		
		var element = document.createElement('div');
		element.className = 'puzzles';
		document.querySelector('#quesboard').appendChild(element);
		ui.refcanvas.set(puzzle, element);
		puzzle.setCanvas(element);
		
		if(ui.isMDI){
			var itemel = document.createElement('div');
			itemel.className = 'puzzleitem';
			itemel.innerHTML = '<span class="modified"></span><span class="puzzleinfo"></span><br><span class="filename"></span>';
			document.querySelector('#puzzlelist').appendChild(itemel);
			itemel.addEventListener('click', function(){ ui.selectPuzzle(puzzle);}, false);
			ui.reflist.set(puzzle, itemel);
		}
		
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
			ui.refcanvas.get(puzzle).remove();
			ui.refcanvas.delete(puzzle);
			
			ui.reflist.get(puzzle).remove();
			ui.reflist.delete(puzzle);
			
			ui.reffile.delete(puzzle);
			ui.reffiletype.delete(puzzle);
			
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
			if(prevpuzzle){ ui.refcanvas.get(prevpuzzle).style.display = 'none';}
			if(puzzle)    { ui.refcanvas.get(puzzle).style.display = '';}
			
			if(prevpuzzle){ ui.reflist.get(prevpuzzle).className = 'puzzleitem';}
			if(puzzle)    { ui.reflist.get(puzzle).className = 'puzzleitem puzzleitemsel';}
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
		
		if(!!filename){ ui.reffile.set(ui.puzzle, filename);}
		if(!!filetype){ ui.reffiletype.set(ui.puzzle, filetype);}
		ui.misc.setTitle();
		ui.misc.setListCaption(ui.puzzle);
	}
});

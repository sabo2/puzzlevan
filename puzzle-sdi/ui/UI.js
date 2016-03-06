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
	firstboot : true,
	appendPuzzle : function(pzl, filename){
		/* パズルオブジェクトの作成 */
		var puzzle = new pzpr.Puzzle();
		ui.puzzles.push(puzzle);
		
		if(!!filename){
			ui.reffile.set(puzzle, filename);
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
	// ui.closePuzzle()         パズルのクローズ要求が出された時の処理
	// ui.closePuzzleInquiry()  パズルをクローズしていいか問い合わせる
	//---------------------------------------------------------------------------
	closePuzzle : function(){
		if(ui.isMDI){
			if(ui.puzzle && ui.closePuzzleInquiry(ui.puzzle)){
				ui.removePuzzle(ui.puzzle);
			}
			else if(ui.puzzles.length===0){
				ui.win.close();
			}
		}
		else{
			if(ui.closePuzzleInquiry(ui.puzzle)){
				ui.win.close();
			}
		}
	},
	closePuzzleInquiry : function(puzzle){
		if(!puzzle.ismodified()){ return true;}
		
		var msg = ui.misc.selectStr("盤面が更新されていますが、盤面を破棄しますか？", "Do you want to destroy the board regardless of the edited board?");
		var option = {type:'question', message:msg, buttons:['Yes','No']};
		return (ui.remote.dialog.showMessageBox(ui.win, option)===0);
	}
};

require('electron').ipcRenderer.on('update-filename', function(e, filename){
	if(ui.puzzle){
		ui.puzzle.opemgr.initpos = ui.puzzle.opemgr.position; /* modified状態を解消する */
		
		ui.reffile.set(ui.puzzle, filename);
		ui.misc.setTitle();
		ui.misc.setListCaption(ui.puzzle);
	}
});

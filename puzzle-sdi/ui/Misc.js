// Misc.js v3.4.1
/* jshint latedef:false */
/* global ui:false */

//---------------------------------------------------------------------------
// ★Miscクラス html表示系 (Menu, Button以外)の制御を行う
//---------------------------------------------------------------------------
ui.misc = {
	//---------------------------------------------------------------------------
	// misc.displayAll()     全てのメニュー、ボタン、ラベルに対して文字列を設定する
	//---------------------------------------------------------------------------
	displayAll : function(){
		ui.misc.setMenu(false);
		ui.misc.setTitle();
		if(ui.isMDI){
			document.getElementById('puzzlelist').style.display = 'block';
			ui.puzzles.forEach(function(puzzle){ ui.misc.setListCaption(puzzle);});
		}
		ui.toolarea.displayAll();
	},

	//---------------------------------------------------------------------------
	// misc.setTitle()  title表示の設定
	//---------------------------------------------------------------------------
	setTitle : function(){
		if(!ui.isMDI && ui.puzzle){
			var pinfo = pzpr.variety(ui.puzzle.pid);
			document.title = ui.misc.selectStr(pinfo.ja, pinfo.en) + " editor - Puzzlevan";
		}
		if(ui.puzzle){
			var pinfo = pzpr.variety(ui.puzzle.pid);
			document.getElementById('puzzlegenre').innerText = ui.misc.selectStr(pinfo.ja, pinfo.en);
			document.getElementById('puzzlesize').innerText = ''+ui.puzzle.board.cols+'x'+ui.puzzle.board.rows;
			document.getElementById('puzzlefile').innerText = (ui.reffile.has(ui.puzzle) ? ui.reffile.get(ui.puzzle) : '');
		}
		else{
			document.getElementById('puzzlegenre').innerText = '';
			document.getElementById('puzzlesize').innerText = '';
			document.getElementById('puzzlefile').innerText = '';
		}
	},

	//---------------------------------------------------------------------------
	// misc.setListCaption()  パズル一覧部の表記を修正します
	//---------------------------------------------------------------------------
	setListCaption : function(puzzle){
		var listel = ui.reflist.get(puzzle);
		var pinfo = pzpr.variety(puzzle.pid);
		listel.childNodes[0].style.display = (puzzle.ismodified() ? '' : 'none');
		listel.childNodes[1].innerText = ui.misc.selectStr(pinfo.ja, pinfo.en).replace(/\(.+\)/g,'')+' '+puzzle.board.cols+'x'+puzzle.board.rows;
		listel.childNodes[3].innerText = require('path').basename(ui.reffile.has(puzzle) ? ui.reffile.get(puzzle) : '');
	},

	//---------------------------------------------------------------------------
	// misc.setMenu()  メニューの設定を行う
	//---------------------------------------------------------------------------
	setMenu : function(firstset){
		if(ui.puzzle){
			require('electron').ipcRenderer.send('set-puzzle-menu', ui.puzzle.pid, ui.menuconfig.getList(), firstset);
		}
		else{
			require('electron').ipcRenderer.send('set-basic-menu', firstset);
		}
	},

	//---------------------------------------------------------------------------
	// misc.adjustcellsize()  resizeイベント時に、pc.cw, pc.chのサイズを(自動)調節する
	// misc.getBoardPaddingSize() Canvasと境界線の周りの間にあるpaddingのサイズを求めます
	//---------------------------------------------------------------------------
	adjustcellsize : function(){
		if(ui.puzzle){
			ui.puzzle.setCanvasSizeByCellSize(ui.menuconfig.get('cellsizeval'));
		}
	},
	getBoardPaddingSize : function(){
		return 12;
	},

	//--------------------------------------------------------------------------------
	// misc.selectStr()  現在の言語に応じた文字列を返す
	//--------------------------------------------------------------------------------
	selectStr : function(strJP, strEN){
		if(!strEN){ return strJP;}
		return (pzpr.lang==='ja' ? strJP : strEN);
	},

	//--------------------------------------------------------------------------------
	// misc.alert()    現在の言語に応じたダイアログを表示する
	// misc.confirm()  現在の言語に応じた選択ダイアログを表示し、結果を返す
	// misc.erralert() 現在の言語に応じたエラーダイアログを表示する
	//--------------------------------------------------------------------------------
	alert : function(strJP, strEN){
		var msg = ui.misc.selectStr(strJP, strEN);
		var option = {type:'info', message:msg, buttons:['OK']};
		ui.remote.dialog.showMessageBox(ui.win, option);
	},
	confirm : function(strJP, strEN, func){
		var msg = ui.misc.selectStr(strJP, strEN);
		var option = {type:'question', message:msg, buttons:['OK','cancel']};
		function onconfirm(response){ if(response===0){ func();}}
		ui.remote.dialog.showMessageBox(ui.win, option, onconfirm);
	},
	erralert : function(strJP, strEN){
		ui.remote.dialog.showErrorBox("Puzzlevan", ui.misc.selectStr(strJP, strEN));
	},

	//--------------------------------------------------------------------------------
	// misc.failOpen()  パズルのopenに失敗した場合の処理
	//--------------------------------------------------------------------------------
	failOpen : function(puzzle){
		ui.misc.erralert("Fail to import puzzle data or URL.");
		if(!ui.isMDI){
			if(!ui.debugmode){ ui.win.close();}
		}
		else if(!!puzzle){
			ui.removePuzzle(puzzle);
		}
	}
};

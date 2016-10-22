// Misc.js v3.4.1
/* jshint latedef:false */
/* global ui:false, getBasename:false */

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
			if(ui.puzzle.editmode){
				document.getElementById('puzzlemode').innerText = ui.misc.selectStr('[問題入力モード]', '[Edit Mode]');
				document.getElementById('puzzlemode').style.color = '#990000';
			}
			else{
				document.getElementById('puzzlemode').innerText = ui.misc.selectStr('[回答入力モード]', '[Play Mode]');
				document.getElementById('puzzlemode').style.color = '#000099';
			}
			document.getElementById('puzzlefile').innerText = ui.puzzles.getCurrentInfo().filename;
		}
		else{
			document.getElementById('puzzlegenre').innerText = '';
			document.getElementById('puzzlesize').innerText = '';
			document.getElementById('puzzlemode').innerText = '';
			document.getElementById('puzzlefile').innerText = '';
		}
	},

	//---------------------------------------------------------------------------
	// misc.setListCaption()  パズル一覧部の表記を修正します
	//---------------------------------------------------------------------------
	setListCaption : function(puzzle){
		var info = ui.puzzles.getInfo(puzzle);
		var listel = info.listel;
		var pinfo = pzpr.variety(puzzle.pid);
		listel.childNodes[0].style.display = (puzzle.ismodified() ? '' : 'none');
		listel.childNodes[1].innerText = (ui.misc.selectStr(pinfo.ja, pinfo.en)||'').replace(/\(.+\)/g,'')+' '+puzzle.board.cols+'x'+puzzle.board.rows;
		listel.childNodes[3].innerText = getBasename(info.filename);
	},

	//---------------------------------------------------------------------------
	// misc.setMenu()  メニューの設定を行う
	//---------------------------------------------------------------------------
	setMenu : function(firstset){
		if(ui.puzzle){
			var config = ui.menuconfig.getList();
			var pinfo = {pid:ui.puzzle.pid, trialstage:ui.puzzle.board.trialstage};
			electron.ipcRenderer.send('set-puzzle-menu', config, pinfo, firstset);
		}
		else{
			electron.ipcRenderer.send('set-basic-menu', firstset);
		}
	},

	//---------------------------------------------------------------------------
	// misc.adjustcellsize()  resizeイベント時に、pc.cw, pc.chのサイズを(自動)調節する
	// misc.getBoardPaddingSize() Canvasと境界線の周りの間にあるpaddingのサイズを求めます
	//---------------------------------------------------------------------------
	adjustcellsize : function(){
		ui.puzzles.forEach((puzzle)=>{
			puzzle.setCanvasSizeByCellSize(ui.menuconfig.get('cellsizeval'));
		});
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
	// misc.closePuzzleInquiry()  パズルをクローズしていいか問い合わせる
	//--------------------------------------------------------------------------------
	closePuzzleInquiry : function(){
		var msg = ui.misc.selectStr("盤面が更新されていますが、盤面を破棄しますか？", "Do you want to destroy the board regardless of the edited board?");
		var option = {type:'question', message:msg, buttons:['Yes','No']};
		return (ui.remote.dialog.showMessageBox(ui.win, option)===0);
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
			ui.puzzles.delete(puzzle);
		}
	}
};

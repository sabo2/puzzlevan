// Misc.js v3.4.1
/* jshint latedef:false */
/* global ui:false, _doc:false */

//---------------------------------------------------------------------------
// ★Miscクラス html表示系 (Menu, Button以外)の制御を行う
//---------------------------------------------------------------------------
ui.misc = {
	//---------------------------------------------------------------------------
	// misc.displayDesign()  title表示の設定
	//---------------------------------------------------------------------------
	displayDesign : function(){
		var pinfo = pzpr.variety(ui.puzzle.pid);
		var title = ui.selectStr(pinfo.ja, pinfo.en);
		_doc.title = title + " editor - Puzzlevan";
	},

	//---------------------------------------------------------------------------
	// misc.setMenu()  メニューの設定を行う
	//---------------------------------------------------------------------------
	setMenu : function(firstset){
		require('electron').ipcRenderer.send('set-puzzle-menu', ui.puzzle.pid, ui.getCurrentConfigList(), firstset);
	},

	//--------------------------------------------------------------------------------
	// misc.openpuzzle()  指定されたデータのパズルを開く　
	//--------------------------------------------------------------------------------
	openpuzzle : function(data){
		require('electron').ipcRenderer.send('open-puzzle', data, ui.puzzle.pid);
	},

	//--------------------------------------------------------------------------------
	// misc.alert()    現在の言語に応じたダイアログを表示する
	// misc.confirm()  現在の言語に応じた選択ダイアログを表示し、結果を返す
	// misc.erralert() 現在の言語に応じたエラーダイアログを表示する
	//--------------------------------------------------------------------------------
	alert : function(strJP, strEN){
		var msg = ui.selectStr(strJP, strEN);
		var option = {type:'info', message:msg, buttons:['OK']};
		ui.remote.dialog.showMessageBox(ui.win, option);
	},
	confirm : function(strJP, strEN, func){
		var msg = ui.selectStr(strJP, strEN);
		var option = {type:'question', message:msg, buttons:['OK','cancel']};
		function onconfirm(response){ if(response===0){ func();}}
		ui.remote.dialog.showMessageBox(ui.win, option, onconfirm);
	},
	erralert : function(strJP, strEN){
		ui.remote.dialog.showErrorBox("Puzzlevan", ui.selectStr(strJP, strEN));
	}
};

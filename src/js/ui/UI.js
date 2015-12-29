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
	
	/* Electron用のオブジェクト */
	remote    : require('electron').remote,
	win       : require('electron').remote.getCurrentWindow(),
	
	/* どの種類のパズルのメニューを表示しているか */
	currentpid : '',
	
	/* メンバオブジェクト */
	event     : null,
	menuconfig: null,
	menuarea  : null,
	toolarea  : null,

	//---------------------------------------------------------------------------
	// ui.displayAll()     全てのメニュー、ボタン、ラベルに対して文字列を設定する
	// ui.setdisplay()     個別のメニュー、ボタン、ラベルに対して文字列を設定する
	//---------------------------------------------------------------------------
	displayAll : function(){
		ui.toolarea.display();
		ui.misc.displayDesign();
	},
	setdisplay : function(idname){
		ui.toolarea.setdisplay(idname);
	},

	//---------------------------------------------------------------------------
	// ui.adjustcellsize()  resizeイベント時に、pc.cw, pc.chのサイズを(自動)調節する
	// ui.getBoardPaddingSize() Canvasと境界線の周りの間にあるpaddingのサイズを求めます
	//---------------------------------------------------------------------------
	adjustcellsize : function(){
		var uiconf = ui.menuconfig;
		ui.puzzle.setCanvasSizeByCellSize(uiconf.get('cellsizeval'));
	},
	getBoardPaddingSize : function(){
		return 12;
	},

	//--------------------------------------------------------------------------------
	// ui.selectStr()  現在の言語に応じた文字列を返す
	//--------------------------------------------------------------------------------
	selectStr : function(strJP, strEN){
		if(!strEN || !ui.puzzle){ return strJP;}
		return (pzpr.lang==='ja' ? strJP : strEN);
	},

	//---------------------------------------------------------------------------
	// ui.getCurrentConfigList() 現在のパズルで有効な設定と設定値を返す
	//---------------------------------------------------------------------------
	getCurrentConfigList : function(){
		var conf = ui.puzzle.getCurrentConfig(), conf2 = ui.menuconfig.getList();
		for(var idname in conf2){ conf[idname] = conf2[idname];}
		return conf;
	},

	//---------------------------------------------------------------------------
	// ui.setConfig()   値設定の共通処理
	// ui.getConfig()   値設定の共通処理
	// ui.validConfig() 設定が有効なパズルかどうかを返す共通処理
	//---------------------------------------------------------------------------
	setConfig : function(idname, newval){
		if(!!ui.puzzle.config.list[idname]){
			ui.puzzle.setConfig(idname, newval);
		}
		else if(!!ui.menuconfig.list[idname]){
			ui.menuconfig.set(idname, newval);
		}
		else if(idname==='language'){
			pzpr.lang = newval;
			ui.displayAll();
		}
	},
	getConfig : function(idname){
		if(!!ui.puzzle.config.list[idname]){
			return ui.puzzle.getConfig(idname);
		}
		else if(!!ui.menuconfig.list[idname]){
			return ui.menuconfig.get(idname);
		}
		else if(idname==='language'){
			return pzpr.lang;
		}
	},
	validConfig : function(idname){
		if(!!ui.puzzle.config.list[idname]){
			return ui.puzzle.validConfig(idname);
		}
		else if(!!ui.menuconfig.list[idname]){
			return ui.menuconfig.valid(idname);
		}
		else if(idname==='language'){
			return true;
		}
	},

	//---------------------------------------------------------------------------
	// ui.restoreConfig()  保存された各種設定値を元に戻す
	// ui.saveConfig()     各種設定値を保存する
	//---------------------------------------------------------------------------
	restoreConfig : function(){
		var setting = require('electron').ipcRenderer.sendSync('get-puzzle-preference');
		ui.puzzle.restoreConfig(setting.puzzle);
		ui.menuconfig.setAll(setting.ui);
		pzpr.lang = require('electron').ipcRenderer.sendSync('get-app-preference').lang || pzpr.lang;
	},
	saveConfig : function(){
		require('electron').ipcRenderer.send('set-puzzle-preference', {
			puzzle: ui.puzzle.saveConfig(),
			ui:     ui.menuconfig.getAll()
		});
	}
};

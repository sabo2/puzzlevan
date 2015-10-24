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
	remote    : require('remote'),
	win       : require('remote').getCurrentWindow(),
	
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
		return (ui.puzzle.getConfig('language')==='ja' ? strJP : strEN);
	},

	//---------------------------------------------------------------------------
	// ui.getCurrentConfigList() 現在のパズルで有効な設定と設定値を返す
	//---------------------------------------------------------------------------
	getCurrentConfigList : function(){
		var conf = {};
		for(var idname in ui.puzzle.config.list){
			if(ui.puzzle.validConfig(idname)){ conf[idname] = ui.puzzle.getConfig(idname);}
		}
		for(var idname in ui.menuconfig.list){
			if(ui.menuconfig.valid(idname)){ conf[idname] = ui.menuconfig.get(idname);}
		}
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
	},
	getConfig : function(idname){
		if(!!ui.puzzle.config.list[idname]){
			return ui.puzzle.getConfig(idname);
		}
		else if(!!ui.menuconfig.list[idname]){
			return ui.menuconfig.get(idname);
		}
	},
	validConfig : function(idname){
		if(!!ui.puzzle.config.list[idname]){
			return ui.puzzle.validConfig(idname);
		}
		else if(!!ui.menuconfig.list[idname]){
			return ui.menuconfig.valid(idname);
		}
	},

	//---------------------------------------------------------------------------
	// ui.restoreConfig()  保存された各種設定値を元に戻す
	// ui.saveConfig()     各種設定値を保存する
	//---------------------------------------------------------------------------
	restoreConfig : function(){
		var setting = require('ipc').sendSync('get-puzzle-preference');
		ui.puzzle.restoreConfig(JSON.stringify(setting.puzzle));
		ui.menuconfig.setAll(JSON.stringify(setting.ui));
	},
	saveConfig : function(){
		require('ipc').send('set-puzzle-preference', {
			puzzle: JSON.parse(ui.puzzle.saveConfig()),
			ui:     JSON.parse(ui.menuconfig.getAll())
		});
	}
};

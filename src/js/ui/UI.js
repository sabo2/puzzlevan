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
		ui.puzzle.setCanvasSizeByCellSize(ui.menuconfig.get('cellsizeval'));
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
		return ui.menuconfig.getList();
	}
};

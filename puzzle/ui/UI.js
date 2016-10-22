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
	remote    : electron.remote,
	win       : electron.remote.getCurrentWindow(),
	isMDI     :(electron.ipcRenderer.sendSync('get-app-preference').windowmode==='mdi'),
	debugmode : electron.ipcRenderer.sendSync('get-app-preference').debugmode,
	
	/* メンバオブジェクト */
	puzzles   : null,
	event     : null,
	menuconfig: null,
	menuarea  : null,
	toolarea  : null,
	timer     : null
};

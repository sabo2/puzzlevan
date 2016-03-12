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
	isMDI     :(require('electron').ipcRenderer.sendSync('get-app-preference').windowmode==='mdi'),
	debugmode : require('electron').ipcRenderer.sendSync('get-app-preference').debugmode,
	
	/* メンバオブジェクト */
	puzzles   : null,
	event     : null,
	menuconfig: null,
	menuarea  : null,
	toolarea  : null,
	timer     : null
};

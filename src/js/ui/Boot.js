// Boot.js v3.4.0
/* jshint latedef:false */
/* global pzpr:false, ui:false */

(function(){
/********************************/
/* 初期化時のみ使用するルーチン */
/********************************/

var onload_option = {};

//---------------------------------------------------------------------------
//---------------------------------------------------------------------------
function failOpen(){
	ui.misc.erralert("Fail to import puzzle data or URL.");
	if(require('electron').ipcRenderer.sendSync('get-app-preference').debugmode){ ui.win.destroy();}
}

//---------------------------------------------------------------------------
// window.onload直後の処理
//---------------------------------------------------------------------------
require('electron').ipcRenderer.once('initial-data', function(e, data, pid){
	var onload_pzl = (importFileData(data) || importURL(data) || importFileData(data, pid));
	if(!onload_pzl || !onload_pzl.pid){
		failOpen();
		return;
	}
	
	startPuzzle(onload_pzl);
});
function startPuzzle(pzl){
	/* パズルオブジェクトの作成 */
	var element = document.getElementById('divques');
	var puzzle = ui.puzzle = new pzpr.Puzzle(element, onload_option);
	pzpr.connectKeyEvents(puzzle);
	
	/* createPuzzle()後からopen()前に呼ぶ */
	ui.event.onload_func();
	
	// 単体初期化処理のルーチンへ
	puzzle.once('fail-open', failOpen);
	puzzle.open(pzl);
	
	return true;
}

//---------------------------------------------------------------------------
// ★importURL() 初期化時にURLを解析し、パズルの種類・エディタ/player判定を行う
//---------------------------------------------------------------------------
function importURL(search){
	/* index.htmlからURLが入力されていない場合は現在のURLの?以降をとってくる */
	search = search || location.search;
	if(!search){ return null;}
	
	/* 一旦先頭の?記号を取り除く */
	if(search.charAt(0)==="?"){ search = search.substr(1);}
	
	while(search.match(/^(\w+)\=(\w+)\&(.*)/)){
		onload_option[RegExp.$1] = RegExp.$2;
		search = RegExp.$3;
	}
	
	var pzl = pzpr.parser.parseURL(search);
	if(!pzl || !pzl.pid){ return null;}

	return pzl;
}

//---------------------------------------------------------------------------
// ★importFileData() 初期化時にファイルデータの読み込みを行う
//---------------------------------------------------------------------------
function importFileData(fstr, pid){
	/* index.htmlや盤面の複製等でファイルorブラウザ保存データが入力されたかチェック */
	if(!fstr){ return null;}

	var pzl = pzpr.parser.parseFile(fstr, pid||'');
	if(!pzl || !pzl.pid){ return null;}

	return pzl;
}

})();

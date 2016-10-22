// Boot.js v3.4.0
/* jshint latedef:false */
/* global pzpr:false, ui:false */

(function(){
/********************************/
/* 初期化時のみ使用するルーチン */
/********************************/

electron.ipcRenderer.on('initial-data', function(e, data, pid, filename){
	var onload_pzl = (importFileData(data) || importURL(data) || importFileData(data, pid));
	if(!onload_pzl || !onload_pzl.pid){
		ui.misc.failOpen();
	}
	else{
		ui.puzzles.add(onload_pzl, filename);
	}
});

//---------------------------------------------------------------------------
// ★importURL() 初期化時にURLを解析し、パズルの種類・エディタ/player判定を行う
//---------------------------------------------------------------------------
function importURL(search){
	/* index.htmlからURLが入力されていない場合は現在のURLの?以降をとってくる */
	search = search || location.search;
	if(!search){ return null;}
	
	/* 一旦先頭の?記号を取り除く */
	if(search.charAt(0)==="?"){ search = search.substr(1);}
	
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

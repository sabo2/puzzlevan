// Boot.js v3.4.0
/* global pzpr:false, ui:false */

(function(){
/********************************/
/* 初期化時のみ使用するルーチン */
/********************************/
if(!window.pzpr || !window.ui){ setTimeout(arguments.callee,0); return;}

var onload_option = {imagesave:true};

//---------------------------------------------------------------------------
// window.onload直後の処理
//---------------------------------------------------------------------------
require('electron').ipcRenderer.once('initial-data', function(e, data, pid){
	data = data.replace(/[\r\n]+/g,'\n');
	var onload_pzl = (importFileData(data) || importURL(data) || importFileData(data, pid));
	if(!onload_pzl || !onload_pzl.id){
		var pzl = new pzpr.parser.FileData(data, '');
		pzl.parseFileType();
		if(pzl.type===pzpr.parser.FILE_PBOX){
			require('electron').ipcRenderer.send('open-undef-popup', data);
		}
		else{
			ui.misc.erralert("Fail to import puzzle data or URL.");
		}
		ui.win.destroy();
	}
	else{
		pzpr.EDITOR = true;
		pzpr.PLAYER = false;
		
		startPuzzle(onload_pzl);
	}
});
function startPuzzle(pzl){
	/* パズルオブジェクトの作成 */
	var element = document.getElementById('divques');
	var puzzle = ui.puzzle = pzpr.createPuzzle(element, onload_option);
	pzpr.connectKeyEvents(puzzle);
	
	/* createPuzzle()後からopen()前に呼ぶ */
	ui.event.onload_func();
	
	// 単体初期化処理のルーチンへ
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
	if(!pzl || !pzl.id){ return null;}

	return pzl;
}

//---------------------------------------------------------------------------
// ★importFileData() 初期化時にファイルデータの読み込みを行う
//---------------------------------------------------------------------------
function importFileData(fstr, pid){
	/* index.htmlや盤面の複製等でファイルorブラウザ保存データが入力されたかチェック */
	if(!fstr){ return null;}

	var pzl = pzpr.parser.parseFile(fstr, pid||'');
	if(!pzl || !pzl.id){ return null;}

	return pzl;
}

})();

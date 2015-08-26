// Boot.js v3.4.0
/* global pzpr:false, ui:false, ActiveXObject:false */

(function(){
/********************************/
/* 初期化時のみ使用するルーチン */
/********************************/
if(!window.pzpr){ setTimeout(arguments.callee,0); return;}

window.navigator.saveBlob = window.navigator.saveBlob || window.navigator.msSaveBlob;

var onload_pzl = null;
var onload_option = {imagesave:true};

//---------------------------------------------------------------------------
// ★boot() window.onload直後の処理
//---------------------------------------------------------------------------
function boot(){
	if(importData()){ startPuzzle();}
	else{ setTimeout(boot,0);}
}
pzpr.addLoadListener(boot);

function importData(){
	/* pzpr, uiオブジェクト生成待ち */
	if(!window.pzpr || !window.ui){ return false;}
	
	if(!onload_pzl){
		/* 1) 盤面複製・index.htmlからのファイル入力/Database入力か */
		/* 2) URL(?以降)をチェック */
		onload_pzl = (importFileData() || importURL());
		
		/* 指定されたパズルがない場合はさようなら～ */
		if(!onload_pzl || !onload_pzl.id){
			require('remote').require('dialog').showErrorBox( "Fail to import puzzle data or URL." );
			throw new Error("No Include Puzzle Data Exception");
		}
	}
	
	return true;
}

function startPuzzle(){
	var pzl = onload_pzl;
	
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
function importURL(){
	/* index.htmlからURLが入力されたかチェック */
	var search = getStorageData('pzprv3_urldata', 'urldata');
	
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
	
	// エディタモードかplayerモードかの設定
	pzpr.EDITOR = true;
	pzpr.PLAYER = false;

	return pzl;
}

//---------------------------------------------------------------------------
// ★importFileData() 初期化時にファイルデータの読み込みを行う
//---------------------------------------------------------------------------
function importFileData(){
	/* index.htmlや盤面の複製等でファイルorブラウザ保存データが入力されたかチェック */
	var fstr = getStorageData('pzprv3_filedata', 'filedata');
	if(!fstr){ return null;}

	var pzl = pzpr.parser.parseFile(fstr, '');
	if(!pzl){ return null;}

	pzpr.EDITOR = true;
	pzpr.PLAYER = false;
	
	return pzl;
}

//---------------------------------------------------------------------------
// ★getStorageData() localStorageやsesseionStorageのデータを読み込む
//---------------------------------------------------------------------------
function getStorageData(key, key2){
	if(!pzpr.env.storage.localST || !pzpr.env.storage.session){ return null;}

	// 移し変える処理
	var str = localStorage[key];
	if(typeof str==="string"){
		delete localStorage[key];
		sessionStorage[key2] = str;
	}

	str = sessionStorage[key2];
	return (typeof str==="string" ? str : null);
}

})();

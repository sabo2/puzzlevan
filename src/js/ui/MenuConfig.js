// MenuConfig.js v3.4.1
/* global pzpr:false, ui:false */

(function(){
//---------------------------------------------------------------------------
// ★MenuConfigクラス UI側の設定値を管理する
//---------------------------------------------------------------------------
var Config = pzpr.Puzzle.prototype.Config.prototype;

// メニュー描画/取得/html表示系
// Menuクラス
ui.menuconfig = {

	list : null,			// MenuConfigの設定内容を保持する

	//---------------------------------------------------------------------------
	// menuconfig.init()  MenuConfigの初期化を行う
	// menuconfig.add()   初期化時に設定を追加する
	//---------------------------------------------------------------------------
	init : function(){
		this.list = {};
		
		this.add('autocheck',      false);					/* 正解自動判定機能 */
		this.add('autocheck_once', false);					/* 正解自動判定機能 */
		
		this.add('undointerval', 20);						/* Undo/Redo連続実行間隔 */

		this.add('cellsizeval', 36);						/* セルのサイズ設定用 */
		
		this.add('buttonarea', true);						/* ボタン類の表示 */
	},
	add : Config.add,

	//---------------------------------------------------------------------------
	// menu.set()   アイスと○などの表示切り替え時の処理を行う
	// menu.get()   html上の[戻][進]ボタンを押すことが可能か設定する
	//---------------------------------------------------------------------------
	set : function(idname, newval){
		if(!this.list[idname]){ return;}
		newval = this.setproper(idname, newval);
		this.configevent(idname,newval);
	},
	get : Config.get,

	//---------------------------------------------------------------------------
	// menu.getAll()  全フラグの設定値を返す
	// menu.setAll()  全フラグの設定値を設定する
	//---------------------------------------------------------------------------
	getAll : function(){
		var object = {};
		for(var key in this.list){
			var item = this.list[key];
			if(item.val!==item.defval){ object[key] = item.val;}
		}
		delete object.autocheck_once;
		return JSON.stringify(object);
	},
	setAll : function(json){
		Config.setAll.call(this, json);
		this.list.autocheck_once.val = this.list.autocheck.val;
	},

	//---------------------------------------------------------------------------
	// menuconfig.setproper()    設定値の型を正しいものに変換して設定変更する
	// menuconfig.valid()        設定値が有効なパズルかどうかを返す
	//---------------------------------------------------------------------------
	setproper : Config.setproper,
	valid : function(idname){
		return !!this.list[idname];
	},

	//---------------------------------------------------------------------------
	// config.configevent()  設定変更時の動作を記述する
	//---------------------------------------------------------------------------
	configevent : function(idname, newval){
		ui.setdisplay(idname);
		if(idname==='cellsizeval'){ ui.adjustcellsize();}
		else if(idname==='autocheck'){ this.list.autocheck_once.val = newval;}
	}
};

})();
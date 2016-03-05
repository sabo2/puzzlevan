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

		/* puzzle.configを一括で扱うため登録 */
		for(var name in ui.puzzle.config.list){
			this.add(name, ui.puzzle.config.list[name].defval, ui.puzzle.config.list[name].option);
			this.list[name].volatile = true;
			this.list[name].puzzle = true;
		}
	},
	add : Config.add,

	//---------------------------------------------------------------------------
	// menuconfig.sync()  URL形式などによって変化する可能性がある設定値を同期する
	//---------------------------------------------------------------------------
	sync : function(){
		var idname = null;
		switch(ui.puzzle.pid){
			case 'yajirin':   idname = 'disptype_yajilin';   break;
			case 'pipelinkr': idname = 'disptype_pipelinkr'; break;
			case 'bosanowa':  idname = 'disptype_bosanowa';  break;
		}
		if(!!idname){ this.set(idname, ui.puzzle.getConfig(idname));}
	},

	//---------------------------------------------------------------------------
	// menuconfig.get()  各フラグの設定値を返す
	// menuconfig.set()  各フラグの設定値を設定する
	// menuconfig.reset() 各フラグの設定値を初期化する
	//---------------------------------------------------------------------------
	set : function(idname, newval){
		if(!this.list[idname]){ return;}
		
		newval = this.setproper(idname, newval);
		if(this.list[idname].puzzle){ ui.puzzle.setConfig(idname, newval);}
		
		this.configevent(idname,newval);
	},
	get : Config.get,
	reset : Config.reset,

	//---------------------------------------------------------------------------
	// menuconfig.restore()  保存された各種設定値を元に戻す
	// menuconfig.save()     各種設定値を保存する
	//---------------------------------------------------------------------------
	restore : function(){
		/* 設定が保存されている場合は元に戻す */
		ui.puzzle.config.init();
		this.init();
		var setting = require('electron').ipcRenderer.sendSync('get-puzzle-preference');
		this.setAll(setting.puzzle);
		this.setAll(setting.ui);
		pzpr.lang = require('electron').ipcRenderer.sendSync('get-app-preference').lang || pzpr.lang;
	},
	save : function(){
		require('electron').ipcRenderer.send('set-puzzle-preference', {
			puzzle: ui.puzzle.saveConfig(),
			ui:     this.getAll()
		});
	},

	//---------------------------------------------------------------------------
	// config.getList()  現在有効な設定値のリストを返す
	//---------------------------------------------------------------------------
	getList : Config.getList,
	getexec : function(name){
		if(!this.list[name]){ return false;}
		if(this.list[name].puzzle){ return ui.puzzle.validConfig(name);}
		return true;
	},

	//---------------------------------------------------------------------------
	// menu.getAll()  全フラグの設定値を返す
	// menu.setAll()  全フラグの設定値を設定する
	//---------------------------------------------------------------------------
	getAll : Config.getAll,
	setAll : function(setting){
		for(var key in setting){ this.set(key,setting[key]);}
		this.list.autocheck_once.val = this.list.autocheck.val;
	},

	//---------------------------------------------------------------------------
	// menuconfig.setproper()    設定値の型を正しいものに変換して設定変更する
	// menuconfig.valid()        設定値が有効なパズルかどうかを返す
	//---------------------------------------------------------------------------
	setproper : Config.setproper,
	valid : function(idname){
		if(!!this.list[name]){ return false;}
		if(idname==='mode'){ return true;}
		else if(this.list[idname].puzzle){ return ui.puzzle.validConfig(idname);}
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
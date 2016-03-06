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
		if(!!this.list[idname]){
			newval = this.setproper(idname, newval);
		}
		else if(ui.puzzle && !!ui.puzzle.config.list[idname]){
			ui.puzzles.forEach(function(puzzle){
				puzzle.setConfig(idname, newval);
			});
			newval = ui.puzzle.getConfig(idname);
		}
		else if(idname==='language'){
			pzpr.lang = newval;
		}
		else{ return;}
		this.configevent(idname,newval);
	},
	get : function(idname){
		if(!!this.list[idname]){
			return this.list[idname].val;
		}
		else if(ui.puzzle && !!ui.puzzle.config.list[idname]){
			return ui.puzzle.config.get(idname);
		}
		return null;
	},
	reset : function(idname){
		if(!!this.list[idname]){
			this.set(idname, this.list[idname].defval);
		}
		else if(ui.puzzle && !!ui.puzzle.config.list[idname]){
			ui.puzzle.config.set(idname, ui.puzzle.config.list[idname].defval);
		}
	},

	//---------------------------------------------------------------------------
	// config.getList()  現在有効な設定値のリストを返す
	//---------------------------------------------------------------------------
	getList : function(){
		var conf = (ui.puzzle ? ui.puzzle.config.getList() : {});
		for(var idname in this.list){
			if(this.getexec(idname)){ conf[idname] = this.get(idname);}
		}
		return conf;
	},
	getexec : function(idname){
		if(!!this.list[idname]){
			return true;
		}
		else if(ui.puzzle && !!ui.puzzle.config.list[idname]){
			return ui.puzzle.validConfig(name);
		}
		return false;
	},

	//---------------------------------------------------------------------------
	// menuconfig.restore()  保存された各種設定値を元に戻す
	// menuconfig.save()     各種設定値を保存する
	//---------------------------------------------------------------------------
	restore : function(){
		/* 設定が保存されている場合は元に戻す */
		this.init();
		this.setAll(require('electron').ipcRenderer.sendSync('get-ui-preference'));
		pzpr.lang = require('electron').ipcRenderer.sendSync('get-app-preference').lang || pzpr.lang;
	},
	save : function(){
		require('electron').ipcRenderer.send('set-ui-preference', this.getAll());
	},

	//---------------------------------------------------------------------------
	// menuconfig.restorePuzzle()  パズルごとに保存された各種設定値を元に戻す
	// menuconfig.savePuzzle()     パズルごとの各種設定値を保存する
	//---------------------------------------------------------------------------
	restorePuzzle : function(){
		ui.puzzle.config.init();
		this.setAll(require('electron').ipcRenderer.sendSync('get-puzzle-preference'));
	},
	savePuzzle : function(){
		require('electron').ipcRenderer.send('set-puzzle-preference', ui.puzzle.saveConfig());
	},

	//---------------------------------------------------------------------------
	// menu.getAll()  全フラグの設定値を返す
	// menu.setAll()  全フラグの設定値を設定する
	//---------------------------------------------------------------------------
	getAll : function(){
		var object = (ui.puzzle ? ui.puzzle.config.getList() : {});
		for(var key in this.list){
			var item = this.list[key];
			if(item.val!==item.defval && !item.volatile){ object[key] = item.val;}
		}
		return object;
	},
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
		if(!!this.list[name]){ return !!this.list[idname];}
		else if(ui.puzzle && !!ui.puzzle.config.list[idname]){ return ui.puzzle.validConfig(idname);}
		else if(idname==='mode'){ return true;}
		return false;
	},

	//---------------------------------------------------------------------------
	// config.configevent()  設定変更時の動作を記述する
	//---------------------------------------------------------------------------
	configevent : function(idname, newval){
		ui.toolarea.setdisplay(idname);
		if(idname==='cellsizeval'){ ui.misc.adjustcellsize();}
		else if(idname==='autocheck'){ this.list.autocheck_once.val = newval;}
		else if(idname==='language'){ ui.misc.displayAll();}
	}
};

require('electron').ipcRenderer.on('config-req', function(e, idname, val){
	ui.menuconfig.set(idname, val);
});

})();
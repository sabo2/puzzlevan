// Event.js v3.4.0
/* global ui:false, _doc:false */

//---------------------------------------------------------------------------
// ★UIEventsクラス イベント設定の管理を行う
//---------------------------------------------------------------------------
// メニュー描画/取得/html表示系
ui.event =
{
	//----------------------------------------------------------------------
	// event.addEvent()        addEventListener(など)を呼び出す
	// event.removeAllEvents() addEventで登録されたイベントを削除する
	//----------------------------------------------------------------------
	evlist : [],
	addEvent : function(el, event, self, callback, capt){
		var func = pzpr.util.addEvent(el, event, self, callback, !!capt);
		this.evlist.push({el:el, event:event, func:func, capt:!!capt});
	},
	removeAllEvents : function(){
		var islt = !!_doc.removeEventListener;
		for(var i=0,len=this.evlist.length;i<len;i++){
			var e=this.evlist[i];
			if(islt){ e.el.removeEventListener(e.event, e.func, e.capt);}
			else    { e.el.detachEvent('on'+e.event, e.func);}
		}
		this.evlist=[];
	},

	//---------------------------------------------------------------------------
	// event.setWindowEvents()  マウス入力、キー入力以外のイベントの設定を行う
	//---------------------------------------------------------------------------
	setWindowEvents : function(){
		// File API＋Drag&Drop APIの設定
		this.addEvent(window, 'dragover', this, function(e){ e.preventDefault();}, true);
		this.addEvent(window, 'drop', this, function(e){
			Array.prototype.slice.call(e.dataTransfer.files||[]).forEach(function(file){
				var reader = new FileReader();
				reader.onload = function(e){ ui.misc.openpuzzle(e.target.result);};
				reader.readAsText(file);
			});
			e.preventDefault();
			e.stopPropagation();
		}, true);

		// onBlurにイベントを割り当てる
		this.addEvent(window, 'blur', this, this.onblur_func);

		// onFocusにイベントを割り当てる
		this.addEvent(window, 'focus', this, this.onfocus_func);

		// onbeforeunloadイベントを割り当てる
		this.addEvent(window, 'beforeunload', this, this.onbeforeunload_func);

		// onunloadイベントを割り当てる
		this.addEvent(window, 'unload', this, this.onunload_func);

		// エラー表示を消去する
		this.addEvent(document.getElementById('quesboard'), 'mousedown', this, function(e){
			ui.puzzle.errclear();
			e.stopPropagation();
		});
	},

	//---------------------------------------------------------------------------
	// event.onload_func()   ウィンドウを開いた時に呼ばれる関数
	// event.onunload_func() ウィンドウをクローズする前に呼ばれる関数
	//---------------------------------------------------------------------------
	onload_func : function(){
		ui.menuconfig.init();
		ui.restoreConfig();
		
		ui.listener.setListeners(ui.puzzle);
	},
	onunload_func : function(){
		ui.saveConfig();
	},

	//---------------------------------------------------------------------------
	// event.onblur_func()   ウィンドウからフォーカスが離れた時に呼ばれる関数
	// event.onfocus_func()  ウィンドウがフォーカスされた時に呼ばれる関数
	// event.onbeforeunload_func()  ウィンドウをクローズする前に呼ばれる関数
	//---------------------------------------------------------------------------
	onblur_func : function(){
		ui.puzzle.key.keyreset();
		ui.puzzle.mouse.mousereset();
	},
	onfocus_func : function(){
		if(process.platform==='darwin'){
			ui.misc.setMenu();
		}
	},
	onbeforeunload_func : function(e){
		if(!ui.puzzle.ismodified()){ return;}
		
		var msg = ui.selectStr("盤面が更新されていますが、盤面を破棄しますか？", "Do you want to destroy the board regardless of the edited board?");
		var option = {type:'question', message:msg, buttons:['Yes','No']};
		return (e.returnValue = (ui.remote.dialog.showMessageBox(ui.win, option)===0));
	}
};

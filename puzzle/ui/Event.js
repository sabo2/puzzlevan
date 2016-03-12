// Event.js v3.4.0
/* global ui:false */

//---------------------------------------------------------------------------
// ★UIEventsクラス イベント設定の管理を行う
//---------------------------------------------------------------------------
// メニュー描画/取得/html表示系
ui.event =
{
	//---------------------------------------------------------------------------
	// event.setWindowEvents()  マウス入力、キー入力以外のイベントの設定を行う
	//---------------------------------------------------------------------------
	setWindowEvents : function(){
		// File API＋Drag&Drop APIの設定
		window.addEventListener('dragover', function(e){ e.preventDefault();}, true);
		window.addEventListener('drop', function(e){
			Array.prototype.slice.call(e.dataTransfer.files||[]).forEach(function(file){
				require('electron').ipcRenderer.send('open-file', file.path);
			});
			e.preventDefault();
			e.stopPropagation();
		}, true);

		// onBlurにイベントを割り当てる
		window.addEventListener('blur', this.onblur_func, false);

		// onFocusにイベントを割り当てる
		window.addEventListener('focus', this.onfocus_func, false);

		// onloadイベントを割り当てる
		pzpr.on('load', this.onload_func);

		// onbeforeunloadイベントを割り当てる
		window.addEventListener('beforeunload', this.onbeforeunload_func, false);

		// onunloadイベントを割り当てる
		window.addEventListener('unload', this.onunload_func, false);
	},

	//---------------------------------------------------------------------------
	// event.onload_func()   ウィンドウを開いた時に呼ばれる関数
	// event.onunload_func() ウィンドウをクローズする前に呼ばれる関数
	//---------------------------------------------------------------------------
	onload_func : function(){
		ui.menuconfig.restoreUI();
		ui.toolarea.init();
		
		ui.misc.displayAll();
		
		// エラー表示を消去する
		pzpr.util.addEvent(document.getElementById('quesboard'), 'mousedown', this, function(e){
			if(ui.puzzle){ ui.puzzle.errclear();}
			e.stopPropagation();
		});
	},
	onunload_func : function(){
		ui.menuconfig.saveUI();
	},

	//---------------------------------------------------------------------------
	// event.onblur_func()   ウィンドウからフォーカスが離れた時に呼ばれる関数
	// event.onfocus_func()  ウィンドウがフォーカスされた時に呼ばれる関数
	// event.onbeforeunload_func()  ウィンドウをクローズする前に呼ばれる関数
	//---------------------------------------------------------------------------
	onblur_func : function(){
		if(ui.puzzle){
			ui.puzzle.key.keyreset();
			ui.puzzle.mouse.mousereset();
		}
	},
	onfocus_func : function(){
		if(process.platform==='darwin'){
			ui.misc.setMenu(false);
		}
	},
	onbeforeunload_func : function(e){
		if(ui.puzzles.some((puzzle) => puzzle.ismodified())){
			e.returnValue = ui.misc.closePuzzleInquiry();
		}
	}
};

/* Windowへのイベント設定 */
ui.event.setWindowEvents();

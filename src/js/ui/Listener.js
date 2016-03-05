// Listener.js v3.4.1
/* global ui:false */

//---------------------------------------------------------------------------
// ★UIListener Puzzleに付加するListenerイベント設定の管理を行う
//  注意：execListenerで呼び出される関数は、thisがui.listenerになっていません
//---------------------------------------------------------------------------
ui.listener =
{
	//---------------------------------------------------------------------------
	// listener.setListeners()  PuzzleのListenerを登録する
	//---------------------------------------------------------------------------
	setListeners : function(puzzle){
		puzzle.on('ready',    this.onReady);
		puzzle.on('canvasReady', this.onCanvasReady);
		
		puzzle.on('key',      this.onKeyInput);
		puzzle.on('mouse',    this.onMouseInput);
		puzzle.on('history',  this.onHistoryChange);
		
		puzzle.on('adjust',     this.onAdjust);
		puzzle.on('resize',     this.onResize);
	},

	//---------------------------------------------------------------------------
	// listener.onReady()  パズル読み込み完了時に呼び出される関数
	// listener.onCanvasReady()  Canvas準備完了時に呼び出される関数
	//---------------------------------------------------------------------------
	onReady : function(puzzle){
		/* パズルの種類が同じならMenuArea等の再設定は行わない */
		if(ui.currentpid !== puzzle.pid){
			/* 以前設定済みのイベントを削除する */
			ui.event.removeAllEvents();
			
			/* メニュー用の設定を消去・再設定する */
			ui.toolarea.reset();
			ui.misc.displayDesign();
			
			/* Windowへのイベント設定 */
			ui.event.setWindowEvents();
		}
		
		ui.menuconfig.sync();
		ui.menuconfig.set('autocheck_once', ui.menuconfig.get('autocheck'));
		ui.currentpid = puzzle.pid;
		
		ui.adjustcellsize();
		
		ui.timer.reset();					/* タイマーリセット(最後) */
	},
	onCanvasReady : function(puzzle){
		if(ui.win.isVisible()){
			ui.win.focus();
		}
		else{
			ui.win.show();
			ui.misc.setMenu(true);
		}
	},

	//---------------------------------------------------------------------------
	// listener.onKeyInput()    キー入力時に呼び出される関数 (return false = 処理をキャンセル)
	// listener.onMouseInput()  盤面へのマウス入力時に呼び出される関数 (return false = 処理をキャンセル)
	// listener.onHistoryChange() 履歴変更時に呼び出される関数
	//---------------------------------------------------------------------------
	onKeyInput : function(puzzle, c){
		var kc = puzzle.key, ut = ui.undotimer, result = true;
		if(kc.keydown){
			/* TimerでUndo/Redoする */
			if(c==='ctrl+z' || c==='meta+z'){ ut.startKeyUndo(); result = false;}
			if(c==='ctrl+y' || c==='meta+y'){ ut.startKeyRedo(); result = false;}
		}
		else if(kc.keyup){
			/* TimerのUndo/Redoを停止する */
			if(c==='ctrl+z' || c==='meta+z'){ ut.stopKeyUndo(); result = false;}
			if(c==='ctrl+y' || c==='meta+y'){ ut.stopKeyRedo(); result = false;}
		}
		
		if(!kc.isCTRL && !kc.isMETA){ ut.reset();}
		else if(!kc.isZ){ ut.stopKeyUndo();}
		else if(!kc.isY){ ut.stopKeyRedo();}
		
		kc.cancelEvent = !result;
	},
	onMouseInput : function(puzzle){
		var mv = puzzle.mouse, result = true;
		if(mv.mousestart && mv.btn==='middle'){ /* 中ボタン */
			ui.menuconfig.set('mode', puzzle.playmode ? 'edit' : 'play');
			mv.mousereset();
			result = false;
		}
		else if(ui.puzzle.pid === "goishi"){
			if(mv.mousestart && ui.puzzle.playmode){
				if(mv.btn==='left'){
					var cell = mv.getcell();
					if(cell.isnull || !cell.isStone() || cell.anum!==-1){
						ui.undotimer.startAnswerRedo();
						result = false;
					}
				}
				else if(mv.btn==='right'){
					ui.undotimer.startAnswerUndo();
					result = false;
				}
			}
			else if(mv.mouseend){
				ui.undotimer.stop();
				result = false;
			}
		}
		
		mv.cancelEvent = !result;
	},
	onHistoryChange : function(puzzle){
		if(!!ui.currentpid){
			ui.toolarea.setdisplay("operation");
		}
	},

	//---------------------------------------------------------------------------
	// listener.onAdjust()  盤面の大きさが変わったときの処理を呼び出す
	//---------------------------------------------------------------------------
	onAdjust : function(puzzle){
		ui.adjustcellsize();
	},

	//---------------------------------------------------------------------------
	// listener.onResize()  canvasのサイズを変更したときの処理を呼び出す
	//---------------------------------------------------------------------------
	onResize : function(puzzle){
		puzzle.canvas.parentNode.style.padding = ui.getBoardPaddingSize()+'px';
		
		var width = pzpr.util.getRect(puzzle.canvas.parentNode).width|0;
		if(width<=0){ return;}
		var winsize = ui.win.getContentSize();
		ui.win.setContentSize(width, winsize[1]);
		
		var height = (pzpr.util.getRect(document.body).height+8)|0;
		ui.win.setContentSize(width, height);
	}
};

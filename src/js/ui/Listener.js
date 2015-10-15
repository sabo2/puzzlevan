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
		puzzle.addListener('ready',    this.onReady);
//		puzzle.addListener('openurl',  this.onOpenURL);
//		puzzle.addListener('openfile', this.onOpenFile);
		
		puzzle.addListener('key',      this.onKeyInput);
		puzzle.addListener('mouse',    this.onMouseInput);
		puzzle.addListener('history',  this.onHistoryChange);
		
		puzzle.addListener('config',     this.onConfigSet);
		
		puzzle.addListener('adjust',     this.onAdjust);
		puzzle.addListener('resize',     this.onResize);
	},

	//---------------------------------------------------------------------------
	// listener.onReady()  パズル読み込み完了時に呼び出される関数
	//---------------------------------------------------------------------------
	onReady : function(puzzle){
		var pid = puzzle.pid;
		
		/* 初回だけ */
		if(!ui.currentpid){
			ui.initImageSaveMethod(puzzle);
		}
		
		/* パズルの種類が同じならMenuArea等の再設定は行わない */
		if(ui.currentpid !== pid){
			/* 以前設定済みのイベントを削除する */
			ui.event.removeAllEvents();
			
			/* メニュー用の設定を消去・再設定する */
			ui.menuarea.reset();
			ui.toolarea.reset();
			ui.popupmgr.reset();
			ui.misc.displayDesign();
			
			/* Windowへのイベント設定 */
			ui.event.setWindowEvents();
		}
		
		ui.currentpid = pid;
		
		ui.adjustcellsize();
		
		ui.timer.reset();					/* タイマーリセット(最後) */
		
		if(ui.win.isVisible()){ ui.win.focus();}
	},

//	//---------------------------------------------------------------------------
//	// listener.onOpenURL()  URL読み込み終了時に呼び出される関数 (readyより前)
//	// listener.onOpenFile() ファイルデータ読み込み終了時に呼び出される関数 (readyより前)
//	// listener.setImportData() 上記関数の共通処理
//	//---------------------------------------------------------------------------
//	onOpenURL : function(puzzle, url){
//		ui.listener.setImportData('urldata', url);
//	},
//	onOpenFile : function(puzzle, filestr){
//		ui.listener.setImportData('filedata', filestr);
//	},
//	setImportData : function(key, str){
//		delete localStorage['filedata'];
//		delete localStorage['urldata'];
//		if(str!==void 0){
//			sessionStorage[key] = str;
//		}
//	},

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
		
		return result;
	},
	onMouseInput : function(puzzle){
		var mv = puzzle.mouse, result = true;
		if(mv.mousestart && mv.btn.Middle){ /* 中ボタン */
			puzzle.modechange();
			mv.mousereset();
			result = false;
		}
		else if(ui.puzzle.pid === "goishi"){
			if(mv.mousestart && ui.puzzle.playmode){
				if(mv.btn.Left){
					var cell = mv.getcell();
					if(cell.isnull || !cell.isStone() || cell.anum!==-1){
						ui.undotimer.startAnswerRedo();
						result = false;
					}
				}
				else if(mv.btn.Right){
					ui.undotimer.startAnswerUndo();
					result = false;
				}
			}
			else if(mv.mouseend){
				ui.undotimer.stop();
				result = false;
			}
		}
		
		return result;
	},
	onHistoryChange : function(puzzle){
		if(!!ui.currentpid){
			ui.toolarea.setdisplay("operation");
		}
	},

	//---------------------------------------------------------------------------
	// listener.onConfigSet()  config設定時に呼び出される関数
	//---------------------------------------------------------------------------
	onConfigSet : function(puzzle, idname, newval){
		ui.setdisplay(idname);
		
		if(idname==='mode'){
			ui.setdisplay('bgcolor');
		}
		else if(idname==='language'){
			ui.displayAll();
			puzzle.adjustCanvasPos();
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
		var pc = puzzle.painter, val = (ui.getBoardPadding()*Math.min(pc.cw, pc.ch))|0;
		puzzle.canvas.parentNode.style.padding = val+'px';
		
		var width = pzpr.util.getRect(puzzle.canvas.parentNode).width|0;
		if(width<=0){ return;}
		var winsize = ui.win.getContentSize();
		ui.win.setContentSize(width, winsize[1]);
		
		var height = (pzpr.util.getRect(document.body).height+8)|0;
		ui.win.setContentSize(width, height);
		
		if(!ui.win.isVisible()){
			setTimeout(function(){ui.win.show();},100);
		}
	}
};

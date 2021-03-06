// ToolArea.js v3.4.0
/* global ui:false, getEL:false */

// メニュー描画/取得/html表示系
// toolareaオブジェクト
ui.toolarea = {
	items : null,		// ツールパネルのエレメント等を保持する
	captions : [],		// 言語指定を切り替えた際のキャプションを保持する

	//---------------------------------------------------------------------------
	// toolarea.init()  ツールパネル・ボタン領域の初期設定を行う
	//---------------------------------------------------------------------------
	init : function(){
		this.items = {};
		this.walkElement();
	},

	//---------------------------------------------------------------------------
	// toolarea.walkElement()  エレメントを探索して領域の初期設定を行う
	//---------------------------------------------------------------------------
	walkElement : function(parent){
		/* ボタン領域 */
		var els = getEL('btnarea').querySelectorAll('button[data-button-exec]');
		for(var i=0;i<els.length;i++){
			pzpr.util.addEvent(els[i], "click", this, this[els[i].dataset.buttonExec]);
		}
		
		els = getEL('btnarea').querySelectorAll('button[data-press-exec]');
		for(var i=0;i<els.length;i++){
			var roles = els[i].dataset.pressExec.split(/,/);
			pzpr.util.addEvent(els[i], "mousedown", this, this[roles[0]]);
			if(!!roles[1]){
				pzpr.util.addEvent(els[i], "mouseup", this, this[roles[1]]);
			}
		}
		
		els = getEL('btnarea').querySelectorAll('button');
		for(var i=0;i<els.length;i++){
			var el = els[i].firstChild;
			if(el.nodeType===3 && el.data.match(/^__(.+)__(.+)__$/)){
				this.captions.push({textnode:el, str_jp:RegExp.$1, str_en:RegExp.$2});
			}
		}
		
		this.displayByPid();
	},
	
	//---------------------------------------------------------------------------
	// toolarea.displayByPid()  要素のdata-pidカスタム属性によって表示するしないを切り替える
	//---------------------------------------------------------------------------
	displayByPid : function(){
		var els = getEL('btnarea').querySelectorAll('button[data-disp-pid]');
		for(var i=0;i<els.length;i++){
			var isdisp = false;
			if(!!ui.puzzle){ isdisp = pzpr.util.checkpid(els[i].dataset.dispPid, ui.puzzle.pid);}
			els[i].style.display = (isdisp ? "" : "none");
		}
	},
	
	//---------------------------------------------------------------------------
	// toolarea.displayAll() 全てのラベルに対して文字列を設定する
	// toolarea.setdisplay() 管理パネルに表示する文字列を個別に設定する
	//---------------------------------------------------------------------------
	displayAll : function(){
		/* ボタン領域 */
		/* --------- */
		getEL('btnarea').style.display = (ui.menuconfig.get("buttonarea") ? '' : 'none');
		pzpr.util.unselectable(getEL('btnarea'));
		
		this.setdisplay("operation");
		getEL('btnclear2').style.display  = (!ui.puzzle || !ui.puzzle.board.disable_subclear ? "" : "none");
		getEL('btncolor').style.display   = (ui.puzzle && ui.puzzle.pid==='tentaisho' ? "" : "none");
		getEL('btnirowake').style.display = (ui.puzzle && ui.puzzle.painter.irowake ? "" : "none");
		getEL('btnirowakeblk').style.display = (ui.puzzle && ui.puzzle.painter.irowakeblk ? "" : "none");
		this.setdisplay("trialmode");
		this.displayByPid();
		
		/* 共通：キャプションの設定 */
		/* --------------------- */
		for(var i=0;i<this.captions.length;i++){
			var obj = this.captions[i];
			obj.textnode.data = ui.misc.selectStr(obj.str_jp, obj.str_en);
		}
	},
	setdisplay : function(idname){
		if(idname==="operation"){
			if(ui.puzzle){
				var opemgr = ui.puzzle.opemgr;
				getEL('btnundo').style.color = (!opemgr.enableUndo ? 'silver' : '');
				getEL('btnredo').style.color = (!opemgr.enableRedo ? 'silver' : '');
			}
		}
		else if(idname==="trialmode"){
			var trialstage = (!!ui.puzzle ? ui.puzzle.board.trialstage : null);
			getEL('btntrial').style.color       = ((trialstage>0) ? 'silver' : '');
			getEL('btntrialarea').style.display = ((trialstage>0) ? 'block' : 'none');
			
			getEL('btntrialr').style.display  = ((trialstage<=1) ? '' : 'none');
			getEL('btntrialr2').style.display = ((trialstage>1)  ? '' : 'none');
			getEL('btntrialra').style.display = ((trialstage>1)  ? '' : 'none');
		}
		else if(idname==='buttonarea'){
			getEL('btnarea').style.display = (ui.menuconfig.get("buttonarea") ? '' : 'none');
			if(ui.puzzle){ ui.listener.onResize(ui.puzzle);}
		}
	},

	//---------------------------------------------------------------------------
	// Canvas下にあるボタンが押された/放された時の動作
	//---------------------------------------------------------------------------
	answercheck : function(){ ui.toolarea.anscheck();},
	undo     : function(){ ui.undotimer.startButtonUndo();},
	undostop : function(){ ui.undotimer.stopButtonUndo();},
	redo     : function(){ ui.undotimer.startButtonRedo();},
	redostop : function(){ ui.undotimer.stopButtonRedo();},
	ansclear : function(){ ui.toolarea.ACconfirm();},
	subclear : function(){ ui.toolarea.ASconfirm();},
	dropblocks  : function(){ ui.puzzle.board.operate('drop');},
	resetblocks : function(){ ui.puzzle.board.operate('resetpos');},
	showgatenum : function(){ ui.puzzle.board.operate('showgatenumber');},
	hidegatenum : function(){ ui.puzzle.board.operate('hidegatenumber');},
	enterTrial         : function(){ if(ui.puzzle.board.trialstage===0){ ui.puzzle.enterTrial();}},
	enterFurtherTrial  : function(){ ui.puzzle.enterTrial();},
	acceptTrial        : function(){ ui.puzzle.acceptTrial();},
	rejectTrial        : function(){ ui.puzzle.rejectTrial();},
	rejectCurrentTrial : function(){ ui.puzzle.rejectCurrentTrial();},
	irowake  : function(){ ui.puzzle.irowake();},
	encolorall : function(){ ui.puzzle.board.encolorall();}, /* 天体ショーのボタン */

	//---------------------------------------------------------------------------
	// toolarea.toggledisp()   帰ってきたパイプリンクでアイスと○などの表示切り替え時の処理を行う
	//---------------------------------------------------------------------------
	toggledisp : function(){
		var current = ui.menuconfig.get('disptype_pipelinkr');
		ui.menuconfig.set('disptype_pipelinkr', (current===1?2:1));
	},

	//------------------------------------------------------------------------------
	// toolarea.anscheck()   「正答判定」ボタンを押したときの処理
	// toolarea.ACconfirm()  「回答消去」ボタンを押したときの処理
	// toolarea.ASconfirm()  「補助消去」ボタンを押したときの処理
	//------------------------------------------------------------------------------
	anscheck : function(){
		if(!ui.puzzle){ return;}
		ui.misc.alert(ui.puzzle.check(true).text);
	},
	ACconfirm : function(){
		if(!ui.puzzle){ return;}
		ui.misc.confirm("回答を消去しますか？","Do you want to erase the Answer?", function(){ ui.puzzle.ansclear();});
	},
	ASconfirm : function(){
		if(!ui.puzzle){ return;}
		ui.misc.confirm("補助記号を消去しますか？","Do you want to erase the auxiliary marks?", function(){ ui.puzzle.subclear();});
	}
};

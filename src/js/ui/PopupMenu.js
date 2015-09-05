// Menu.js v3.4.0
/* global Candle:false, ui:false, _doc:false, getEL:false */

//---------------------------------------------------------------------------
// ★PopupManagerクラス ポップアップメニューを管理します
//---------------------------------------------------------------------------
ui.popupmgr =
{
	popup     : null,	/* 表示中のポップアップメニュー */
	
	popups    : {},		/* 管理しているポップアップメニューのオブジェクト一覧 */
	
	movingpop : null,	/* 移動中のポップアップメニュー */
	offset : {px:0, py:0},	/* 移動中ポップアップメニューのページ左上からの位置 */
	
	//---------------------------------------------------------------------------
	// popupmgr.reset()      ポップアップメニューの設定をクリアする
	// popupmgr.setEvents()  ポップアップメニュー(タイトルバー)のイベントを設定する
	//---------------------------------------------------------------------------
	reset : function(){
		/* イベントを割り当てる */
		this.setEvents();
		
		/* Captionを設定する */
		this.translate();
	},
	
	setEvents : function(){
		ui.event.addEvent(_doc, "mousemove", this, this.titlebarmove);
		ui.event.addEvent(_doc, "mouseup",   this, this.titlebarup);
	},

	//---------------------------------------------------------------------------
	// popupmgr.translate()  言語切り替え時にキャプションを変更する
	//---------------------------------------------------------------------------
	translate : function(){
		for(var name in this.popups){ this.popups[name].translate();}
	},

	//---------------------------------------------------------------------------
	// popupmgr.addpopup()   ポップアップメニューを追加する
	//---------------------------------------------------------------------------
	addpopup : function(idname, proto){
		var NewPopup = {}, template = this.popups.template || {};
		for(var name in template){ NewPopup[name] = template[name];}
		for(var name in proto)   { NewPopup[name] = proto[name];}
		this.popups[idname] = NewPopup;
	},

	//---------------------------------------------------------------------------
	// popupmgr.open()  ポップアップメニューを開く
	//---------------------------------------------------------------------------
	open : function(idname, px, py){
		var target = this.popups[idname] || null;
		if(target!==null){
			/* 表示しているウィンドウがある場合は閉じる */
			if(!target.multipopup && !!this.popup){ this.popup.close();}
			
			/* ポップアップメニューを表示する */
			target.show(px, py);
			return true;
		}
		return false;
	},

	//---------------------------------------------------------------------------
	// popupmgr.titlebardown()  タイトルバーをクリックしたときの動作を行う(タイトルバーにbind)
	// popupmgr.titlebarup()    タイトルバーでボタンを離したときの動作を行う(documentにbind)
	// popupmgr.titlebarmove()  タイトルバーからマウスを動かしたときポップアップメニューを動かす(documentにbind)
	//---------------------------------------------------------------------------
	titlebardown : function(e){
		var popel = e.target.parentNode;
		var pos = pzpr.util.getPagePos(e);
		this.movingpop = popel;
		this.offset.px = pos.px - parseInt(popel.style.left);
		this.offset.py = pos.py - parseInt(popel.style.top);
		ui.event.enableMouse = false;
	},
	titlebarup : function(e){
		var popel = this.movingpop;
		if(!!popel){
			this.movingpop = null;
			ui.event.enableMouse = true;
		}
	},
	titlebarmove : function(e){
		var popel = this.movingpop;
		if(!!popel){
			var pos = pzpr.util.getPagePos(e);
			popel.style.left = pos.px - this.offset.px + 'px';
			popel.style.top  = pos.py - this.offset.py + 'px';
			e.preventDefault();
		}
	}
};

//---------------------------------------------------------------------------
// ★PopupMenuクラス ポップアップメニューを作成表示するベースのオブジェクトです
//---------------------------------------------------------------------------
ui.popupmgr.addpopup('template',
{
	formname : '',
	multipopup : false,

	reset : function(){
		this.pop       = null;
		this.titlebar  = null;
		this.form      = null;
		this.captions  = [];
	},

	translate : function(){
		if(!this.captions){ return;}
		for(var i=0;i<this.captions.length;i++){
			var obj  = this.captions[i];
			var text = ui.selectStr(obj.str_jp, obj.str_en);
			if   (!!obj.textnode){ obj.textnode.data = text;}
			else if(!!obj.button){ obj.button.value  = text;}
		}
	},

	searchForm : function(){
		this.form = document[this.formname];
		this.pop = this.form.parentNode;
		this.walkElement(this.pop);
		this.translate();
		
		pzpr.util.unselectable(this.titlebar);
	},
	walkElement : function(parent){
		var popup = this;
		ui.misc.walker(parent, function(el){
			if(el.nodeType===1 && el.className==='titlebar'){ popup.titlebar=el;}
			else if(el.nodeType===3 && el.data.match(/^__(.+)__(.+)__$/)){
				popup.captions.push({textnode:el, str_jp:RegExp.$1, str_en:RegExp.$2});
			}
		});
	},

	setEvent : function(){
		this.walkEvent(this.pop);
		this.setFormEvent();
		
		pzpr.util.addEvent(this.form, "submit", this, function(e){ e.preventDefault();});
		if(!!this.titlebar){
			var mgr = ui.popupmgr;
			pzpr.util.addEvent(this.titlebar, "mousedown", mgr, mgr.titlebardown);
		}
	},
	walkEvent : function(parent){
		var popup = this;
		ui.misc.walker(parent, function(el){
			if(el.nodeType!==1){ return;}
			var role = el.dataset.buttonExec;
			if(!!role){
				pzpr.util.addEvent(el, "click", popup, popup[role]);
			}
			role = el.dataset.changeExec;
			if(!!role){
				pzpr.util.addEvent(el, "change", popup, popup[role]);
			}
		});
	},
	setFormEvent : function(){
	},

	show : function(px,py){
		if(!this.pop){
			this.reset();
			this.searchForm();
			this.setEvent();
		}
		this.pop.style.left = px + 'px';
		this.pop.style.top  = py + 'px';
		this.pop.style.display = 'inline';
		if(!this.multipopup){
			ui.popupmgr.popup = this;
		}
	},
	close : function(){
		this.pop.style.display = "none";
		if(!this.multipopup){
			ui.popupmgr.popup = null;
		}
		
		ui.puzzle.key.enableKey = true;
		ui.puzzle.mouse.enableMouse = true;
	}
});

//---------------------------------------------------------------------------
// ★Popup_URLOutputクラス URL出力のポップアップメニューを作成したり表示します
//---------------------------------------------------------------------------
ui.popupmgr.addpopup('urloutput',
{
	formname : 'urloutput',
	
	setFormEvent : function(){
		var form = this.form, pid = ui.puzzle.pid, exists = pzpr.variety.info[pid].exists;
		
		form.kanpen.style.display  = form.kanpen.nextSibling.style.display  = (exists.kanpen ? "" : "none");
		form.heyaapp.style.display = form.heyaapp.nextSibling.style.display = ((pid==="heyawake") ? "" : "none");
	},
	
	//------------------------------------------------------------------------------
	// urloutput() URLを出力する
	// openurl()   「このURLを開く」を実行する
	//------------------------------------------------------------------------------
	urloutput : function(e){
		var url = '', parser = pzpr.parser;
		switch(e.target.name){
			case "pzprv3":     url = ui.puzzle.getURL(parser.URL_PZPRV3);  break;
			case "kanpen":     url = ui.puzzle.getURL(parser.URL_KANPEN);  break;
			case "heyaapp":    url = ui.puzzle.getURL(parser.URL_HEYAAPP); break;
		}
		this.form.ta.value = url;
	},
	openurl : function(e){
		if(this.form.ta.value!==''){
			require('shell').openExternal(this.form.ta.value);
		}
	}
});

//---------------------------------------------------------------------------
// ★Popup_ImageSaveクラス 画像出力のポップアップメニューを作成したり表示します
//---------------------------------------------------------------------------
ui.popupmgr.addpopup('imagesave',
{
	formname : 'imagesave',
	anchor : null,
	showsize : null,
	setFormEvent : function(){
		this.anchor = ((!ui.enableSaveBlob && pzpr.env.API.anchor_download) ? getEL("saveanchor") : null);
		this.showsize = getEL("showsize");
		
		/* ファイル形式選択オプション */
		this.form.filename.value = ui.puzzle.pid+".png";
		this.form.cellsize.value = ui.menuconfig.get('cellsizeval');
		
		this.changefilename();
		this.estimatesize();
	},
	
	/* オーバーライド */
	show : function(px,py){
		ui.popupmgr.popups.template.show.call(this,px,py);
		
		ui.puzzle.key.enableKey = false;
		ui.puzzle.mouse.enableMouse = false;
	},
	close : function(){
		if(!!this.saveimageurl){ URL.revokeObjectURL(this.saveimageurl);}
		
		ui.puzzle.setCanvasSize();
		ui.popupmgr.popups.template.close.call(this);
	},
	
	changefilename : function(){
		var filename = this.form.filename.value.replace('.png','.').replace('.svg','.');
		this.form.filename.value = filename + (this.form.filetype.value!=='svg'?'png':'svg');
	},
	estimatesize : function(){
		var cellsize = +this.form.cellsize.value;
		var width  = (+cellsize * ui.puzzle.painter.getCanvasCols())|0;
		var height = (+cellsize * ui.puzzle.painter.getCanvasRows())|0;
		this.showsize.replaceChild(_doc.createTextNode(width+" x "+height), this.showsize.firstChild);
	},
	
	//------------------------------------------------------------------------------
	// saveimage()    画像をダウンロードする
	// submitimage() "画像をダウンロード"の処理ルーチン
	// saveimage()   "画像をダウンロード"の処理ルーチン (IE10用)
 	//------------------------------------------------------------------------------
	saveimageurl : null,
	saveimage : function(){
		/* ファイル名チェックルーチン */
		var form = this.form;
		var filename = form.filename.value;
		var prohibit = ['\\', '/', ':', '*', '?', '"', '<', '>', '|'];
		for(var i=0;i<prohibit.length;i++){
			if(filename.indexOf(prohibit[i])!==-1){ ui.misc.alert('ファイル名として使用できない文字が含まれています。'); return;}
		}

		/* 画像出力ルーチン */
		var blob = ui.puzzle.toBlob((form.filetype.value!=='svg'?'png':'svg'), +form.cellsize.value);

		/* 出力された画像の保存ルーチン */
		if(ui.enableSaveBlob){
			navigator.saveBlob(blob, filename);
			this.close();
		}
		else{ // anchor
			if(!!this.filesaveurl){ URL.revokeObjectURL(this.filesaveurl);}
			this.filesaveurl = URL.createObjectURL(blob);
			this.anchor.href = this.filesaveurl;
			this.anchor.download = filename;
			this.anchor.click();
		}
	},
	
 	//------------------------------------------------------------------------------
	// openimage()   "別ウィンドウで開く"の処理ルーチン
	//------------------------------------------------------------------------------
	openimage : function(){
		/* 画像出力ルーチン */
		var cellsize = +this.form.cellsize.value;
		var type = (this.form.filetype.value!=='svg'?'png':'svg');
		
		var dataurl = "";
		try{
			dataurl = ui.puzzle.toDataURL(type,cellsize);
		}
		catch(e){
			ui.misc.alert('画像の出力に失敗しました','Fail to Output the Image');
		}
		
		/* 出力された画像を開くルーチン */
		if(!!dataurl){ ui.misc.openlocal(dataurl);}
	}
});

//---------------------------------------------------------------------------
// ★Popup_Adjustクラス 盤面の調整のポップアップメニューを作成したり表示します
//---------------------------------------------------------------------------
ui.popupmgr.addpopup('adjust',
{
	formname : 'adjust',
	
	adjust : function(e){
		ui.puzzle.board.exec.execadjust(e.target.name);
	}
});

//---------------------------------------------------------------------------
// ★Popup_TurnFlipクラス 回転・反転のポップアップメニューを作成したり表示します
//---------------------------------------------------------------------------
ui.popupmgr.addpopup('turnflip',
{
	formname : 'turnflip',
	
	setFormEvent : function(){
		this.form.turnl.disabled = (ui.puzzle.pid==='tawa');
		this.form.turnr.disabled = (ui.puzzle.pid==='tawa');
	},
	
	adjust : function(e){
		ui.puzzle.board.exec.execadjust(e.target.name);
	}
});

//---------------------------------------------------------------------------
// ★Popup_Colorsクラス 色の選択を行うメニューを作成したり表示します
//---------------------------------------------------------------------------
ui.popupmgr.addpopup('colors',
{
	formname : 'colors',
	
	setFormEvent : function(){
		this.refresh();
	},

	//------------------------------------------------------------------------------
	// refresh()    フォームに表示される色を再設定する
	//------------------------------------------------------------------------------
	refresh : function(name){
		ui.misc.walker(this.form, function(el){
			if(el.nodeName==="INPUT" && el.getAttribute("type")==="color"){
				var target = el.dataset.colorTarget;
				if(!!target && (!name || name===target)){
					el.value = Candle.parse(ui.puzzle.painter[target]);
				}
			}
		});
	},
	
	//------------------------------------------------------------------------------
	// setcolor()   色を設定する
	// clearcolor() 色の設定をクリアする
	//------------------------------------------------------------------------------
	setcolor : function(e){
		var name = e.target.dataset.colorTarget;
		ui.puzzle.setConfig("color_"+name, e.target.value);
	},
	clearcolor : function(e){
		var name = e.target.dataset.colorTarget;
		ui.puzzle.setConfig("color_"+name, "");
		this.refresh(name);
	}
});

//---------------------------------------------------------------------------
// ★Popup_DispSizeクラス サイズの変更を行うポップアップメニューを作成したり表示します
//---------------------------------------------------------------------------
ui.popupmgr.addpopup('dispsize',
{
	formname : 'dispsize',
	
	show : function(px,py){
		ui.popupmgr.popups.template.show.call(this,px,py);
		
		this.form.cellsize.value = ui.menuconfig.get('cellsizeval');
		ui.puzzle.key.enableKey = false;
	},
	
	//------------------------------------------------------------------------------
	// changesize()  Canvasでのマス目の表示サイズを変更する
	//------------------------------------------------------------------------------
	changesize : function(e){
		var csize = parseInt(this.form.cellsize.value);
		if(csize>0){ ui.menuconfig.set('cellsizeval', (csize|0));}
		this.close();
	}
});

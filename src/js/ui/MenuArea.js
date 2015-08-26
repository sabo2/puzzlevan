// MenuArea.js v3.4.0
/* global ui:false, getEL:false */

// メニュー描画/取得/html表示系
ui.menuarea = {
	captions : [],				// 言語指定を切り替えた際のキャプションを保持する
	menuitem : null,			// メニューの設定切り替え用エレメント等を保持する
	nohover : false,			// :hover擬似クラスを使用しないでhover表示する
	
	//---------------------------------------------------------------------------
	// menuarea.reset()  メニュー、サブメニュー、フロートメニューの初期設定を行う
	//---------------------------------------------------------------------------
	reset : function(){
		this.createMenu();
		
		this.display();
	},

	//---------------------------------------------------------------------------
	// menuarea.createMenu()  メニューの初期設定を行う
	//---------------------------------------------------------------------------
	createMenu : function(){
		if(this.menuitem===null){
			// this.modifySelector();
			
			this.menuitem = {};
			this.walkElement(getEL("menupanel"));
		}
		this.walkElement2(getEL("menupanel"));
		this.stopHovering();
	},

	//---------------------------------------------------------------------------
	// menuarea.walkElement()  エレメントを探索して領域の初期設定を行う
	//---------------------------------------------------------------------------
	walkElement : function(parent){
		var menuarea = this;
		function addmdevent(el,func){ pzpr.util.addEvent(el, "mousedown", menuarea, func);}
		function mdfactory(role){
			return function(e){ menuarea[role](e); if(menuarea.nohover){ e.stopPropagation();}};
		}
		ui.misc.walker(parent, function(el){
			if(el.nodeType===1 && el.nodeName==="LI"){
				var setevent = false;
				var idname = ui.customAttr(el,"config");
				if(!!idname){
					menuarea.menuitem[idname] = {el:el};
					if(el.className==="check"){
						addmdevent(el, menuarea.checkclick);
						setevent = true;
					}
				}
				var value = ui.customAttr(el,"value");
				if(!!value){
					var parent = el.parentNode.parentNode, idname = ui.customAttr(parent,"config");
					var item = menuarea.menuitem[idname];
					if(!item.children){ item.children=[];}
					item.children.push(el);
					
					addmdevent(el, menuarea.childclick);
					setevent = true;
				}
				
				var role = ui.customAttr(el,"menuExec");
				if(!!role){
					addmdevent(el, mdfactory(role));
					setevent = true;
				}
				role = ui.customAttr(el,"pressExec");
				if(!!role){
					var roles = role.split(/,/);
					addmdevent(el, mdfactory(roles[0]));
					if(!!role[1]){
						pzpr.util.addEvent(el, "mouseup", menuarea, menuarea[roles[1]]);
					}
					setevent = true;
				}
				role = ui.customAttr(el,"popup");
				if(!!role){
					addmdevent(el, mdfactory("disppopup"));
					setevent = true;
				}
				
				if(!setevent){
					if(!menuarea.nohover || !el.querySelector("menu")){
						addmdevent(el, function(e){ e.preventDefault();});
					}
					else{
						addmdevent(el, function(e){ menuarea.showHovering(e,el);});
					}
				}
			}
			else if(el.nodeType===1 && el.nodeName==="MENU"){
				var label = el.getAttribute("label");
				if(!!label && label.match(/^__(.+)__(.+)__$/)){
					menuarea.captions.push({menu:el, str_jp:RegExp.$1, str_en:RegExp.$2});
					if(menuarea.nohover){
						addmdevent(el, function(e){ e.stopPropagation();});
					}
				}
			}
			else if(el.nodeType===3){
				if(el.data.match(/^__(.+)__(.+)__$/)){
					menuarea.captions.push({textnode:el, str_jp:RegExp.$1, str_en:RegExp.$2});
				}
			}
		});
	},
	walkElement2 : function(parent){
		ui.misc.walker(parent, function(el){
			if(el.nodeType===1 && el.nodeName==="SPAN"){
				var disppid = ui.customAttr(el,"dispPid");
				if(!!disppid){ el.style.display = (pzpr.util.checkpid(disppid, ui.puzzle.pid) ? "" : "none");}
			}
		});
	},

	//--------------------------------------------------------------------------------
	// menuarea.modifySelector()  MenuAreaに関するCSSセレクタテキストを変更する (Android向け)
	//--------------------------------------------------------------------------------
//	modifySelector : function(){
//		/* Android 4.0以上向け処理です */
//		if(!pzpr.env.OS.Android || !getEL("menupanel").classList){ return;}
//		var sheet = _doc.styleSheets[0];
//		var rules = sheet.cssRules || sheet.rules;
//		if(rules===null){} // Chromeでローカルファイルを開くとおかしくなるので、とりあえず何もしないようにします
//		
//		for(var i=0,len=rules.length;i<len;i++){
//			var rule = rules[i];
//			if(!rule.selectorText){ continue;}
//			if(rule.selectorText.match(/\#menupanel.+\:hover.*/)){
//				sheet.insertRule(rule.cssText.replace(":hover",".hovering"), i);
//				sheet.deleteRule(i+1);
//			}
//		}
//		this.nohover = true;
//	},
	
	//--------------------------------------------------------------------------------
	// menuarea.showHovering()  MenuAreaのポップアップを表示する (Android向け)
	// menuarea.stopHovering()  MenuAreaのポップアップを消去する (Android向け)
	//--------------------------------------------------------------------------------
	showHovering : function(e,el0){
		if(!this.nohover){ return;}
		el0.classList.toggle("hovering");
		ui.misc.walker(getEL("menupanel"), function(el){
			if(el.nodeType===1 && !!el.classList && !el.contains(el0)){ el.classList.remove("hovering");}
		});
		e.preventDefault();
		e.stopPropagation();
	},
	stopHovering : function(){
		if(!this.nohover){ return;}
		ui.misc.walker(getEL("menupanel"), function(el){
			if(el.nodeType===1 && !!el.classList){ el.classList.remove("hovering");}
		});
	},
	
	//---------------------------------------------------------------------------
	// menuarea.display()    全てのメニューに対して文字列を設定する
	// menuarea.setdisplay() サブメニューに表示する文字列を個別に設定する
	//---------------------------------------------------------------------------
	display : function(){
		getEL('menupanel').style.display = "";
		
		getEL("menu_imagesave").className = ((ui.enableSaveImage || ui.enableSaveSVG) ? "" : "disabled");
		
		for(var idname in this.menuitem){ this.setdisplay(idname);}
		this.setdisplay("operation");
		this.setdisplay("toolarea");
		
		/* キャプションの設定 */
		for(var i=0;i<this.captions.length;i++){
			var obj = this.captions[i];
			if(!!obj.textnode) { obj.textnode.data = ui.selectStr(obj.str_jp, obj.str_en);}
			else if(!!obj.menu){ obj.menu.setAttribute("label", ui.selectStr(obj.str_jp, obj.str_en));}
		}
	},
	setdisplay : function(idname){
		if(idname==="operation"){
			var opemgr = ui.puzzle.opemgr;
			getEL('menu_oldest').className = (opemgr.enableUndo ? "" : "disabled");
			getEL('menu_undo').className   = (opemgr.enableUndo ? "" : "disabled");
			getEL('menu_redo').className   = (opemgr.enableRedo ? "" : "disabled");
			getEL('menu_latest').className = (opemgr.enableRedo ? "" : "disabled");
		}
		else if(idname==="toolarea"){
			var str;
			if(ui.getConfig("toolarea")===0){ str = ui.selectStr("ツールエリアを表示","Show tool area");}
			else                            { str = ui.selectStr("ツールエリアを隠す","Hide tool area");}
			getEL('menu_toolarea').childNodes[0].data = str;
		}
		else if(this.menuitem===null || !this.menuitem[idname]){
			/* DO NOTHING */
		}
		else if(ui.validConfig(idname)){
			var menuitem = this.menuitem[idname];
			menuitem.el.style.display = "";
			
			/* セレクタ部の設定を行う */
			if(!!menuitem.children){
				var children = menuitem.children;
				for(var i=0;i<children.length;i++){
					var child = children[i], selected = (ui.customAttr(child,"value")===""+ui.getConfig(idname));
					child.className = (selected ? "checked" : "");
				}
			}
			/* Check部の表記の変更 */
			else if(!!menuitem.el){
				menuitem.el.className = (ui.getConfig(idname) ? "checked" : "check");
			}
		}
		else if(!!this.menuitem[idname]){
			this.menuitem[idname].el.style.display = "none";
		}
	},

	//---------------------------------------------------------------------------
	// menuarea.checkclick()   メニューから設定値の入力があった時、設定を変更する
	// menuarea.childclick()   メニューから設定値の入力があった時、設定を変更する
	//---------------------------------------------------------------------------
	checkclick : function(e){
		var el = e.target;
		if(el.nodeName==="SPAN"){ el = el.parentNode;}
		
		var idname = ui.customAttr(el,"config");
		ui.setConfig(idname, !ui.getConfig(idname));
	},
	childclick : function(e){
		var el = e.target;
		if(el.nodeName==="SPAN"){ el = el.parentNode;}
		
		var parent = el.parentNode.parentNode;
		ui.setConfig(ui.customAttr(parent,"config"), ui.customAttr(el,"value"));
	},

	//---------------------------------------------------------------------------
	// メニューがクリックされた時の動作を呼び出す
	//---------------------------------------------------------------------------
	// submenuから呼び出される関数たち
	undo     : function(){ ui.undotimer.startButtonUndo();},
	undostop : function(){ ui.undotimer.stopButtonUndo();},
	undoall  : function(){ ui.puzzle.undoall();},
	redo     : function(){ ui.undotimer.startButtonRedo();},
	redostop : function(){ ui.undotimer.stopButtonRedo();},
	redoall  : function(){ ui.puzzle.redoall();},
	toolarea : function(){
		ui.setConfig("toolarea", (ui.getConfig("toolarea")===0?1:0));
		ui.displayAll();
		ui.puzzle.adjustCanvasPos();
	},
	repaint : function(){ ui.puzzle.redraw();},
	jumpexp : function(){
		ui.saveConfig();	/* faq.htmlで言語設定を使用するので、一旦Config値を保存 */
		ui.misc.openlocal('faq.html?'+ui.puzzle.pid+(pzpr.EDITOR?"_edit":""));
	},
	disppopup : function(e){
		var el = e.target;
		if(el.nodeName==="SPAN"){ el = el.parentNode;}
		if(el.className!=="disabled"){
			var idname = ui.customAttr(el,"popup");
			var pos = pzpr.util.getPagePos(e);
			ui.popupmgr.open(idname, pos.px-8, pos.py-8);
			this.stopHovering();
		}
	}
};

require('ipc').on('menu-req', function(req){
	var toolarea = ui.toolarea;
	var parser = pzpr.parser;
	var puzzle = ui.puzzle, pid = puzzle.pid;
	switch(req){
		case 'check':    toolarea.answercheck(); break;
		case 'ansclear': toolarea.ACconfirm(); break;
		case 'auxclear': toolarea.ASconfirm(); break;
		case 'duplicate': 
			ui.misc.openpuzzle(puzzle.getFileData(pzpr.parser.FILE_PZPH));
			break;
		case 'save-pzpr':
			require('ipc').send('write-file', puzzle.getFileData(parser.FILE_PZPR), pid);
			break;
		case 'save-pbox':
			require('ipc').send('write-file', puzzle.getFileData(parser.FILE_PBOX), pid);
			break;
	}
});

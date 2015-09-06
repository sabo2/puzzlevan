// MenuArea.js v3.4.0
/* global ui:false, getEL:false */

// メニュー描画/取得/html表示系
ui.menuarea = {
	captions : [],				// 言語指定を切り替えた際のキャプションを保持する
	menuitem : null,			// メニューの設定切り替え用エレメント等を保持する
	
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
			this.menuitem = {};
			this.walkElement(getEL("menupanel"));
		}
		this.walkElement2(getEL("menupanel"));
	},

	//---------------------------------------------------------------------------
	// menuarea.walkElement()  エレメントを探索して領域の初期設定を行う
	//---------------------------------------------------------------------------
	walkElement : function(parent){
		var menuarea = this;
		function addmdevent(el,func){ pzpr.util.addEvent(el, "mousedown", menuarea, func);}
		ui.misc.walker(parent, function(el){
			if(el.nodeType===1 && el.nodeName==="LI"){
				var setevent = false;
				var idname = el.dataset.config;
				if(!!idname){
					menuarea.menuitem[idname] = {el:el};
					if(el.className==="check"){
						addmdevent(el, menuarea.checkclick);
						setevent = true;
					}
				}
				var value = el.dataset.value;
				if(!!value){
					var parent = el.parentNode.parentNode, idname = parent.dataset.config;
					var item = menuarea.menuitem[idname];
					if(!item.children){ item.children=[];}
					item.children.push(el);
					
					addmdevent(el, menuarea.childclick);
					setevent = true;
				}
				
				var role = el.dataset.popup;
				if(!!role){
					addmdevent(el, menuarea.disppopup);
					setevent = true;
				}
				
				if(!setevent){
					if(!el.querySelector("menu")){
						addmdevent(el, function(e){ e.preventDefault();});
					}
				}
			}
			else if(el.nodeType===1 && el.nodeName==="MENU"){
				var label = el.getAttribute("label");
				if(!!label && label.match(/^__(.+)__(.+)__$/)){
					menuarea.captions.push({menu:el, str_jp:RegExp.$1, str_en:RegExp.$2});
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
				var disppid = el.dataset.dispPid;
				if(!!disppid){ el.style.display = (pzpr.util.checkpid(disppid, ui.puzzle.pid) ? "" : "none");}
			}
		});
	},
	
	//---------------------------------------------------------------------------
	// menuarea.display()    全てのメニューに対して文字列を設定する
	// menuarea.setdisplay() サブメニューに表示する文字列を個別に設定する
	//---------------------------------------------------------------------------
	display : function(){
		getEL('menupanel').style.display = "";
		
		for(var idname in this.menuitem){ this.setdisplay(idname);}
		this.setdisplay("toolarea");
		
		/* キャプションの設定 */
		for(var i=0;i<this.captions.length;i++){
			var obj = this.captions[i];
			if(!!obj.textnode) { obj.textnode.data = ui.selectStr(obj.str_jp, obj.str_en);}
			else if(!!obj.menu){ obj.menu.setAttribute("label", ui.selectStr(obj.str_jp, obj.str_en));}
		}
	},
	setdisplay : function(idname){
		if(this.menuitem===null || !this.menuitem[idname]){
			/* DO NOTHING */
		}
		else if(ui.validConfig(idname)){
			var menuitem = this.menuitem[idname];
			menuitem.el.style.display = "";
			
			/* セレクタ部の設定を行う */
			if(!!menuitem.children){
				var children = menuitem.children;
				for(var i=0;i<children.length;i++){
					var child = children[i], selected = (child.dataset.value===""+ui.getConfig(idname));
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
		
		var idname = el.dataset.config;
		ui.setConfig(idname, !ui.getConfig(idname));
	},
	childclick : function(e){
		var el = e.target;
		if(el.nodeName==="SPAN"){ el = el.parentNode;}
		
		var parent = el.parentNode.parentNode;
		ui.setConfig(parent.dataset.config, el.dataset.value);
	},

	//---------------------------------------------------------------------------
	// メニューがクリックされた時の動作を呼び出す
	//---------------------------------------------------------------------------
	// submenuから呼び出される関数たち
	disppopup : function(e){
		var el = e.target;
		if(el.nodeName==="SPAN"){ el = el.parentNode;}
		if(el.className!=="disabled"){
			var idname = el.dataset.popup;
			var pos = pzpr.util.getPagePos(e);
			ui.popupmgr.open(idname, pos.px-8, pos.py-8);
		}
	},

	filesaveurl : '',
	saveiamge : function(filetype){
		/* 画像出力ルーチン */
		ui.remote.require('dialog').showSaveDialog(ui.win, {
			title : "Save Image - Puzzlevan",
			defaultPath : ui.puzzle.pid+'.'+filetype,
			filters : [ {name:(filetype==='png'?'PNG':'SVG')+' Images', extensions:[filetype]} ]
		}, function(filename){
			if(!filename){ return;}
			var base64data = ui.puzzle.toDataURL(filetype).replace(/data\:.+\;base64\,/,'');
			require('fs').writeFile(filename, base64data, {encoding:'base64'});
		});
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
		case 'export-url':
			require('ipc').send('export-url', {
				pzprv3:  ui.puzzle.getURL(parser.URL_PZPRV3),
				kanpen:  ui.puzzle.getURL(parser.URL_KANPEN),
				heyaapp: ui.puzzle.getURL(parser.URL_HEYAAPP)
			}, pid);
			break;
		case 'saveimage-png':
			ui.menuarea.saveiamge('png');
			break;
		case 'saveimage-svg':
			ui.menuarea.saveiamge('svg');
			break;
		default:
			if(req.match(/adjust\-(.+)/)){ ui.puzzle.board.exec.execadjust(RegExp.$1);}
			break;
	}
});

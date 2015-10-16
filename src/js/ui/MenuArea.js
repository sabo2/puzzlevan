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
			this.walkElement();
		}
		this.walkElement2();
	},

	//---------------------------------------------------------------------------
	// menuarea.walkElement()  エレメントを探索して領域の初期設定を行う
	//---------------------------------------------------------------------------
	walkElement : function(){
		var els = getEL("menupanel").querySelectorAll('li[data-config]');
		for(var i=0;i<els.length;i++){
			var idname = els[i].dataset.config;
			this.menuitem[idname] = {el:els[i]};
			if(els[i].className==="check"){
				pzpr.util.addEvent(els[i], "mousedown", this, this.checkclick);
			}
			else{
				pzpr.util.addEvent(els[i], "mousedown", this, function(e){ e.preventDefault();});
			}
		}
		
		els = getEL("menupanel").querySelectorAll('li[data-value]');
		for(var i=0;i<els.length;i++){
			var parent = els[i].parentNode.parentNode, idname = parent.dataset.config;
			var item = this.menuitem[idname];
			if(!item.children){ item.children=[];}
			item.children.push(els[i]);
			
			pzpr.util.addEvent(els[i], "mousedown", this, this.childclick);
		}
		
		els = getEL("menupanel").querySelectorAll('menu[label]');
		for(var i=0;i<els.length;i++){
			var label = els[i].getAttribute("label");
			if(label.match(/^__(.+)__(.+)__$/)){
				this.captions.push({menu:els[i], str_jp:RegExp.$1, str_en:RegExp.$2});
			}
		}
		
		els = getEL("menupanel").querySelectorAll('span');
		for(var i=0;i<els.length;i++){
			var el = els[i].firstChild;
			if(el.nodeType===3 && el.data.match(/^__(.+)__(.+)__$/)){
				this.captions.push({textnode:el, str_jp:RegExp.$1, str_en:RegExp.$2});
			}
		}
	},
	walkElement2 : function(){
		var els = getEL("menupanel").querySelectorAll('span[data-disp-pid]');
		for(var i=0;i<els.length;i++){
			var disppid = els[i].dataset.dispPid;
			els[i].style.display = (pzpr.util.checkpid(disppid, ui.puzzle.pid) ? "" : "none");
		}
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
	saveimage : function(filetype){
		/* 画像出力ルーチン */
		ui.remote.require('dialog').showSaveDialog(ui.win, {
			title : "Save Image - Puzzlevan",
			defaultPath : pzpr.variety.toURLID(ui.puzzle.pid)+'.'+filetype,
			filters : [ {name:(filetype==='png'?'PNG':'SVG')+' Images', extensions:[filetype]} ]
		}, function(filename){
			if(!filename){ return;}
			var base64data = ui.puzzle.toDataURL(filetype).replace(/data\:.+\;base64\,/,'');
			require('fs').writeFile(filename, base64data, {encoding:'base64'});
		});
	},
	openpopup : function(url){
		var bounds = ui.win.getBounds();
		var feature = 'x='+(bounds.x+24)+',y='+(bounds.y+24)+',show=no';
		window.open('popups/'+url, null, feature);
	},

	//---------------------------------------------------------------------------
	// menuarea.recvConfigReq() main processから送信されたConfig設定に関するipc通信の処理を行う
	//---------------------------------------------------------------------------
	recvConfigReq : function(req){
		if(req.match(/(.+)\:(.+)/)){
			ui.setConfig(RegExp.$1, RegExp.$2);
		}
	},

	//---------------------------------------------------------------------------
	// menuarea.recvMenuReq()  main processから送信されたメニューに関するipc通信の処理を行う
	// menuarea.recvMessage()  popup windowから送信されたpostMessageの処理を行う
	//---------------------------------------------------------------------------
	recvMenuReq : function(req){
		var toolarea = ui.toolarea;
		var parser = pzpr.parser;
		var puzzle = ui.puzzle, pid = pzpr.variety.toURLID(puzzle.pid);
		switch(req){
			case 'undo': puzzle.undo(); break;
			case 'redo': puzzle.redo(); break;
			case 'check':    toolarea.answercheck(); break;
			case 'ansclear': toolarea.ACconfirm(); break;
			case 'auxclear': toolarea.ASconfirm(); break;
			case 'duplicate': ui.misc.openpuzzle(puzzle.getFileData(parser.FILE_PZPR,{history:true})); break;
			case 'edit-mode': if(puzzle.playmode){ puzzle.setConfig("mode", puzzle.MODE_EDITOR);} break;
			case 'play-mode': if(puzzle.editmode){ puzzle.setConfig("mode", puzzle.MODE_PLAYER);} break;
			
			case 'save-pzpr':     require('ipc').send('save-file', puzzle.getFileData(parser.FILE_PZPR), pid); break;
			case 'save-pbox':     require('ipc').send('save-file', puzzle.getFileData(parser.FILE_PBOX), pid); break;
			case 'save-pbox-xml': require('ipc').send('save-file', puzzle.getFileData(parser.FILE_PBOX_XML), pid, 'xml'); break;
			case 'saveimage-png': this.saveimage('png'); break;
			case 'saveimage-svg': this.saveimage('svg'); break;
			
			case 'popup-urloutput': this.openpopup('urloutput.html?'+pid); break;
			case 'popup-adjust':    this.openpopup('adjust.html?'+pid); break;
			case 'popup-metadata':  this.openpopup('metadata.html?'+pid+'/'+puzzle.board.qcols+'/'+puzzle.board.qrows); break;
			case 'popup-dispsize':  this.openpopup('dispsize.html'); break;
			case 'popup-colors':    this.openpopup('colors.html'); break;
			
			default: /* DO NOTHING */ break;
		}
	},
	recvMessage : function(sender, channel, data){
		var puzzle = ui.puzzle;
		switch(channel){
			case 'urloutput':
				var parser = pzpr.parser;
				switch(data){
					case 'pzprv3':  sender.postMessage(puzzle.getURL(parser.URL_PZPRV3), '*'); break;
					case 'kanpen':  sender.postMessage(puzzle.getURL(parser.URL_KANPEN), '*'); break;
					case 'heyaapp': sender.postMessage(puzzle.getURL(parser.URL_HEYAAPP),'*'); break;
				}
				break;
			case 'metadata-get': sender.postMessage(JSON.stringify(puzzle.metadata), '*'); break;
			case 'metadata-set': puzzle.metadata.copydata(data); break;
			case 'adjust':       puzzle.board.exec.execadjust(data); break;
			case 'color-get':    sender.postMessage(JSON.stringify({name:data.name,color:puzzle.painter[data.name]}), '*'); break;
			case 'color-set':    puzzle.setConfig('color_'+data.name, data.color); break;
			case 'color-clear':  puzzle.setConfig('color_'+data.name, ''); break;
			case 'size-get':     sender.postMessage(''+ui.menuconfig.get('cellsizeval'), '*'); break;
			case 'size-set':     ui.menuconfig.set('cellsizeval', data); break;
		}
	}
};

require('ipc').on('config-req', function(req){
	ui.menuarea.recvConfigReq(req);
});
require('ipc').on('menu-req', function(req){
	ui.menuarea.recvMenuReq(req);
});
window.addEventListener("message", function(e){
	var msg = JSON.parse(e.data);
	ui.menuarea.recvMessage(e.source, msg.channel, msg.data);
}, false);

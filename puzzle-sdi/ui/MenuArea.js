// MenuArea.js v3.4.0
/* global ui:false */

// メニュー描画/取得/html表示系
ui.menuarea = {
	//---------------------------------------------------------------------------
	// メニューがクリックされた時の動作を呼び出す
	//---------------------------------------------------------------------------
	saveimage : function(filetype){
		/* 画像出力ルーチン */
		ui.remote.dialog.showSaveDialog(ui.win, {
			title : "Save Image - Puzzlevan",
			defaultPath : pzpr.variety(ui.puzzle.pid).urlid+'.'+filetype,
			filters : [ {name:(filetype==='png'?'PNG':'SVG')+' Images', extensions:[filetype]} ]
		}, function(filename){
			if(!filename){ return;}
			var base64data = ui.puzzle.toDataURL(filetype).replace(/data\:.+\;base64\,/,'');
			require('electron').fs.writeFile(filename, base64data, {encoding:'base64'});
		});
	},
	openpopup : function(url){
		var bounds = ui.win.getBounds();
		window.open('../popups/'+url, null, [
			'x='+(bounds.x+24),
			'y='+(bounds.y+24),
			'resizable=no',
			'show='+(!require('electron').ipcRenderer.sendSync('get-app-preference').debugmode?'no':'yes')
		].join(','));
	},

	//---------------------------------------------------------------------------
	// menuarea.recvMenuReq()  main processから送信されたメニューに関するipc通信の処理を行う
	// menuarea.recvMessage()  popup windowから送信されたpostMessageの処理を行う
	//---------------------------------------------------------------------------
	recvMenuReq : function(req){
		var toolarea = ui.toolarea;
		var parser = pzpr.parser;
		var puzzle = ui.puzzle, pid = pzpr.variety(puzzle.pid).urlid;
		switch(req){
			case 'undo': puzzle.undo(); break;
			case 'redo': puzzle.redo(); break;
			case 'check':    toolarea.answercheck(); break;
			case 'ansclear': toolarea.ACconfirm(); break;
			case 'auxclear': toolarea.ASconfirm(); break;
			case 'duplicate': ui.misc.openpuzzle(puzzle.getFileData(parser.FILE_PZPR,{history:true})); break;
			case 'edit-mode': if(puzzle.playmode){ puzzle.setMode('edit');} break;
			case 'play-mode': if(puzzle.editmode){ puzzle.setMode('play');} break;
			case 'irowake-change': puzzle.irowake(); break;
			
			case 'save-pzpr':     require('electron').ipcRenderer.send('save-file', puzzle.getFileData(parser.FILE_PZPR), pid); break;
			case 'save-pbox':     require('electron').ipcRenderer.send('save-file', puzzle.getFileData(parser.FILE_PBOX), pid); break;
			case 'save-pbox-xml': require('electron').ipcRenderer.send('save-file', puzzle.getFileData(parser.FILE_PBOX_XML), pid, 'xml'); break;
			case 'saveimage-png': this.saveimage('png'); break;
			case 'saveimage-svg': this.saveimage('svg'); break;
			
			case 'popup-urloutput': this.openpopup('urloutput.html?'+pid); break;
			case 'popup-adjust':    this.openpopup('adjust.html?'+pid); break;
			case 'popup-metadata':  this.openpopup('metadata.html?'+pid+'/'+puzzle.board.qcols+'/'+puzzle.board.qrows); break;
			case 'popup-dispsize':  this.openpopup('dispsize.html'); break;
			case 'popup-colors':    this.openpopup('colors.html'); break;
			case 'popup-undotime':  this.openpopup('undotime.html'); break;
			
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
			case 'metadata-set': puzzle.metadata.update(data); break;
			case 'adjust':       puzzle.board.operate(data); break;
			case 'color-get':    sender.postMessage(JSON.stringify({name:data.name,color:puzzle.painter[data.name]}), '*'); break;
			case 'color-set':    ui.menuconfig.set('color_'+data.name, data.color); break;
			case 'color-clear':  ui.menuconfig.reset('color_'+data.name); break;
			case 'size-get':     sender.postMessage(''+ui.menuconfig.get('cellsizeval'), '*'); break;
			case 'size-set':     ui.menuconfig.set('cellsizeval', data); break;
			case 'interval-get': sender.postMessage(''+ui.menuconfig.get('undointerval'), '*'); break;
			case 'interval-set': ui.menuconfig.set('undointerval', data); break;
		}
	}
};

require('electron').ipcRenderer.on('config-req', function(e, idname, val){
	ui.menuconfig.set(idname, val);
	if(idname==='language'){
		ui.misc.setMenu(false);
	}
});
require('electron').ipcRenderer.on('menu-req', function(e, req){
	ui.menuarea.recvMenuReq(req);
});
window.addEventListener("message", function(e){
	var msg = JSON.parse(e.data);
	ui.menuarea.recvMessage(e.source, msg.channel, msg.data);
}, false);

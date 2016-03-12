// MenuArea.js v3.4.0
/* global ui:false */

// メニュー描画/取得/html表示系
ui.menuarea = {
	//---------------------------------------------------------------------------
	// メニューがクリックされた時の動作を呼び出す
	//---------------------------------------------------------------------------
	openpopup : function(url){
		var bounds = ui.win.getBounds();
		return window.open('../popups/'+url, null, [
			'x='+(bounds.x+24),
			'y='+(bounds.y+24),
			'resizable=no',
			'show='+(!ui.debugmode?'no':'yes')
		].join(','));
		
	},
	saveFile : function(puzzle, filetype){
		var filedata = puzzle.getFileData(filetype);
		var fileext = (filetype===pzpr.parser.FILE_PBOX_XML ? 'xml' : '');
		require('electron').ipcRenderer.send('save-file', filedata, puzzle.pid, fileext, filetype);
	},
	updateFile : function(puzzle){
		var info = ui.puzzles.getInfo(puzzle);
		var filename = info.filename;
		if(!!filename){
			var filedata = puzzle.getFileData(info.filetype);
			require('electron').ipcRenderer.send('update-file', filedata, filename);
		}
	},

	closePuzzle : function(){
		if(ui.isMDI && ui.puzzles.length===0){
			ui.win.close();
		}
		if(ui.puzzle && (!ui.puzzle.ismodified() || ui.misc.closePuzzleInquiry())){
			ui.puzzles.delete(ui.puzzle);
		}
		if(!ui.isMDI && ui.puzzles.length===0){
			ui.win.close();
		}
	},
	clonePuzzle : function(){
		if(ui.puzzle){
			var data = ui.puzzle.getFileData(pzpr.parser.FILE_PZPR,{history:true});
			require('electron').ipcRenderer.send('open-puzzle', data, ui.puzzle.pid);
		}
	},

	//---------------------------------------------------------------------------
	// menuarea.recvMenuReq()  main processから送信されたメニューに関するipc通信の処理を行う
	// menuarea.recvMessage()  popup windowから送信されたpostMessageの処理を行う
	//---------------------------------------------------------------------------
	recvMenuReq : function(req){
		if(req==='close-puzzle'){ ui.menuarea.closePuzzle();}
		if(!ui.puzzle){ return;}
		var toolarea = ui.toolarea;
		var parser = pzpr.parser;
		var puzzle = ui.puzzle, pid = pzpr.variety(puzzle.pid).urlid;
		switch(req){
			case 'undo': puzzle.undo(); break;
			case 'redo': puzzle.redo(); break;
			case 'check':    toolarea.answercheck(); break;
			case 'ansclear': toolarea.ACconfirm(); break;
			case 'auxclear': toolarea.ASconfirm(); break;
			case 'duplicate': ui.menuarea.clonePuzzle(); break;
			case 'edit-mode': if(puzzle.playmode){ puzzle.setMode('edit'); ui.misc.setTitle();} break;
			case 'play-mode': if(puzzle.editmode){ puzzle.setMode('play'); ui.misc.setTitle();} break;
			case 'irowake-change': puzzle.irowake(); break;
			
			case 'save-pzpr':     require('electron').ipcRenderer.send('save-file', puzzle.getFileData(parser.FILE_PZPR), pid, '', parser.FILE_PZPR); break;
			case 'save-pbox':     require('electron').ipcRenderer.send('save-file', puzzle.getFileData(parser.FILE_PBOX), pid, '' ,parser.FILE_PBOX); break;
			case 'save-pbox-xml': require('electron').ipcRenderer.send('save-file', puzzle.getFileData(parser.FILE_PBOX_XML), pid, 'xml', parser.FILE_PBOX_XML); break;
			case 'save-update':   ui.menuarea.updateFile(puzzle); break;
			
			case 'popup-urloutput': this.openpopup('urloutput.html?'+pid); break;
			case 'popup-adjust':    this.openpopup('adjust.html?'+pid); break;
			case 'popup-metadata':  this.openpopup('metadata.html?'+pid+'/'+puzzle.board.cols+'/'+puzzle.board.rows); break;
			case 'popup-dispsize':  this.openpopup('dispsize.html'); break;
			case 'popup-colors':    this.openpopup('colors.html'); break;
			case 'popup-undotime':  this.openpopup('undotime.html'); break;
			case 'popup-imagesave':
				var win = this.openpopup('imagesave.html?'+ui.menuconfig.get('cellsizeval'));
				win.postMessage();
				break;
			
			default: /* DO NOTHING */ break;
		}
	},
	recvMessage : function(sender, channel, data){
		if(!ui.puzzle){ return;}
		var puzzle = ui.puzzle;
		var parser = pzpr.parser;
		switch(channel){
			case 'urloutput':
				switch(data){
					case 'pzprv3':  sender.postMessage(puzzle.getURL(parser.URL_PZPRV3), '*'); break;
					case 'kanpen':  sender.postMessage(puzzle.getURL(parser.URL_KANPEN), '*'); break;
					case 'heyaapp': sender.postMessage(puzzle.getURL(parser.URL_HEYAAPP),'*'); break;
				}
				break;
			case 'filedata-get': sender.postMessage(puzzle.getFileData(parser.FILE_PZPR), '*'); break;
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

require('electron').ipcRenderer.on('menu-req', function(e, req){
	ui.menuarea.recvMenuReq(req);
});
window.addEventListener("message", function(e){
	var msg = JSON.parse(e.data);
	ui.menuarea.recvMessage(e.source, msg.channel, msg.data);
}, false);

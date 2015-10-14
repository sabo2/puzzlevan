var app = require('app');
var ipc = require('ipc');
var BrowserWindow = require('browser-window');
var appmenu = require('menu');

require('crash-reporter').start();

var srcdir = 'file://' + __dirname + '/src/';

// Global objects
var pzprversion = '';
var latest_pid = '';
var openpos = {x:40, y:40, modify:function(){this.x+=24;this.y+=24;}};

//--------------------------------------------------------------------------
// Window references so as not to happen memory leak
var mainWindow = null;
var focusedPuzzleWindow = null;
var puzzleWindows = {
	list : [],
	add : function(win){
		this.list.push(win);
	},
	remove : function(win){
		var idx = this.list.indexOf(win);
		if(idx>=0){ this.list.splice(idx,1);}
	}
};
var utilWindows = {
	list : [],
	add : puzzleWindows.add,
	remove : puzzleWindows.remove
};

// Window factory function
function openPuzzleWindow(data, pid){
	if(!data){ require('dialog').showErrorBox("Puzzlevan", "No Puzzle Data Error!!"); return;}
	
	var win = new BrowserWindow({x:openpos.x, y:openpos.y, width: 600, height: 600});
	openpos.modify();
	win.webContents.on('did-finish-load', function(){ win.webContents.send('initial-data', data, pid); focusedPuzzleWindow = win;});
	win.on('focus', function(){ focusedPuzzleWindow = win;});
	win.on('closed', function(){ puzzleWindows.remove(win); if(focusedPuzzleWindow===win){ focusedPuzzleWindow=null;}}); // reference
	win.loadUrl(srcdir + 'p.html');
	puzzleWindows.add(win); // reference
}
function openMainWindow(menuitem, focusedWindow){
	if(!!mainWindow){ mainWindow.focus(); return;}
	
	mainWindow = new BrowserWindow({x:18, y:18, width: 600, height: 600});
	mainWindow.webContents.on('will-navigate', function(e, url){
		openPuzzleWindow(url);
		e.preventDefault();
	});
	mainWindow.on('closed', function(){ mainWindow = null;});
	mainWindow.loadUrl(srcdir + 'index.html');
}
function openPopupWindow(url, data){
	var focusedWindow = BrowserWindow.getFocusedWindow(), x = 24, y = 24;
	if(!!focusedWindow){
		var bounds = focusedWindow.getBounds();
		x = bounds.x + 24;
		y = bounds.y + 24;
	}
	var win = new BrowserWindow({x, y, width:360, height:360, 'always-on-top':true});
	if(!!data){ win.webContents.on('did-finish-load', function(){ win.webContents.send('initial-data', data);});}
	win.on('closed', function(){ utilWindows.remove(win);}); // reference
	win.loadUrl(srcdir+'popups/'+url);
	utilWindows.add(win); // reference
}
function openLocalWindow(localurl){
	if(!localurl.match(/^data\:/)){
		localurl = srcdir + localurl;
	}
	var win = new BrowserWindow({x:openpos.x, y:openpos.y, width: 600, height: 600});
	openpos.modify();
	win.on('closed', function(){ utilWindows.remove(win);}); // reference
	win.loadUrl(localurl);
	utilWindows.add(win); // reference
}
function openExplainWindow(menuitem, focusedWindow){
	var win = new BrowserWindow({x:openpos.x, y:openpos.y, width: 600, height: 600});
	openpos.modify();
	win.on('closed', function(){ utilWindows.remove(win);}); // reference
	win.loadUrl(srcdir+'faq.html?'+latest_pid+"_edit");
	utilWindows.add(win); // reference
}

//--------------------------------------------------------------------------
// IPCs from puzzle windows
ipc.on('open-puzzle', function(e, data){ openPuzzleWindow(data, latest_pid);});
ipc.on('open-local', function(e, localurl){ openLocalWindow(localurl);});
ipc.on('update-pid', function(e, pid){ latest_pid = pid;});
function writeFile(data, pid, ext){
	var focusedWindow = BrowserWindow.getFocusedWindow() || null;
	var option = {title:"Save File - Puzzlevan", defaultPath:pid+'.'+ext, filters:[{name:'Puzzle Files', extensions:[ext]}]};
	var filename = require('dialog').showSaveDialog(focusedWindow, option);
	if(!!filename){
		require('fs').writeFile(filename, data, {encoding:'utf8'});
	}
}
ipc.on('write-file',     function(e, data, pid){ writeFile(data,pid,'txt');});
ipc.on('write-file-xml', function(e, data, pid){ writeFile(data,pid,'xml');});
ipc.on('export-url', function(e, urls, pid){
	openPopupWindow('urloutput.html?'+pid, urls);
});
ipc.on('edit-metadata', function(e, meta, pid, col, row){
	console.dir(meta.comment);
	openPopupWindow('metadata.html?'+pid+'/'+col+'/'+row, meta);
});
ipc.on('update-metadata', function(e, meta){
	if(focusedPuzzleWindow){
		focusedPuzzleWindow.webContents.send('update-req', 'metadata', meta);
	}
});

// IPCs from main window
ipc.on('pzpr-version', function(e, ver){ pzprversion = ver;});

// IPCs from popup window
ipc.on('board-adjust', function(e, operation){
	if(focusedPuzzleWindow){
		focusedPuzzleWindow.webContents.send('menu-req', 'adjust-'+operation);
	}
});

//--------------------------------------------------------------------------
//--------------------------------------------------------------------------
//--------------------------------------------------------------------------
function openFile(menuitem, focusedWindow){
	var option = {title:"Open File - Puzzlevan", properties:['openFile'], filters:[{name:'Puzzle Files', extensions:['txt','xml']}]};
	var files = require('dialog').showOpenDialog(focusedWindow, option);
	if(!!files){
		require('fs').readFile(files[0], {encoding:'utf8'}, function(error, data){
			if(!error){ openPuzzleWindow(data, latest_pid);}
		});
	}
}
function saveFile(menuitem, focusedWindow){
	if(focusedWindow && focusedWindow!==mainWindow){
		focusedWindow.webContents.send('menu-req', 'save-pzpr');
	}
}
function saveKanpen(menuitem, focusedWindow){
	if(focusedWindow && focusedWindow!==mainWindow){
		focusedWindow.webContents.send('menu-req', 'save-pbox');
	}
}
function saveKanpenXML(menuitem, focusedWindow){
	if(focusedWindow && focusedWindow!==mainWindow){
		focusedWindow.webContents.send('menu-req', 'save-pbox-xml');
	}
}

function sendMenuReq(content){ 
	return function(menuitem, focusedWindow){
		if(focusedWindow && focusedWindow!==mainWindow){
			focusedWindow.webContents.send('menu-req', content);
		}
	};
}

function minimizeFocusedWindow(menuitem, focusedWindow){
	if(focusedWindow){ focusedWindow.minimize();}
}
function reloadFocusedWindow(menuitem, focusedWindow){
	if(focusedWindow){ focusedWindow.reload();}
}
function closeFocusedWindow(menuitem, focusedWindow){
	if(focusedWindow){ focusedWindow.close();}
}
function toggleDevTool(menuitem, focusedWindow){
	if(focusedWindow){ focusedWindow.toggleDevTools();}
}

function versionInfo(menuitem, focusedWindow){
	var msg = [
		'Puzzlevan v'+app.getVersion(),
		'Puzzlevan is made by sabo2.',
		'',
		'This application is based on:',
		'Electron v'+process.versions.electron+' (Chromium v'+process.versions.chrome+')',
		'PUZ-PRE v'+pzprversion
	].join('\n');
	var option = {type:'none', message:msg, buttons:['OK']};
	require('dialog').showMessageBox(option);
}

//--------------------------------------------------------------------------
//--------------------------------------------------------------------------
function popupNewBoard(menuitem, focusedWindow){
	if(!latest_pid){ return;}
	openPopupWindow('newboard.html?'+latest_pid);
}
function popupURLImport(menuitem, focusedWindow){
	openPopupWindow('urlinput.html');
}
function popupURLExport(menuitem, focusedWindow){
	if(focusedWindow && focusedWindow!==mainWindow){
		focusedWindow.webContents.send('menu-req', 'export-url');
	}
}
function popupAdjust(menuitem, focusedWindow){
	if(focusedWindow && focusedWindow!==mainWindow){
		openPopupWindow('adjust.html?'+latest_pid);
	}
}

//--------------------------------------------------------------------------
//--------------------------------------------------------------------------

function setMenu(){
	var template = (process.platform==='darwin' ? [
		{ label:'Puzzlevan', submenu: [
			{ label:'About Puzzlevan', selector: 'orderFrontStandardAboutPanel:'},
			{ type: 'separator'},
			{ label:'Open Puzzle List', accelerator:'Cmd+L', click:openMainWindow},
			{ type: 'separator'},
			{ label:'Services', role:'services', submenu:[]},
			{ type: 'separator'},
			{ label:'Hide Puzzlevan', accelerator:'Cmd+H',       selector:'hide:'},
			{ label:'Hide Others',    accelerator:'Cmd+Shift+H', selector:'hideOtherApplications:'},
			{ label:'Show All',                                  selector:'unhideAllApplications:'},
			{ type: 'separator'},
			{ label:'Quit Puzzlevan', accelerator:'Cmd+Q', click:function(){ app.quit();}},
		]},
		{ label:'File', submenu: [
			{ label:'New Board',       accelerator:'Cmd+N', click:popupNewBoard},
			{ label:'Open File',       accelerator:'Cmd+O', click:openFile},
			{ label:'Save File As...', submenu:[
				{ label:'PUZ-PRE format', accelerator:'Cmd+S', click:saveFile},
				{ label:'pencilbox format (text)',             click:saveKanpen},
				{ label:'pencilbox format (XML)',              click:saveKanpenXML},
			]},
			{ type: 'separator'},
			{ label:'Import URL',                           click:popupURLImport},
			{ label:'Export URL',                           click:popupURLExport},
			{ type: 'separator'},
			{ label:'Save Image', submenu:[
				{ label:'PNG Format (png)',                 click:sendMenuReq('saveimage-png')},
				{ label:'Vector Format (SVG)',              click:sendMenuReq('saveimage-svg')},
			]},
			{ type: 'separator'},
			{ label:'Edit Puzzle Properties',               click:sendMenuReq('edit-metadata')},
			{ type: 'separator'},
			{ label:'Close Window', accelerator:'Cmd+W', click:closeFocusedWindow},
		]},
		{ label:'Edit', submenu: [
			{ label:'Undo', click:sendMenuReq('undo')},
			{ label:'Redo', click:sendMenuReq('redo')},
			{ type: 'separator'},
			{ label:'Editor Mode', accelerator:'Shift+F2', click:sendMenuReq('edit-mode')},
			{ label:'Answer Mode', accelerator:'F2',       click:sendMenuReq('play-mode')},
			{ type: 'separator'},
			{ label:'Check Answer', accelerator:'Cmd+E', click:sendMenuReq('check')},
			{ label:'Erase Answer',                      click:sendMenuReq('ansclear')},
			{ label:'Erase Aux.Mark',                    click:sendMenuReq('auxclear')},
			{ type: 'separator'},
			{ label:'Adjust the Board',                  click:popupAdjust},
			{ type: 'separator'},
			{ label:'Duplicate the Board',               click:sendMenuReq('duplicate')},
		]},
//		{ label:'View', submenu: [] },
		{ label:'Window', role:'window', submenu: [
			{ label:'Minimize',        accelerator:'Cmd+M',     click:minimizeFocusedWindow},
			{ label:'Reload',          accelerator:'Cmd+R',     click:reloadFocusedWindow},
			{ label:'Toggle DevTools', accelerator:'Alt+Cmd+I', click:toggleDevTool},
			{ type: 'separator'},
			{ label:'Bring All to Front', selector:'arrangeInFront:'},
		]},
		{ label:'Help', role:'help', submenu: [
			{ label:'About Puzzlevan', click:versionInfo},
			{ label:'How to Input',    click:openExplainWindow},
		]},
	] : [ /* Windows, Linux */
		{ label:'&File', submenu: [
			{ label:'&New Board',    accelerator:'Ctrl+N', click:popupNewBoard},
			{ label:'&Open File',    accelerator:'Ctrl+O', click:openFile},
			{ label:'&Save File As...', submenu:[
				{ label:'&PUZ-PRE format', accelerator:'Cmd+S', click:saveFile},
				{ label:'pencilbox format (&text)',             click:saveKanpen},
				{ label:'pencilbox format (&XML)',              click:saveKanpenXML},
			]},
			{ type: 'separator'},
			{ label:'&Import URL',                         click:popupURLImport},
			{ label:'&Export URL',                         click:popupURLExport},
			{ type: 'separator'},
			{ label:'Save Imag&e', submenu:[
				{ label:'&PNG Format (png)',               click:sendMenuReq('saveimage-png')},
				{ label:'&Vector Format (SVG)',            click:sendMenuReq('saveimage-svg')},
			]},
			{ type: 'separator'},
			{ label:'Edit Puzzle &Properties',             click:sendMenuReq('edit-metadata')},
			{ type: 'separator'},
			{ label:'Open Puzzle &List', accelerator:'Ctrl+L', click:openMainWindow},
			{ type: 'separator'},
			{ label:'&Close Window', accelerator:'Ctrl+W', click:closeFocusedWindow},
			{ type: 'separator'},
			{ label:'&Quit Puzzlevan',                     click:function(){ app.quit();}},
		]},
		{ label:'&Edit', submenu: [
			{ label:'Undo', click:sendMenuReq('undo')},
			{ label:'Redo', click:sendMenuReq('redo')},
			{ type: 'separator'},
			{ label:'Editor Mode', accelerator:'Shift+F2', click:sendMenuReq('edit-mode')},
			{ label:'Answer Mode', accelerator:'F2',       click:sendMenuReq('play-mode')},
			{ type: 'separator'},
			{ label:'&Check Answer', accelerator:'Ctrl+E', click:sendMenuReq('check')},
			{ label:'Erase Answer',                        click:sendMenuReq('ansclear')},
			{ label:'Erase Aux.Mark',                      click:sendMenuReq('auxclear')},
			{ type: 'separator'},
			{ label:'&Adjust the Board',                   click:popupAdjust},
			{ type: 'separator'},
			{ label:'&Duplicate the Board',                click:sendMenuReq('duplicate')},
		]},
//		{ label:'&View', submenu: [] },
		{ label:'&Window', submenu: [
			{ label:'&Minimize',        accelerator:'Ctrl+M', click:minimizeFocusedWindow},
			{ label:'&Reload',          accelerator:'Ctrl+R', click:reloadFocusedWindow},
			{ label:'Toggle &DevTools', accelerator:'F12',    click:toggleDevTool},
		]},
		{ label:'Help', submenu: [
			{ label:'About Puzzlevan', click:versionInfo},
			{ label:'How to Input',    click:openExplainWindow},
		]},
	]);
	
	var menu = appmenu.buildFromTemplate(template);
	appmenu.setApplicationMenu(menu);
}

//--------------------------------------------------------------------------
//--------------------------------------------------------------------------
//--------------------------------------------------------------------------

var openStandAlone = true;
app.on('open-file', function(e, filepath){
	openStandAlone = false;
	require('fs').readFile(filepath, {encoding:'utf8'}, function(error, data){
		if(!error){ openPuzzleWindow(data, latest_pid);}
	});
	e.preventDefault();
});
app.on('open-url', function(e, url){
	openStandAlone = false;
	openPuzzleWindow(url, latest_pid);
	e.preventDefault();
});
app.on('ready', function(){
	setMenu();
	if(openStandAlone){ openMainWindow();}
});
app.on('window-all-closed', function(){
	if(process.platform !== 'darwin'){ app.quit();}
});

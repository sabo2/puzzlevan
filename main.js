var app = require('app');
var ipc = require('ipc');
var BrowserWindow = require('browser-window');
var appmenu = require('menu');

require('crash-reporter').start();

var srcdir = 'file://' + __dirname + '/src/';

var mainWindow = null;

var puzzleWindows = {
	list : [],
	add : function(w){
		this.list.push(w);
	},
	remove : function(w){
		var idx = this.list.indexOf(w);
		if(idx>=0){ this.list.splice(idx,1);}
	}
};

var latest_pid = '';

function newPuzzleWindow(data, pid){
	if(!data){ require('dialog').showErrorBox("puzzlevan", "No Puzzle Data Error!!"); return;}
	
	var win = new BrowserWindow({width: 600, height: 600});
	win.webContents.on('did-finish-load', function(){ win.webContents.send('initial-data', data, pid);});
	win.on('closed', function(){ puzzleWindows.remove(win);}); // reference
	win.loadUrl(srcdir + 'p.html');
	puzzleWindows.add(win); // reference
}
function openMainWindow(){
	if(!!mainWindow){ mainWindow.focus(); return;}
	
	mainWindow = new BrowserWindow({x:18, y:18, width: 600, height: 600});
	mainWindow.webContents.on('will-navigate', function(e, url){
		newPuzzleWindow(url);
		e.preventDefault();
	});
	mainWindow.on('closed', function(){ mainWindow = null;});
	mainWindow.loadUrl(srcdir + 'index.html');
}

ipc.on('open-puzzle', function(e, data){ newPuzzleWindow(data, latest_pid);});
ipc.on('open-local', function(e, localurl){
	if(!localurl.match(/^data\:/)){
		localurl = srcdir + localurl;
	}
	var win = new BrowserWindow({width: 600, height: 600});
	win.on('closed', function(){ puzzleWindows.remove(win);}); // reference
	win.loadUrl(localurl);
	puzzleWindows.add(win); // reference
});
ipc.on('update-pid', function(e, pid){ latest_pid = pid;});
ipc.on('write-file', function(e, data, pid){
	var focusedWindow = BrowserWindow.getFocusedWindow() || null;
	var option = {title:"Save File - puzzlevan", defaultPath:pid+'.txt'};
	var filename = require('dialog').showSaveDialog(focusedWindow, option);
	if(!!filename){
		require('fs').writeFile(filename, data, {encoding:'utf8'});
	}
});

//--------------------------------------------------------------------------
//--------------------------------------------------------------------------
//--------------------------------------------------------------------------
function openFile(){
	var focusedWindow = BrowserWindow.getFocusedWindow() || null;
	var option = {title:"Open File - puzzlevan", properties:['openFile']};
	var files = require('dialog').showOpenDialog(focusedWindow, option);
	if(!!files){
		require('fs').readFile(files[0], {encoding:'utf8'}, function(error, data){
			if(!error){ newPuzzleWindow(data, latest_pid);}
		});
	}
}
function saveFile(){
	var focusedWindow = BrowserWindow.getFocusedWindow();
	if(focusedWindow && focusedWindow!==mainWindow){
		focusedWindow.webContents.send('menu-req', 'save-pzpr');
	}
}
function saveKanpen(){
	var focusedWindow = BrowserWindow.getFocusedWindow();
	if(focusedWindow && focusedWindow!==mainWindow){
		focusedWindow.webContents.send('menu-req', 'save-pbox');
	}
}

function sendMenuReq(content){
	var focusedWindow = BrowserWindow.getFocusedWindow();
	if(focusedWindow && focusedWindow!==mainWindow){
		focusedWindow.webContents.send('menu-req', content);
	}
}

function minimizeFocusedWindow(){
	var focusedWindow = BrowserWindow.getFocusedWindow();
	if(focusedWindow){ focusedWindow.minimize();}
}
function reloadFocusedWindow(){
	var focusedWindow = BrowserWindow.getFocusedWindow();
	if(focusedWindow){ focusedWindow.reload();}
}
function closeFocusedWindow(){
	var focusedWindow = BrowserWindow.getFocusedWindow();
	if(focusedWindow){ focusedWindow.close();}
}
function toggleDevTool() {
	var focusedWindow = BrowserWindow.getFocusedWindow();
	if(focusedWindow){ focusedWindow.toggleDevTools();}
}

function setMenu(){
	var template = (process.platform==='darwin' ? [
		{ label:'puzzlevan', submenu: [
			{ label:'About puzzlevan', selector: 'orderFrontStandardAboutPanel:'},
			{ type: 'separator'},
			{ label:'Open Main Window', accelerator:'Cmd+I', click:openMainWindow},
			{ type: 'separator'},
			{ label:'Services', submenu:[]},
			{ type: 'separator'},
			{ label:'Hide puzzlevan', accelerator:'Cmd+H',       selector:'hide:'},
			{ label:'Hide Others',    accelerator:'Cmd+Shift+H', selector:'hideOtherApplications:'},
			{ label:'Show All',                                  selector:'unhideAllApplications:'},
			{ type: 'separator'},
			{ label:'Quit puzzlevan', accelerator:'Cmd+Q', click:function(){ app.quit();}},
		]},
		{ label:'File', submenu: [
			{ label:'Open File',       accelerator:'Cmd+O', click:openFile},
			{ label:'Save File As...', submenu:[
				{ label:'PUZ-PRE format', accelerator:'Cmd+S', click:saveFile},
				{ label:'pencilbox format (text)',             click:saveKanpen},
			]},
			{ type: 'separator'},
			{ label:'Close Window', accelerator:'Cmd+W', click:closeFocusedWindow},
		]},
		{ label:'Edit', submenu: [
			{ label:'Check Answer', accelerator:'Cmd+E', click:function(){ sendMenuReq('check');}},
			{ label:'Erase Answer',                      click:function(){ sendMenuReq('ansclear');}},
			{ label:'Erase Aux.Mark',                    click:function(){ sendMenuReq('auxclear');}},
			{ type: 'separator'},
			{ label:'Duplicate the Board',               click:function(){ sendMenuReq('duplicate');}},
		]},
//		{ label:'View', submenu: [] },
		{ label:'Window', submenu: [
			{ label:'Minimize',        accelerator:'Cmd+M',     click:minimizeFocusedWindow},
			{ label:'Reload',          accelerator:'Cmd+R',     click:reloadFocusedWindow},
			{ label:'Toggle DevTools', accelerator:'Alt+Cmd+I', click:toggleDevTool},
			{ type: 'separator'},
			{ label:'Bring All to Front', selector:'arrangeInFront:'},
		]},
		{ label:'Help', submenu: [] },
	] : [ /* Windows, Linux */
		{ label:'&File', submenu: [
			{ label:'&Open File',    accelerator:'Ctrl+O', click:openFile},
			{ label:'&Save File As...', submenu:[
				{ label:'&PUZ-PRE format', accelerator:'Cmd+S', click:saveFile},
				{ label:'pencilbo&x format (text)',             click:saveKanpen},
			]},
			{ type: 'separator'},
			{ label:'&Close Window', accelerator:'Ctrl+W', click:closeFocusedWindow},
			{ type: 'separator'},
			{ label:'Open &Main Window', accelerator:'Ctrl+I', click:openMainWindow},
			{ type: 'separator'},
			{ label:'&Quit puzzlevan',                     click:function(){ app.quit();}},
		]},
		{ label:'&Edit', submenu: [
			{ label:'&Check Answer', accelerator:'Ctrl+E', click:function(){ sendMenuReq('check');}},
			{ label:'Erase Answer',                        click:function(){ sendMenuReq('ansclear');}},
			{ label:'Erase Aux.Mark',                      click:function(){ sendMenuReq('auxclear');}},
			{ type: 'separator'},
			{ label:'&Duplicate the Board',                click:function(){ sendMenuReq('duplicate');}},
		]},
//		{ label:'&View', submenu: [] },
		{ label:'&Window', submenu: [
			{ label:'&Minimize',        accelerator:'Ctrl+M', click:minimizeFocusedWindow},
			{ label:'&Reload',          accelerator:'Ctrl+R', click:reloadFocusedWindow},
			{ label:'Toggle &DevTools', accelerator:'F12',    click:toggleDevTool},
		]},
		{ label:'&Help', submenu: [] },
	]);
	
	var menu = appmenu.buildFromTemplate(template);
	appmenu.setApplicationMenu(menu);
}

//--------------------------------------------------------------------------
//--------------------------------------------------------------------------
//--------------------------------------------------------------------------

app.on('ready', function(){
	setMenu();
	openMainWindow();
});
app.on('window-all-closed', function(){
	if(process.platform !== 'darwin'){ app.quit();}
});

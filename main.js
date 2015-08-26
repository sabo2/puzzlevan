var app = require('app');
var ipc = require('ipc');
var BrowserWindow = require('browser-window');

//require('crash-reporter').start();

var srcdir = 'file://' + __dirname + '/src/';

var mainWindow = null;
var focusedWindow = null;

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

function newPuzzleWindow(data){
	if(!data){ require('dialog').showErrorBox("puzzlevan", "No Puzzle Data Error!!"); return;}
	
	var win = new BrowserWindow({width: 600, height: 600});
	win.webContents.on('did-finish-load', function(){ win.webContents.send('initial-data', data);});
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

app.on('ready', openMainWindow);
app.on('window-all-closed', function(){
	//if(process.platform !== 'darwin'){ app.quit();}
	app.quit();
});
app.on('browser-window-focus', function(e,win){ focusedWindow = win;});
app.on('browser-window-blur',  function(e,win){ if(focusedWindow===win){ focusedWindow = null;}});

ipc.on('open-puzzle', function(e, data){ newPuzzleWindow(data);});
ipc.on('open-local', function(e, localurl){
	if(!localurl.match(/^data\:/)){
		localurl = srcdir + localurl;
	}
	var win = new BrowserWindow({width: 600, height: 600});
	win.on('closed', function(){ puzzleWindows.remove(win);}); // reference
	win.loadUrl(localurl);
	puzzleWindows.add(win); // reference
});

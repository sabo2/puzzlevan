var app = require('app');
var BrowserWindow = require('browser-window');

require('crash-reporter').start();

var mainWindow = null;

app.on('window-all-closed', function(){
	//if(process.platform !== 'darwin'){ app.quit();}
	app.quit();
});

app.on('ready', function(){
	mainWindow = new BrowserWindow({width: 600, height: 600});
	mainWindow.loadUrl('file://'+__dirname+'/src/index.html');
	mainWindow.on('closed', function(){ mainWindow = null;});
});

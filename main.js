var app = require('app');
var ipc = require('ipc');
var BrowserWindow = require('browser-window');
var appmenu = require('menu');

var srcdir = 'file://' + __dirname + '/src/';

// Global objects
var pzprversion = '';
var latest_pid = '';
var openpos = {x:40, y:40, modify:function(){this.x+=24;this.y+=24;}};

//--------------------------------------------------------------------------
var pref = {lang:(app.getLocale().match(/ja/) ? 'ja' : 'en'), setting:{puzzle:{},ui:{}}};
var prefFile = app.getPath('userData')+'/preference';
var fs = require('fs');
function savePreference(){
	fs.writeFile(prefFile, JSON.stringify(pref));
}
if(fs.existsSync(prefFile)){ pref = JSON.parse(fs.readFileSync(prefFile));}
else{ savePreference();}

//--------------------------------------------------------------------------
// Window references so as not to happen memory leak
var mainWindow = null, mainWindow2 = null;
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
	
	var win = new BrowserWindow({x:openpos.x, y:openpos.y, width: 600, height: 600, show:false});
	openpos.modify();
	win.webContents.on('did-finish-load', function(){ win.webContents.send('initial-data', data, pid);});
	win.on('closed', function(){ puzzleWindows.remove(win);}); // reference
	win.loadUrl(srcdir + 'p.html');
	puzzleWindows.add(win); // reference
}
function openPopupWindow(url){
	var focusedWindow = BrowserWindow.getFocusedWindow(), x = 24, y = 24;
	if(!!focusedWindow){
		var bounds = focusedWindow.getBounds();
		x = bounds.x + 24;
		y = bounds.y + 24;
	}
	var win = new BrowserWindow({x, y, width:360, height:360, 'always-on-top':true, show:false});
	win.on('focus', function(){ setApplicationMenu();});
	win.on('closed', function(){ utilWindows.remove(win);}); // reference
	win.loadUrl(srcdir+'popups/'+url);
	utilWindows.add(win); // reference
}
function openExplainWindow(menuitem, focusedWindow){
	var win = new BrowserWindow({x:openpos.x, y:openpos.y, width: 600, height: 600});
	openpos.modify();
	win.on('focus', function(){ setApplicationMenu();});
	win.on('closed', function(){ utilWindows.remove(win);}); // reference
	win.loadUrl(srcdir+'faq.html?'+latest_pid+"_edit");
	utilWindows.add(win); // reference
}
function openMainWindow(menuitem, focusedWindow){
	if(!!mainWindow){ mainWindow.focus(); return;}
	
	mainWindow = new BrowserWindow({x:18, y:18, width: 600, height: 600});
	mainWindow.webContents.on('will-navigate', function(e, url){
		latest_pid = url.substr(url.indexOf('?')+1);
		openPopupWindow('newboard.html?'+latest_pid);
		e.preventDefault();
	});
	mainWindow.webContents.on('did-finish-load', function(){ setApplicationMenu();});
	mainWindow.on('focus', function(){ setApplicationMenu();});
	mainWindow.on('closed', function(){ mainWindow = null;});
	mainWindow.loadUrl(srcdir + 'index.html');
}
function openUndefWindow(data){
	mainWindow2 = new BrowserWindow({x:36, y:36, width: 600, height: 600});
	mainWindow2.webContents.on('will-navigate', function(e, url){
		openPuzzleWindow(data, url.substr(url.indexOf('?')+1));
		mainWindow2.destroy();
		e.preventDefault();
	});
	mainWindow2.webContents.on('did-finish-load', function(){ setApplicationMenu();});
	mainWindow2.on('focus', function(){ setApplicationMenu();});
	mainWindow2.on('closed', function(){ mainWindow = null;});
	mainWindow2.loadUrl(srcdir + 'fileindex.html');
}

//--------------------------------------------------------------------------
// IPCs from various windows
ipc.on('open-puzzle', function(e, data, pid){ openPuzzleWindow(data, pid);});
ipc.on('get-pref', function(e){ e.returnValue = pref;});

// IPCs from puzzle-list window
ipc.on('pzpr-version', function(e, ver){ pzprversion = ver;});

// IPCs from puzzle windows
ipc.on('update-pid', function(e, pid, config){
	latest_pid = pid;
	setApplicationMenu(pid, config);
});
ipc.on('save-file', function(e, data, pid, filetype){
	var ext = filetype || 'txt';
	var option = {title:"Save File - Puzzlevan", defaultPath:pid+'.'+ext, filters:[{name:'Puzzle Files', extensions:[ext]}]};
	var filename = require('dialog').showSaveDialog((BrowserWindow.getFocusedWindow()||null), option);
	if(!!filename){
		require('fs').writeFile(filename, data, {encoding:'utf8'});
	}
});
ipc.on('open-undef-popup', function(e, data){
	openUndefWindow(data);
});
ipc.on('get-setting', function(e){
	e.returnValue = pref.setting || {puzzle:{},ui:{}};
});
ipc.on('set-setting', function(e, setting){
	pref.setting = setting;
	savePreference();
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

function sendMenuReq(content){ 
	return function(menuitem, focusedWindow){
		if(focusedWindow && focusedWindow!==mainWindow){
			focusedWindow.webContents.send('menu-req', content);
		}
	};
}
function sendConfigReq(menuitem, focusedWindow){
	var idname = menuitem.id, val = menuitem.checked;
	if(menuitem.id.match(/(.+)\:(.+)/)){ idname = RegExp.$1; val = RegExp.$2;}
	
	if(idname==='language'){ pref.lang = val;}
	BrowserWindow.getAllWindows().forEach(function(win){ win.webContents.send('config-req', idname, val);});
	if(idname==='language'){
		var win = BrowserWindow.getFocusedWindow();
		if(win){ win.hide(); win.show();} // set menu again
		savePreference();
	}
}

function windowEvent(content){
	return function(menuitem, focusedWindow){
		if(focusedWindow){ focusedWindow[content]();}
	};
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

//--------------------------------------------------------------------------
//--------------------------------------------------------------------------

var templateTemplate = [
	{label:'Puzzlevan', when:'isMac', submenu:[
		{ label:'About Puzzlevan', role:'about'},
		{ type: 'separator'},
		{ label:'Services', role:'services', submenu:[]},
		{ type: 'separator'},
		{ label:'Hide Puzzlevan', accelerator:'Cmd+H',       role:'hide'},
		{ label:'Hide Others',    accelerator:'Cmd+Shift+H', role:'hideothers'},
		{ label:'Show All',                                        role:'unhide'},
		{ type: 'separator'},
		{ label:'Quit Puzzlevan', accelerator:'Cmd+Q', click:function(){ app.quit();}},
	]},
	{label:'&File', submenu:[
		{ label:'&New Board',    accelerator:'CmdOrCtrl+N', click:popupNewBoard},
		{ label:'&Open File',    accelerator:'CmdOrCtrl+O', click:openFile},
		{ label:'&Save File As...', when:'isPuzzle', submenu:[
			{ label:'&PUZ-PRE format', accelerator:'CmdOrCtrl+S', click:sendMenuReq('save-pzpr')},
			{ label:'pencilbox format (&text)',                   click:sendMenuReq('save-pbox')},
			{ label:'pencilbox format (&XML)',                    click:sendMenuReq('save-pbox-xml')},
		]},
		{ type: 'separator'},
		{ label:'&Import URL',                         click:popupURLImport},
		{ label:'&Export URL', when:'isPuzzle',        click:sendMenuReq('popup-urloutput')},
		{ type: 'separator', when:'isPuzzle'},
		{ label:'Save Ima&ge', when:'isPuzzle', submenu:[
			{ label:'&PNG Format (png)',               click:sendMenuReq('saveimage-png')},
			{ label:'&Vector Format (SVG)',            click:sendMenuReq('saveimage-svg')},
		]},
		{ type: 'separator', when:'isPuzzle'},
		{ label:'Edit Puzzle &Properties', accelerator:'CmdOrCtrl+P', when:'isPuzzle', click:sendMenuReq('popup-metadata')},
		{ type: 'separator'},
		{ label:'Open Puzzle &List', accelerator:'CmdOrCtrl+L', click:openMainWindow},
		{ type: 'separator'},
		{ label:'&Close Window',   accelerator:'CmdOrCtrl+W', click:windowEvent('close')},
		{ type: 'separator', when:'!isMac'},
		{ label:'&Quit Puzzlevan', accelerator:'Ctrl+Q', click:function(){ app.quit();}, when:'!isMac'},
	]},
	{label:'&Edit', when:'isPuzzle', submenu:[
		{ label:'Undo', click:sendMenuReq('undo')},
		{ label:'Redo', click:sendMenuReq('redo')},
		{ type: 'separator'},
		{ label:'Editor Mode', accelerator:'Shift+F2', click:sendMenuReq('edit-mode')},
		{ label:'Answer Mode', accelerator:'F2',       click:sendMenuReq('play-mode')},
		{ type: 'separator'},
		{ label:'&Check Answer', accelerator:'CmdOrCtrl+E', click:sendMenuReq('check')},
		{ label:'Erase Answer',                             click:sendMenuReq('ansclear')},
		{ label:'Erase Aux.Mark',                           click:sendMenuReq('auxclear')},
		{ type: 'separator'},
		{ label:'&Adjust the Board',                   click:sendMenuReq('popup-adjust')},
		{ type: 'separator'},
		{ label:'&Duplicate the Board',                click:sendMenuReq('duplicate')},
	]},
	{label:'&View', when:'isPuzzle', submenu:[
		{ label:'Cell &Size',                          click:sendMenuReq('popup-dispsize')},
		{ label:'&Color Setting',                      click:sendMenuReq('popup-colors')},
		{ type: 'separator'},
		{ label:'Color coding of line',         config:'irowake'},
		{ label:'Color coding of shaded block', config:'irowakeblk'},
		{ label:'Paint as moving',              config:'dispmove'},
		{ label:'Draw snake border',            config:'snakebd'},
		{ label:'Show cursor',                  config:'cursor'},
		{ type: 'separator'},
		{ label:'Board font', submenu:[
			{ label:'sens-serif', config:'font:1'},
			{ label:'serif',      config:'font:2'},
		]},
		{ type: 'separator'},
	]},
	{label:'&Setting', submenu:[
		{ label:'Input type', when:'config.use!==void 0', submenu:[
			{ label:'LR button',     config:'use:1'},
			{ label:'One button',    config:'use:2'},
		]},
		{ label:'Input type', when:'config.use_tri!==void 0', submenu:[
			{ label:'Corner-side',   config:'use_tri:1'},
			{ label:'Pull-to-Input', config:'use_tri:2'},
			{ label:'One button',    config:'use_tri:3'},
		]},
		{ label:'Display', when:'config.disptype_pipelinkr!==void 0', submenu:[
			{ label:'Circle',        config:'disptype_pipelinkr:1'},
			{ label:'Icebarn',       config:'disptype_pipelinkr:2'},
		]},
		{ label:'Display', when:'config.disptype_bosanowa!==void 0', submenu:[
			{ label:'Original Type', config:'disptype_bosanowa:1'},
			{ label:'Sokoban Type',  config:'disptype_bosanowa:2'},
			{ label:'Waritai Type',  config:'disptype_bosanowa:3'},
		]},
		{ type: 'separator'},
		{ label:'Line continueous check',  config:'redline'},
		{ label:'Block continueous check', config:'redblk'},
		{ label:'Block continueous check', config:'redblkrb'},
		{ label:'Check road',              config:'redroad'},
		{ label:'Input background color',  config:'bgcolor'},
		{ label:'Set Gray color automatically', config:'autocmp',  when:'pid!=="kouchoku"'},
		{ label:'Set Gray color automatically', config:'autocmp',  when:'pid==="kouchoku"'},
		{ label:'Show overlapped number',       config:'autoerr',  when:'pid==="hitori"'},
		{ label:'Slash with color',             config:'autoerr',  when:'pid==="gokigen"||pid==="wagiri"'},
		{ label:'Allow enpty cell',             config:'enbnonum'},
		{ label:'Enable direction aux. mark',   config:'dirauxmark'},
		{ label:'Set line only between points', config:'enline'},
		{ label:'Check lattice point',          config:'lattice'},
		{ label:'Ura-mashu',                    config:'uramashu'},
		{ label:'URL with padding',             config:'bdpadding'},
		{ label:'Disble set color',             config:'discolor'},
		{ type: 'separator'},
		{ label:'Auto answer check',      config:'autocheck'},
		{ label:'Check multiple errors',  config:'multierr'},
		{ label:'Mouse button inversion', config:'lrcheck'},
		{ type: 'separator'},
		{ label:'&Language', submenu:[
			{ label:'日本語',   config:'language:ja'},
			{ label:'English', config:'language:en'},
		]}
	]},
	{label:'&Window', role:'window', submenu:[
		{ label:'&Minimize',        accelerator:'CmdOrCtrl+M', click:windowEvent('minimize')},
		{ label:'&Reload',          accelerator:'CmdOrCtrl+R', click:windowEvent('reload')},
		{ type: 'separator', when:'isMac'},
		{ label:'Bring All to Front', role:'front', when:'isMac'},
	]},
	{label:'Help', role:'help', submenu:[
		{ label:'About Puzzlevan', click:versionInfo},
		{ label:'How to Input',    click:openExplainWindow},
		{ type: 'separator'},
		{ label:'Toggle DevTools',  accelerator:'Alt+Cmd+I', click:windowEvent('toggleDevTools'), when:'isMac'},
		{ label:'Toggle &DevTools', accelerator:'F12',       click:windowEvent('toggleDevTools'), when:'!isMac'},
	]}
];
function setApplicationMenu(pid, config){ // jshint ignore:line, (avoid latedef error)
	var isMac    = (process.platform==='darwin'); // jshint ignore:line, (avoid unused error)
	var isPuzzle = !!config;                      // jshint ignore:line, (avoid unused error)
	config = config || {};
	var template = [];
	var translator = require('./locale/'+pref.lang);
	(function generateProperTemplate(tarray, array){
		tarray.forEach(function(titem){
			// jshint evil:true
			if(titem.when && !eval(titem.when)){}
			else if(!!titem.submenu){
				var item = {label:translator(titem.label), submenu:[]};
				if(!!titem.role){ item.role = titem.role;}
				array.push(item);
				generateProperTemplate(titem.submenu, item.submenu);
			}
			else if(!!titem.config){
				var idname = titem.config, val = ''+true;
				if(titem.config.match(/(.+)\:(.+)/)){ idname = RegExp.$1; val = RegExp.$2;}
				if(idname!=='language' && (!isPuzzle || config[idname]===void 0)){ return;}
				
				var item = {label:translator(titem.label), click:sendConfigReq, id:titem.config};
				item.type    = (idname===titem.config ? 'checkbox' : 'radio');
				item.checked = (idname!=='language' ? ''+config[idname]===val : pref.lang===val);
				array.push(item);
			}
			else{
				var item = {};
				for(var i in titem){ item[i]=titem[i];}
				if(!!item.label){ item.label = translator(item.label);}
				array.push(item);
			}
		});
	})(templateTemplate, template);
	
	appmenu.setApplicationMenu( appmenu.buildFromTemplate(template) );
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
	if(openStandAlone){ openMainWindow();}
});
app.on('window-all-closed', function(){
	if(process.platform !== 'darwin'){ app.quit();}
});

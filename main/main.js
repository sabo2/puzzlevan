var app = require('electron').app;
var ipc = require('electron').ipcMain;
var BrowserWindow = require('electron').BrowserWindow;
var appmenu = require('electron').Menu;

var rootdir = 'file://' + __dirname + '/../';

// Global objects
var pzpr = require('pzpr');
var latest_pid = '';
var openpos = {x:40, y:40, width:640, height:360, modify:function(){
	if((this.x+=24)>this.width) { this.x = 40;}
	if((this.y+=24)>this.height){ this.y = 40;}
}};

//--------------------------------------------------------------------------
var preference = null;
var prefFile = app.getPath('userData')+'/preference';
var fs = require('fs');
function savePreference(){
	var dm = preference.app.debugmode;
	delete preference.app.debugmode;
	fs.writeFile(prefFile, JSON.stringify(preference));
	preference.app.debugmode = dm;
}
(function loadPreference(){
	var errstatus = false;
	preference = null;
	try{
		preference = JSON.parse(fs.readFileSync(prefFile));
	}
	catch(e){
		preference = {app:{lang:(app.getLocale().match(/ja/)?'ja':'en')}, puzzle:{puzzle:{},ui:{}}};
		errstatus = true;
	}
	preference.app.windowmode = preference.app.windowmode || 'mdi';
	preference.app.debugmode = (process.argv.indexOf('--debug')>0);
})();

//--------------------------------------------------------------------------
function setRecentFile(filename){
	if('addRecentDocument' in app){
		app.addRecentDocument(filename);
	}
}
function openFiles(files){
	files.forEach(function(filename){
		fs.readFile(filename, {encoding:'utf8'}, function(error, data){
			if(!error){
				setRecentFile(filename);
				openPuzzleWindow(data, latest_pid, filename);
			}
		});
	});
}
var openStandAlone = true, isReady = false, initFiles = [];
function bootOpenFile(filepath){
	if(!isReady){
		openStandAlone = false;
		initFiles.push(filepath);
	}
	else{ openFiles([filepath]);}
}

//--------------------------------------------------------------------------
process.argv.slice(1).forEach(function(arg){
	try{ if(fs.statSync(arg).isFile()){ bootOpenFile(arg);} }catch(e){}
});
app.on('open-file', function(e, filepath){
	bootOpenFile(filepath);
	e.preventDefault();
});
app.on('open-url', function(e, url){
	openStandAlone = false;
	openPuzzleWindow(url, latest_pid);
	e.preventDefault();
});
app.on('ready', function(){
	isReady = true;
	if(initFiles.length>0){ openFiles(initFiles);}
	else if(preference.app.windowmode==='mdi'){ openPuzzleMDI();}
	else if(openStandAlone){ openMainWindow();}
});
app.on('window-all-closed', function(){
	if(process.platform !== 'darwin'){ app.quit();}
});
app.on('will-quit', function(){
	savePreference();
});

//--------------------------------------------------------------------------
// Window references so as not to happen memory leak
var bzWindows = new Set();
app.on('browser-window-created', function(e, win){ // reference
	bzWindows.add(win);
	win.once('closed', function(){ bzWindows.delete(win);});
});

//--------------------------------------------------------------------------
// Window factory function
const webPreferences = {nodeIntegration:false,preload:__dirname+'/../main/preload.js'};
function openPopupWindow(url){
	var win = new BrowserWindow({
		x:36, y:36, width:360, height:360, alwaysOnTop:true, 
		show:preference.app.debugmode, resizable:false, webPreferences
	});
	win.loadURL(rootdir+'popups/'+url);
}
function openExplainWindow(menuitem, focusedWindow){
	var win = new BrowserWindow({
		x:openpos.x, y:openpos.y, width: 720, height: 600,
		show:preference.app.debugmode, webPreferences
	});
	openpos.modify();
	win.loadURL(rootdir+'index/faq.html?'+latest_pid+"_edit");
}
var mainWindow = null;
function openMainWindow(menuitem, focusedWindow){ // jshint ignore:line, (avoid latedef error)
	if(!!mainWindow){ mainWindow.focus(); return;}
	
	mainWindow = new BrowserWindow({
		x:18, y:18, width: 720, height: 600,
		show:preference.app.debugmode, webPreferences
	});
	mainWindow.once('closed', function(){ mainWindow = null;});
	mainWindow.loadURL(rootdir + 'index/index.html');
}
function openUndefWindow(data, filename){
	var win = new BrowserWindow({
		x:36, y:36, width: 720, height: 400,
		show:preference.app.debugmode, webPreferences
	});
	win.webContents.once('did-finish-load', function(e){ e.sender.send('initial-data', data, filename);});
	win.loadURL(rootdir + 'index/fileindex.html');
}
var sdiWindows = new Set();
function openPuzzleSDI(data, pid, filename){ // jshint ignore:line, (avoid latedef error)
	var win = new BrowserWindow({
		x:openpos.x, y:openpos.y, width: 600, height: 600,
		show:preference.app.debugmode, webPreferences
	});
	openpos.modify();
	win.webContents.once('did-finish-load', function(e){ e.sender.send('initial-data', data, pid, filename);});
	sdiWindows.add(win);
	win.once('closed', function(){ sdiWindows.delete(win);});
	win.loadURL(rootdir + 'puzzle/p.html');
}
var mdiWindow = null;
function openPuzzleMDI(data, pid, filename){ // jshint ignore:line, (avoid latedef error)
	if(!!mdiWindow){
		if(!!data){
			mdiWindow.webContents.send('initial-data', data, pid, filename);
		}
	}
	else{
		mdiWindow = new BrowserWindow({
			x:16, y:16, width: 960, height: 720, minWidth:480, minHeight:240,
			show:true, webPreferences
		});
		if(!!data){
			mdiWindow.webContents.once('did-finish-load', function(e){ e.sender.send('initial-data', data, pid, filename);});
		}
		mdiWindow.once('closed', function(){ mdiWindow = null;});
		mdiWindow.loadURL(rootdir + 'puzzle/p.html');
	}
}
function openPuzzleWindow(data, pid, filename){ // jshint ignore:line, (avoid latedef error)
	if(!data){ require('electron').dialog.showErrorBox("Puzzlevan", "No Puzzle Data Error!!"); return;}
	if(!pid){
		var pzl = new pzpr.parser.FileData(data, '');
		pzl.parseFileType();
		/* ファイルの種類が不明なので種類の選択ダイアログを表示 */
		if(pzl.type===pzpr.parser.FILE_PBOX){ openUndefWindow(data, filename); return;}
	}
	
	if(preference.app.windowmode==='mdi'){
		openPuzzleMDI(data, pid, filename);
	}
	else{
		openPuzzleSDI(data, pid, filename);
	}
}

//--------------------------------------------------------------------------
// IPCs from various windows
ipc.on('open-puzzle', function(e, data, pid, filename){ openPuzzleWindow(data, pid, filename);});
ipc.on('open-file', function(e, filename){ openFiles([filename]);});
ipc.on('close-mainWindow', function(e){ mainWindow.close();});
ipc.on('get-app-preference', function(e){ e.returnValue = preference.app;});

// IPCs from puzzle-list window
ipc.on('set-basic-menu', function(e, first){ setApplicationMenu(e.sender, null, null, first);});
ipc.on('open-popup-newboard', function(e, pid){ openPopupWindow('newboard.html?'+pid);});

// IPCs from puzzle windows
ipc.on('set-puzzle-menu', function(e, pid, config, first){ setApplicationMenu(e.sender, pid, config, first);});
ipc.on('save-file', function(e, data, pid, fileext, filetype){
	var ext = fileext || 'txt';
	var option = {title:"Save File - Puzzlevan", defaultPath:pid+'.'+ext, filters:[{name:'Puzzle Files', extensions:[ext]}]};
	require('electron').dialog.showSaveDialog((BrowserWindow.getFocusedWindow()||null), option, function(filename){
		if(!filename){ return;}
		fs.writeFile(filename, data, {encoding:'utf8'});
		e.sender.send('update-filename', filename, filetype);
		setRecentFile(filename);
	});
});
ipc.on('save-image', function(e, filename, base64data){
	fs.writeFile(filename, base64data, {encoding:'base64'});
});
ipc.on('update-file', function(e, data, filename){
	fs.writeFile(filename, data, {encoding:'utf8'});
	e.sender.send('update-filename');
});
ipc.on('get-puzzle-preference', function(e){
	e.returnValue = preference.puzzle.puzzle;
});
ipc.on('set-puzzle-preference', function(e, setting){
	preference.puzzle.puzzle = setting;
});
ipc.on('get-ui-preference', function(e){
	e.returnValue = preference.puzzle.ui;
});
ipc.on('set-ui-preference', function(e, setting){
	preference.puzzle.ui = setting;
});

//--------------------------------------------------------------------------
//--------------------------------------------------------------------------
//--------------------------------------------------------------------------
function openFile(menuitem, focusedWindow){
	var option = {title:"Open File - Puzzlevan", properties:['openFile','multiSelections'], filters:[{name:'Puzzle Files', extensions:['txt','xml']}]};
	require('electron').dialog.showOpenDialog(focusedWindow, option, function(files){
		if(!!files){ openFiles(files);}
	});
}

function sendMenuReq(content){ 
	return function(menuitem, focusedWindow){
		if(focusedWindow.webContents){
			focusedWindow.webContents.send('menu-req', content);
		}
	};
}
function sendConfigReq(menuitem, focusedWindow){
	var idname = menuitem.id, val = menuitem.checked;
	if(menuitem.id.match(/(.+)\:(.+)/)){ idname = RegExp.$1; val = RegExp.$2;}
	
	if(idname!=='windowsdi'){
		if(idname==='language'){ preference.app.lang = val;}
		BrowserWindow.getAllWindows().forEach(function(win){ win.webContents.send('config-req', idname, val);});
	}
	else{
		preference.app.windowmode = (menuitem.checked ? 'sdi' : 'mdi');
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
		'pzpr.js v'+pzpr.version
	].join('\n');
	var option = {type:'none', message:msg, buttons:['OK']};
	require('electron').dialog.showMessageBox(option);
}

function closeWindow(menuitem, focusedWindow){
	if(focusedWindow!==mdiWindow){
		windowEvent('close')(menuitem, focusedWindow);
	}
	else{
		mdiWindow.webContents.send('menu-req', 'close-puzzle');
	}
}

//--------------------------------------------------------------------------
//--------------------------------------------------------------------------
function popupNewBoard(menuitem, focusedWindow){
	if(preference.app.windowmode==='mdi' && !mdiWindow){ openPuzzleMDI();}
	else{ openMainWindow();}
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
		{ label:'Quit Puzzlevan', accelerator:'Cmd+Q', role:'quit'},
	]},
	{label:'&File', submenu:[
		{ label:'&New Board',    accelerator:'CmdOrCtrl+N', click:popupNewBoard},
		{ label:'&Open File',    accelerator:'CmdOrCtrl+O', click:openFile},
		{ label:'&Save File',    accelerator:'CmdOrCtrl+S', click:sendMenuReq('save-update'), when:'isPuzzle'},
		{ label:'Save File &As...', when:'isPuzzle', submenu:[
			{ label:'&PUZ-PRE format',                            click:sendMenuReq('save-pzpr')},
			{ label:'pencilbox format (&text)',                   click:sendMenuReq('save-pbox')},
			{ label:'pencilbox format (&XML)',                    click:sendMenuReq('save-pbox-xml')},
		]},
		{ type: 'separator'},
		{ label:'&Import URL',                         click:popupURLImport},
		{ label:'&Export URL', when:'isPuzzle',        click:sendMenuReq('popup-urloutput')},
		{ type: 'separator', when:'isPuzzle'},
		{ label:'Save Ima&ge', when:'isPuzzle',        click:sendMenuReq('popup-imagesave')},
//		{ label:'Save Ima&ge', when:'isPuzzle'},
//		, submenu:[
//			{ label:'&PNG Format (png)',               click:sendMenuReq('saveimage-png')},
//			{ label:'&Vector Format (SVG)',            click:sendMenuReq('saveimage-svg')},
//		]},
		{ type: 'separator', when:'isPuzzle'},
		{ label:'Edit Puzzle &Properties', accelerator:'CmdOrCtrl+P', when:'isPuzzle', click:sendMenuReq('popup-metadata')},
		{ type: 'separator'},
		{ label:'&Close Puzzle',   accelerator:'CmdOrCtrl+W', click:closeWindow, when:'!config.windowsdi && isPuzzle'},
		{ label:'&Close Window',   accelerator:'CmdOrCtrl+W', click:closeWindow, when:' config.windowsdi ||!isPuzzle'},
		{ type: 'separator', when:'!isMac'},
		{ label:'&Quit Puzzlevan', accelerator:'Ctrl+Q', role:'quit', when:'!isMac'},
	]},
	{label:'&Edit', when:'isPuzzle', submenu:[
		{ label:'Undo', click:sendMenuReq('undo')},
		{ label:'Redo', click:sendMenuReq('redo')},
		{ type: 'separator'},
		{ label:'Undo/Redo Interval', click:sendMenuReq('popup-undotime')},
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
		{ label:'Display', when:'config.disptype_yajilin!==void 0', submenu:[
			{ label:'Original Type',   config:'disptype_yajilin:1'},
			{ label:'Gray Background', config:'disptype_yajilin:2'},
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
		{ label:'Color coding of line',         config:'irowake'},
		{ label:'Color coding of block',        config:'irowakeblk'},
		{ label:'Paint as moving',              config:'dispmove'},
		{ label:'Draw snake border',            config:'snakebd'},
		{ label:'Show cursor',                  config:'cursor'},
		{ label:'Show buttons in the window',   config:'buttonarea'},
		{ type: 'separator'},
		{ label:'Change the color of Line',  accelerator:'CmdOrCtrl+I', when:'config.irowake!==void 0',    click:sendMenuReq('irowake-change')},
		{ label:'Change the color of Block', accelerator:'CmdOrCtrl+I', when:'config.irowakeblk!==void 0', click:sendMenuReq('irowake-change')},
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
		{ label:'Reload',           accelerator:'CmdOrCtrl+R', click:windowEvent('reload'), when:'preference.app.debugmode'},
		{ label:'&Minimize',        accelerator:'CmdOrCtrl+M', click:windowEvent('minimize')},
		{ type: 'separator'},
		{ label:'Create individual puzzle window', config:'windowsdi'},
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
function setApplicationMenu(webContents, pid, config, first){ // jshint ignore:line, (avoid latedef error)
	var win = BrowserWindow.fromWebContents(webContents);
	var isMac    = (process.platform==='darwin'); // jshint ignore:line, (avoid unused error)
	var isPuzzle = !!config;                      // jshint ignore:line, (avoid unused error)
	if(isMac && (!win.isFocused() && first!==true)){ return;}
	
	latest_pid = pid || '';
	config = config || {};
	config.language = preference.app.lang;
	config.windowsdi = (preference.app.windowmode==='sdi');
	var template = [];
	var translator = require('./locale/'+preference.app.lang);
	var prevtype = '';
	(function generateProperTemplate(tarray, array){
		tarray.forEach(function(titem){
			// jshint evil:true
			var item = null;
			if(titem.when && !eval(titem.when)){}
			else if(!!titem.submenu){
				item = {label:titem.label, type:'submenu', submenu:[]};
				if(!!titem.role){ item.role = titem.role;}
				generateProperTemplate(titem.submenu, item.submenu);
			}
			else if(!!titem.config){
				var idname = titem.config, val = '';
				if(titem.config.match(/(.+)\:(.+)/)){ idname = RegExp.$1; val = RegExp.$2;}
				if(idname!=='language' && idname!=='windowsdi' && (!isPuzzle || config[idname]===void 0)){ return;}
				
				item = {
					label  : titem.label,
					type   : (idname===titem.config ? 'checkbox' : 'radio'),
					checked:(typeof config[idname]==='boolean' ? config[idname] : ''+config[idname]===val),
					click  : sendConfigReq,
					id     : titem.config
				};
			}
			else if(titem.type==='separator'){
				if(prevtype!=='separator' && array.length>0){
					item = {type:'separator'};
				}
			}
			else{
				item = {type:'normal'};
				for(var i in titem){ item[i]=titem[i];}
			}
			
			if(!!item){
				if(!!item.label){ item.label = translator(item.label);}
				array.push(item);
				prevtype = item.type;
			}
		});
	})(templateTemplate, template);
	
	var menu = appmenu.buildFromTemplate(template);
	if(process.platform !== 'darwin'){ win.setMenu(menu);}
	else                             { appmenu.setApplicationMenu(menu);}
}

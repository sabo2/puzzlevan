var packager = require('electron-packager');
var pkg = require('./package.json');

var options = {
	dir       : './',
	out       : './dist',
	overwrite : true,
	asar      : true,
//	platform  : 'darwin,win32,linux',
//	arch      : 'x64,ia32',
	version   : '0.31.2', // version of Electron
	
	prune     : true,
	ignore    : 'node_module|tests|dist|pack\.js|Gruntfile\.js|ignore|\.DS_Store|\.jshintrc|\.settings',
	
	name            : pkg.name,
	'app-version'   : pkg.version,
//	icon            : ''  // not created
	'app-bundle-id' : 'jp.pzv.puzzlevan',
//	'version-string':{ // for Windows env.
//		FileDescription: pkg.description,
//		FileVersion    : pkg.version,
//		ProductVersion : pkg.version,
//		ProductName    : pkg.name,
//		InternalName   : pkg.name
//	}
};
function done(error, appPath){
	if(error){ throw new Error(error);}
	console.log('Building package done! --> '+appPath);
}

[['darwin','x64'],['linux','ia32'],['win32','ia32'],].forEach(function(item){
	options.platform = item[0];
	options.arch     = item[1];
	packager(options, done);
});

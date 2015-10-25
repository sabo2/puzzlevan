var packager = require('electron-packager');
var pkg = require('./package.json');

var options = {
	dir       : './',
	out       : './dist',
	overwrite : true,
	asar      : true,
//	platform  : 'darwin,win32,linux',
//	arch      : 'x64,ia32',
	version   : '0.33.8', // version of Electron
	
	prune     : true,
	ignore    : 'node_module|tests|dist|pack\.js|Gruntfile\.js|ignore|\.DS_Store|\.jshintrc|\.settings',
	
	name            : pkg.productName,
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
	var appPathLower = appPath[0].replace(pkg.productName, pkg.name);
	var dirname = appPathLower.split(/\//g).pop();
	if(appPath[0].match('win32')){
		require('fs').renameSync(appPath[0], appPathLower);
		require('fs').renameSync(appPath[0]+'/'+pkg.productName+'.exe', appPathLower+'/'+pkg.name+'.exe');
	}
	else if(appPath[0].match('linux')){
		require('fs').renameSync(appPath[0], appPathLower);
		require('fs').renameSync(appPath[0]+'/'+pkg.productName, appPathLower+'/'+pkg.name);
	}
	else{ /* darwin */
		require('fs').renameSync(appPath[0]+'/', appPathLower+'/');
	}
	
	console.log('Building package done! --> '+appPathLower);
	
	if(process.argv.indexOf('--zip')>=2){
		require('child_process').exec('zip -9r -y ../'+dirname+'.zip *', {cwd:appPathLower}, function(err, stdout, stderr){
			console.log('Archiving package done! --> '+dirname+'.zip');
		});
	}
}

require('child_process').exec('rm -r dist/*');
[['darwin','x64'],['linux','ia32'],['linux','x64'],['win32','ia32']].forEach(function(item){
	options.platform = item[0];
	options.arch     = item[1];
	packager(options, done);
});


(function(){
	var dir = (function getpath(){
		var srcs = document.getElementsByTagName('script');
		for(var i=0;i<srcs.length;i++){
			var result = srcs[i].outerHTML.match(/src="(.*\/)pzpr\-import\.js"/);
			if(result){ return result[1] + (!result[1].match(/\/$/) ? '/' : '');}
		}
		return "";
	})();
	
	try{
		window.pzpr = require(dir+'pzpr.js');
	}
	catch(e){
		// Windowsの共有フォルダでファイルが開けない仮対策
		console.log("Fallback to open pzpr.js on shared folder on Windows");
		window.pzpr = require(process.resourcesPath+'/app.asar/pzpr/pzpr.js');
	}
})();

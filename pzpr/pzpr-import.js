
(function(){
	var dir = (function getpath(){
		var srcs = document.getElementsByTagName('script');
		for(var i=0;i<srcs.length;i++){
			var result = srcs[i].outerHTML.match(/src="(.*\/)pzpr\-import\.js"/);
			if(result){ return result[1] + (!result[1].match(/\/$/) ? '/' : '');}
		}
		return "";
	})();
	
	window.pzpr = require(dir+'pzpr.js');
})();

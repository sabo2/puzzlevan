
/* concat前のテスト用スクリプト */

/* jshint node: true, evil: true */

(function(){
	var component = [
		"ui/Boot",
		"ui/UI",
		"ui/Puzzles",
		"ui/Event",
		"ui/Listener",
		"ui/MenuConfig",
		"ui/Misc",
		"ui/MenuArea",
		"ui/ToolArea",
		"ui/Timer"
	];

	var isbrowser = true;
	try{ isbrowser = !exports;}
	catch(e){}
	
	if(isbrowser){
		var dir = (function getpath(){
			var srcs=document.getElementsByTagName('script');
			for(var i=0;i<srcs.length;i++){
				var result = srcs[i].src.match(/^(.*\/)ui\.js$/);
				if(result){ return result[1] + (!result[1].match(/\/$/) ? '/' : '');}
			}
			return "";
		})();
		
		for(var i=0; i<component.length; i++){
			var file = dir+component[i]+".js";
			document.write('<script src="'+file+'"></script>');
		}
	}
	else{
		component.unshift("common/intro");
		component.push   ("common/outro");

		var dir = "src/js/";
		exports.files = component.map(function(mod){ return dir+mod+".js";});
	}
})();

/* exported popupmgr */

window.onload = function(){
	var main = document.querySelector('body > div');
	
	popupmgr.win = require('remote').getCurrentWebContents();
	popupmgr.walkElement(main);
	popupmgr.translate();
	popupmgr.setFormEvent();
	
	var rect = main.getBoundingClientRect();
	var win = require('remote').getCurrentWindow();
	win.setContentSize((rect.right-rect.left+0.99)|0, (rect.bottom-rect.top+0.99)|0);
	win.show();
};

var popupmgr = {
	captions : [],
	win : null,
	walkElement : function(parent){
		var els = [parent];
		while(els.length>0){
			var el = els.pop();
			if(!el){ continue;}
			
			if(el.nodeType===1){
				var role = el.dataset.buttonExec;
				if(!!role){
					el.addEventListener('click', popupmgr[role].bind(popupmgr), false);
				}
				role = el.dataset.changeExec;
				if(!!role){
					el.addEventListener('change', popupmgr[role].bind(popupmgr), false);
				}
			}
			else if(el.nodeType===3 && el.data.match(/^__(.+)__(.+)__$/)){
				popupmgr.captions.push({textnode:el, str_ja:RegExp.$1, str_en:RegExp.$2});
			}
			
			if(!!el.nextSibling){ els.push(el.nextSibling);}
			if(el.childNodes.length>0){ els.push(el.firstChild);}
		}
		document.querySelector('form').addEventListener('submit', function(e){ e.preventDefault();}, false);
	},
	lang : (function getLang(){
		var userlang = (navigator.browserLanguage || navigator.language || navigator.userLanguage);
		return ((userlang.substr(0,2)==='ja')?'ja':'en');
	})(),
	translate : function(){
		for(var i=0;i<popupmgr.captions.length;i++){
			var obj = popupmgr.captions[i];
			if(!!obj.textnode){ obj.textnode.data = obj['str_'+this.lang];}
		}
	},
	setFormEvent : function(){},
	close : function(){
		window.close();
	},
	extend : function(obj){ for(var n in obj){ this[n] = obj[n];}}
};

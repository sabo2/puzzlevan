/* exported popupmgr */

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
	adjustWindowSize : function(){
		this.win.setMenuBarVisibility(false);
		var rect = document.querySelector('body > div').getBoundingClientRect();
		this.win.setContentSize((rect.right-rect.left+0.99)|0, (rect.bottom-rect.top+0.99)|0);
	},
	lang : electron.ipcRenderer.sendSync('get-app-preference').lang,
	translate : function(){
		for(var i=0;i<popupmgr.captions.length;i++){
			var obj = popupmgr.captions[i];
			if(!!obj.textnode){ obj.textnode.data = obj['str_'+this.lang];}
		}
		this.adjustWindowSize();
	},
	setFormEvent : function(){},
	show : function(){
		popupmgr.adjustWindowSize();
		popupmgr.win.show();
	},
	close : function(){
		window.close();
	},
	extend : function(obj){ for(var n in obj){ this[n] = obj[n];}}
};
window.onload = function(){
	if(!!window.pzpr){ pzpr.lang = popupmgr.lang;}
	popupmgr.win = electron.remote.getCurrentWindow();
	popupmgr.walkElement(document.querySelector('body > div'));
	popupmgr.translate();
	popupmgr.setFormEvent();
	setTimeout(popupmgr.show, 16);
};

electron.ipcRenderer.on('config-req', function(idname, val){
	if(idname==='language'){
		popupmgr.lang = val;
		if(!!window.pzpr){ pzpr.lang = val;}
		popupmgr.translate();
		electron.ipcRenderer.send('set-basic-menu');
	}
});

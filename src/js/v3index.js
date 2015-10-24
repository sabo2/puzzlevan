
/* global v3index:false */
/* exported v3index */

(function(){

/* variables */
var v3index = {
	typelist : [],
	current  : '',
	doclang  : 'ja',
	complete : false,
	captions : [],
	extend : function(obj){ for(var n in obj){ this[n] = obj[n];}}
};

var _doc = document;
var self = v3index;
var typelist = self.typelist;

function getEL(id){ return _doc.getElementById(id);}

v3index.extend({
	/* common function */
	addEvent : function(element,type,func,capt){
		if(!!element.addEventListener){ element.addEventListener(type,func,!!capt);}
		else if(!!element.attachEvent){ element.attachEvent("on"+type,func);}
		else                          { element["on"+type] = func;}
	},

	/* onload function */
	onload_include : function(){
		setTimeout(function(){
			if(!window.pzpr){ setTimeout(arguments.callee,50); return;}
			self.onload_func();
			self.complete = true;
		},10);
	},
	onload_func : function(){
		self.doclang = require('ipc').sendSync('get-app-preference').lang;
		if(!self.current){
			self.setTabEvent();
			self.setDragDropEvent();
			self.setTranslation();
			self.setAccordion();
			require('ipc').send('pzpr-version', pzpr.version);
		}
		if(location.href.match(/fileindex\.html/)){ self.openUndefFile();}
		self.disp();
	},

	reset_func : function(){
		typelist = [];
		self.current  = '';
		self.onload_func();
	},

	/* tab-click function */
	click_tab : function(e){
		var el = (e.target || e.srcElement);
		if(!!el){ self.current = el.id.substr(8); self.disp();}
	},

	/* display tabs and tables function */
	disp : function(){
		for(var i=0;i<typelist.length;i++){
			var el = getEL("puzmenu_"+typelist[i]);
			var table = getEL("table_"+typelist[i]);
			if(typelist[i]===self.current){
				el.className = "puzmenusel";
				table.style.display = 'table';
			}
			else{
				el.className = "puzmenu";
				table.style.display = 'none';
			}
		}
		self.translate();
	},

	/* open new puzzle window as Electron manner */
	openpuzzle : function(data){
		require('ipc').send('open-puzzle', data);
	},

	setTabEvent : function(){
		if(!getEL("puztypes")){
			getEL("table_all").style.display = "table";
			return;
		}
		var el = getEL("puztypes").firstChild;
		while(!!el){
			if(!!el.tagName && el.tagName.toLowerCase()==='li' &&
				!!el.id      && el.id.match(/puzmenu_(.+)$/)){
				var typename = RegExp.$1;
				typelist.push(typename);
				self.addEvent(el,"click",self.click_tab);
				if(el.className==="puzmenusel"){ self.current = typename;}
			}
			el = el.nextSibling;
		}
		if(!self.current && typelist.length>0){ self.current = typelist[0];}
		getEL("puztypes").style.display = "block";
	},

	setDragDropEvent : function(){
		// File API＋Drag&Drop APIの設定
		this.addEvent(window, 'dragover', function(e){ e.preventDefault();}, true);
		this.addEvent(window, 'drop', function(e){
			Array.prototype.slice.call(e.dataTransfer.files||[]).forEach(function(file){
				var reader = new FileReader();
				reader.onload = function(e){ v3index.openpuzzle(e.target.result);};
				reader.readAsText(file);
			});
			e.preventDefault();
			e.stopPropagation();
		}, true);
	},

	setTranslation : function(){
		var els = [_doc.getElementById("table_all")];
		while(els.length>0){
			var el = els.pop();
			if(!el){ continue;}
			if(el.nodeType===1 && el.nodeName==="LI"){
				var href = el.firstChild.href;
				var pid  = pzpr.variety.toPID(href.substr(href.indexOf("?")+1));
				self.captions.push({textnode:el.firstChild.firstChild, str_ja:pzpr.variety.info[pid].ja, str_en:pzpr.variety.info[pid].en});
			}
			else if(el.nodeType===3 && el.data.match(/^__(.+)__(.+)__$/)){
				self.captions.push({textnode:el, str_ja:RegExp.$1, str_en:RegExp.$2});
			}
			if(!!el.nextSibling){ els.push(el.nextSibling);}
			if(el.childNodes.length>0){ els.push(el.firstChild);}
		}
	},
	translate : function(){
		/* キャプションの設定 */
		for(var i=0;i<this.captions.length;i++){
			var obj = this.captions[i];
			if(!!obj.textnode){ obj.textnode.data = obj['str_'+self.doclang];}
		}
	},

	setAccordion : function(){
		var trs = Array.prototype.slice.call(_doc.querySelectorAll('.accordion'));
		trs.forEach(function(tr){
			tr.addEventListener('click', function(e){
				var next = tr.nextElementSibling;
				if(next.style.display==='none'){
					tr.querySelector('span').className = 'triangle-open';
					next.style.display = '';
				}
				else{
					tr.querySelector('span').className = 'triangle-close';
					next.style.display = 'none';
				}
				e.stopPropagation();
			}, true);
		});
	},

	openUndefFile : function(){
		var items = document.querySelectorAll('ul > li');
		for(var i=0;i<items.length;i++){
			var url = items[i].childNodes[0].getAttribute('href');
			if(!pzpr.variety.info[pzpr.variety.toPID(url.substr(url.indexOf('?')+1))].exists.kanpen){ // kanpenとpencilboxが逆
				items[i].style.display = 'none';
			}
		}
	}
});

/* addEventListener */
self.addEvent(window, 'load', self.onload_include);

/* extern */
window.v3index = v3index;

})();

require('ipc').on('config-req', function(idname, val){
	if(idname==='language'){
		v3index.doclang = val;
		v3index.translate();
	}
});


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
	addEvent : function(element,type,func){
		if(!!element.addEventListener){ element.addEventListener(type,func,false);}
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
		// self.doclang = pzpr.util.getUserLang();
		if(!self.current){
			self.input_init();
			self.setTabEvent();
			self.setTranslation();
			self.setAccordion();
			require('ipc').send('pzpr-version', pzpr.version);
		}
		self.disp();
	},
	input_init : function(){
		return +self.urlif.init();
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
	}
});

/* addEventListener */
self.addEvent(window, 'load', self.onload_include);

/* extern */
window.v3index = v3index;

})();

/*********************/
/* URLInput function */
/*********************/
(function(){

var v3index = window.v3index;

v3index.urlif = {
	extend : function(obj){ for(var n in obj){ this[n] = obj[n];}}
};

var _doc = document;
var _form;
var self = v3index.urlif;

function getEL(id){ return _doc.getElementById(id);}

v3index.urlif.extend({
	init : function(){
		_form = _doc.urlinput;
		if(!!_form){
			v3index.addEvent(getEL("urlinput_btn"), "click", self.urlinput);
			return true;
		}
	},
	urlinput : function(e){
		var url = getEL("urlinput_text").value;
		if(!!url){ v3index.openpuzzle(url);}
	}
});

})();

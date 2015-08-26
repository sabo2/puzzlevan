/* global File:false */
(function(){

/* variables */
var v3index = {
	typelist : [],
	current  : '',
	doclang  : (!location.href.match("index_en.html")?"ja":"en"),
	complete : false,
	LS       : false,
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
		if(!self.current){
			if(!window.pzprfaq && !self.input_init()){
				var el = getEL("puzmenu_input");
				el.parentNode.removeChild(el);
				getEL("table_input").style.display = 'none';
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

			// self.setTranslation();
		}
		self.disp();
	},
	input_init : function(){
		// HTML5 - Web localStorage判定用(localStorage)
		if(pzpr.env.storage.localST){ self.LS = true;}

		var cnt=0;
		if(self.urlif.init()) { cnt++;}
		if(self.fileif.init()){ cnt++;}

		return (cnt>0);
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
				try     { table.style.display = 'table';}
				catch(e){ table.style.display = 'block';} //IE raises error
			}
			else{
				el.className = "puzmenu";
				table.style.display = 'none';
			}
		}
		// self.translate();
	}

//	もし各パズルへのリンクのキャプションんを自動生成したくなったら以下を有効にする
//	setTranslation : function(){
//		var tables = [_doc.getElementById("table_all"),
//					  _doc.getElementById("table_lunch"),
//					  _doc.getElementById("table_nigun"),
//					  _doc.getElementById("table_omopa"),
//					  _doc.getElementById("table_other")];
//		for(var i=0;i<tables.length;i++){
//			if(!tables[i]){ continue;}
//			ui.misc.walker(tables[i], function(el){
//				if(el.nodeType===1 && el.nodeName==="LI"){
//					var href = el.firstChild.href;
//					var pid  = pzpr.variety.toPID(href.substr(href.indexOf("?")+1));
//					self.captions.push({textnode:el.firstChild.firstChild, str_jp:pzpr.variety.info[pid].ja, str_en:pzpr.variety.info[pid].en});
//				}
//			});
//		}
//	},
//	translate : function(){
//		/* キャプションの設定 */
//		for(var i=0;i<this.captions.length;i++){
//			var obj = this.captions[i];
//			if(!!obj.textnode) { obj.textnode.data = (self.doclang==="ja" ? obj.str_jp : obj.str_en);}
//		}
//	}
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
			if(v3index.LS){
				v3index.addEvent(getEL("urlinput_btn"), "click", self.urlinput);
				return true;
			}
			else{
				_form.style.display = 'none';
				return false;
			}
		}
	},
	urlinput : function(e){
		var url = getEL("urlinput_text").value;
		if(!!url){
			localStorage['pzprv3_urldata'] = url;
			window.open('./p.html', '');
		}
	}
});

})();

/*********************/
/* FileRead function */
/*********************/
(function(){

var v3index = window.v3index;

v3index.fileif = {
	extend : function(obj){ for(var n in obj){ this[n] = obj[n];}}
};

var _doc = document;
var _form;
var self = v3index.fileif;

v3index.fileif.extend({
	init : function(){
		_form = _doc.fileform;
		if(!!_form){
			if(v3index.LS){
				v3index.addEvent(_form.filebox, "change", self.fileinput);
				return true;
			}
			else{
				_form.style.display = 'none';
				return false;
			}
		}
	},

	fileinput : function(e){
		var fileEL = _doc.fileform.filebox;
		if(typeof FileReader !== 'undefined'){
			var reader = new FileReader();
			reader.onload = function(e){
				self.fileonload.call(self, e.target.result);
			};
			reader.readAsText(fileEL.files[0]);
		}
		else{
			if(!fileEL.files[0]){ return;}
			this.fileonload(fileEL.files[0].getAsText(''));
		}

		_doc.fileform.reset();
	},
	fileonload : function(str){
		if(!!str){
			var farray = str.replace(/[\t\r]*\n/g,"\n").split(/\n/);
			var fstr = "";
			for(var i=0;i<farray.length;i++){
				if(farray[i].match(/^http\:\/\//)){ break;}
				fstr += (farray[i]+"\n");
			}

			localStorage['pzprv3_filedata'] = fstr;
			window.open('./p.html', '');
		}
	}
});

})();

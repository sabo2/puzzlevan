
/* global v3index:false */
/* exported v3index */

(function(){

/* variables */
var v3index = {
	typelist : [],
	current  : '',
	doclang  : pzpr.lang,
	complete : false,
	captions : [],
	filedata : '',
	filename : '',
	extend : function(obj){ for(var n in obj){ this[n] = obj[n];}}
};

var _doc = document;
var self = v3index;

function getEL(id){ return _doc.getElementById(id);}

v3index.extend({
	/* onload function */
	onload_func : function(){
		self.doclang = pzpr.lang = electron.ipcRenderer.sendSync('get-app-preference').lang;
		self.setTabEvent();
		self.setDragDropEvent();
		self.setTranslation();
		self.translate();
		self.setAccordion();
		if(!!getEL('puztypes')){ getEL('puztypes').style.display = "block";}
		
		self.disp_tab();
		
		electron.remote.getCurrentWindow().show();
		electron.ipcRenderer.send('set-basic-menu',true);
		if(electron.remote.process.platform==='darwin'){
			window.addEventListener('focus', function(){ electron.ipcRenderer.send('set-basic-menu');}, true);
		}
	},

	/* tab-click function */
	setTabEvent : function(){
		Array.prototype.slice.call(_doc.querySelectorAll('#puztypes > li')).forEach(function(el){
			if(el.id.match(/puzmenu_(.+)$/)){
				var typename = RegExp.$1;
				el.addEventListener("click",(function(typename){ return function(e){self.click_tab(typename);};})(typename),false);
			}
		});
	},
	click_tab : function(typename){
		Array.prototype.slice.call(_doc.querySelectorAll('#puztypes > li')).forEach(function(el){
			el.className = (el.id==='puzmenu_'+typename ? "puzmenusel" : "puzmenu");
		});
		self.disp_tab();
		if(_doc.querySelector('li.puzmenusel').dataset.table==='all'){ self.set_puzzle_filter(typename);}
	},
	/* display contents and tables in tabs function */
	disp_tab : function(){
		if(!location.href.match(/\/index\.html/)){ return;}
		var isdisp = {};
		Array.prototype.slice.call(_doc.querySelectorAll('#puztypes > li')).forEach(function(el){
			if(!el.id.match(/puzmenu_(.+)$/)){ return;}
			var tablename = 'table_'+el.dataset.table;
			if(isdisp[tablename]===void 0){ isdisp[tablename] = false;}
			if(isdisp[tablename]===false && el.className==='puzmenusel'){ isdisp[tablename] = true;}
		});
		/* 表示するパズルがない場合にはblockを非表示にする */
		Array.prototype.slice.call(_doc.querySelectorAll('div.puztable')).forEach(function(el){
			el.style.display = (!!isdisp[el.id||'1'] ? 'block' : 'none');
		});
	},

	/* filter-click function */
	set_puzzle_filter : function(filtername){
		/* Set visibility of each puzzle */
		Array.prototype.slice.call(_doc.querySelectorAll('.lists ul > li')).forEach(function(el){
			var pid = pzpr.variety.toPID(el.dataset.pid);
			if(!!pid){
				var isdisp = (filtername==='all' || filtername===(self.variety[pid] ? self.variety[pid].tab : 'extra'));
				el.style.display = (isdisp ? '' : 'none');
			}
		});
		/* Set visibility of each flexbox */
		Array.prototype.slice.call(_doc.querySelectorAll('.lists ul')).forEach(function(el){
			var count = 0;
			Array.prototype.slice.call(el.querySelectorAll('li')).forEach(function(el){
				if(el.style.display!=='none'){ count++;}
			});
			el.parentNode.style.display = (count>0 ? '' : 'none');
		});
	},

	/* open new puzzle window as Electron manner */
	openpuzzle : function(data, pid, filename){
		electron.ipcRenderer.send('open-puzzle', data, pid, filename);
	},

	setDragDropEvent : function(){
		// File API＋Drag&Drop APIの設定
		window.addEventListener('dragover', function(e){ e.preventDefault();}, true);
		window.addEventListener('drop', function(e){
			Array.prototype.slice.call(e.dataTransfer.files||[]).forEach(function(file){
				var reader = new FileReader();
				reader.onload = function(e){ v3index.openpuzzle(e.target.result, '', file.path);};
				reader.readAsText(file);
			});
			e.preventDefault();
			e.stopPropagation();
		}, true);
	},

	/* Language display functions */
	setlang : function(lang){
		self.doclang = pzpr.lang = lang;
		self.translate();
	},
	setTranslation : function(){
		Array.prototype.slice.call(_doc.querySelectorAll('.lists li')).forEach(function(el){
			var pinfo = pzpr.variety(el.dataset.pid);
			var pid = pinfo.pid;
			if(!pinfo.valid){ return;}
			if(el.childNodes.length===0){
				el.className = (self.variety[pid] ? self.variety[pid].state : 'omopa');
				var linkel = document.createElement('a');
				linkel.href = "javascript:void(0);"; // jshint ignore:line
				if(location.href.match(/\/index\.html/)){
					linkel.addEventListener('click', function(e){ self.newboardEvent(e,pid);}, false);
				}
				else if(location.href.match(/fileindex\.html/)){
					if(!pzpr.variety(pid).exists.pencilbox){
						el.style.display = 'none';
					}
					else{
						linkel.addEventListener('click', function(e){ self.selectEvent(e,pid);}, false);
					}
				}
				el.appendChild(linkel);
			}
			self.captions.push({anode:el.firstChild, str_jp:pinfo.ja, str_en:pinfo.en});
		});
	},
	translate : function(){
		/* キャプションの設定 */
		for(var i=0;i<this.captions.length;i++){
			var obj = this.captions[i];
			if(!!obj.anode){
				var text = (self.doclang==="ja" ? obj.str_jp : obj.str_en);
				obj.anode.innerHTML = text.replace(/(\(.+\))/g, "<small>$1</small>");
			}
		}
		Array.prototype.slice.call(_doc.body.querySelectorAll('[lang="ja"]')).forEach(function(el){
			el.style.display = (self.doclang==='ja' ? '' : 'none');
		});
		Array.prototype.slice.call(_doc.body.querySelectorAll('[lang="en"]')).forEach(function(el){
			el.style.display = (self.doclang==='en' ? '' : 'none');
		});
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

	/* Puzzlevan specific functions */
	newboardEvent : function(e,pid){
		electron.ipcRenderer.send('open-popup-newboard', pid);
		e.preventDefault();
	},
	selectEvent : function(e,pid){
		v3index.openpuzzle(v3index.filedata, pid, v3index.filename);
		window.close();
		e.preventDefault();
	}
});

/* addEventListener */
window.addEventListener('load', self.onload_func, false);

/* extern */
window.v3index = v3index;

})();

electron.ipcRenderer.on('config-req', function(e, idname, val){
	if(idname==='language'){
		v3index.setlang(val);
		electron.ipcRenderer.send('set-basic-menu');
	}
});
electron.ipcRenderer.once('initial-data', function(e, data, filename){
	v3index.filedata = data;
	v3index.filename = filename;
});

/*******************/
/* List of puzzles */
/*******************/
(function(){

var v3index = window.v3index;

var pstate = {
	lunch :['nurikabe','tilepaint','norinori','nurimaze','heyawake','hitori','slither','mashu','yajilin',
			'slalom','numlin','hashikake','herugolf','shikaku','tentaisho','kakuro','sudoku','fillomino','ripple',
			'akari','shakashaka'],
	testa :['nagare','juosan','dosufuwa','usoone'],
	trial :['moonsun','stostone','onsen'],
	lunch2:['box','lits','kurodoko','goishi'],
	lunch3:['minarism','factors'],
	nigun :['creek','mochikoro','tasquare','kurotto','shimaguni','yajikazu','bag','country','reflect','icebarn',
			'firefly','kaero','yosenabe','bdblock','fivecells','sashigane','tatamibari','sukoro',
			'gokigen','tateyoko','kinkonkan','hebi', 'makaro'],
	omopa :['nuribou','tawa','lookair','paintarea','chocona','kurochute','mejilink',
			'pipelink','loopsp','nagenawa','kouchoku','ringring','pipelinkr','barns','icelom','icelom2',
			'wblink','kusabi','ichimaga','ichimagam','ichimagax','amibo','bonsan','heyabon','rectslider',
			'nawabari','triplace','fourcells','kramma','kramman','shwolf','loute','fillmat','usotatami','yajitatami',
			'kakuru','view','bosanowa','nanro','cojun','renban','sukororoom','hanare','kazunori',
			'wagiri','shugaku','hakoiri','roma','toichika','cbblock', 'nondango'],
	orig  :['mochinyoro','ayeheya','aho'],
	genre :['tapa', 'arukone', 'yinyang']
};
var tabstate = {
	lunch:'lunch', lunch2:'lunch', lunch3:'nigun',
	testa:'nigun', nigun:'nigun',
	trial:'omopa', omopa:'omopa',
	orig :'extra', genre:'extra'
};

var genres = {};
for(var state in pstate){
	pstate[state].forEach(function(pid){
		genres[pzpr.variety.toPID(pid)] = {state:state, tab:tabstate[state]};
	});
}

v3index.extend({variety:genres});

})();

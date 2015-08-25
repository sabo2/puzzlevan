// Misc.js v3.4.1
/* jshint latedef:false */
/* global ui:false, _doc:false */

//---------------------------------------------------------------------------
// ★Miscクラス html表示系 (Menu, Button以外)の制御を行う
//---------------------------------------------------------------------------
ui.misc = {
	//---------------------------------------------------------------------------
	// misc.displayDesign()  title表示の設定
	//---------------------------------------------------------------------------
	displayDesign : function(){
		var pinfo = pzpr.variety.info[ui.puzzle.pid];
		var title = ui.selectStr(pinfo.ja, pinfo.en);
		if(pzpr.EDITOR){ _doc.title = title + " editor - puzzlevan";}
		else           { _doc.title = title + " player - puzzlevan";}
	},

	//--------------------------------------------------------------------------------
	// misc.setkeyfocus()     キャンバスにフォーカスをセットするか外す
	//--------------------------------------------------------------------------------
	setkeyfocus : function(){
		var canvas = ui.puzzle.canvas;
		if(!canvas){}
		else if(ui.getConfig('keyboard') && ui.puzzle.key.isenablemode()){
			canvas.focus();
			canvas.contentEditable = true;
		}
		else{
			canvas.blur();
			canvas.contentEditable = false;
		}
	},

	//--------------------------------------------------------------------------------
	// misc.modifyCSS()   スタイルシートの中身を変更する
	//--------------------------------------------------------------------------------
	modifyCSS : function(input){
		var sheet = _doc.styleSheets[0];
		var rules = sheet.cssRules || sheet.rules;
		if(rules===null){} // Chromeでローカルファイルを開くとおかしくなるので、とりあえず何もしないようにします
		else if(!this.modifyCSS_sub(rules, input)){
			var sel = ''; for(sel in input){ break;}
			if(!!sheet.insertRule){ sheet.insertRule(""+sel+" {}", rules.length);}
			rules = sheet.cssRules || sheet.rules;	/* IE8まではrulesなし */
			this.modifyCSS_sub(rules, input);
		}
	},
	modifyCSS_sub : function(rules, input){
		var modified = false;
		for(var i=0,len=rules.length;i<len;i++){
			var rule = rules[i];
			if(!rule.selectorText){ continue;}
			var pps = input[rule.selectorText];
			if(!!pps){
				for(var p in pps){ if(!!pps[p]){ rule.style[p]=pps[p];}}
				modified = true;
			}
		}
		return modified;
	},

	//--------------------------------------------------------------------------------
	// misc.walker()        DOMツリーをたどる
	// misc.elementWalker() 要素のみDOMツリーをたどる
	//--------------------------------------------------------------------------------
	walker : function(parent, func){
		var els = [parent.firstChild];
		while(els.length>0){
			var el = els.pop();
			func(el);
			if(!!el.nextSibling){ els.push(el.nextSibling);}
			if(el.childNodes.length>0){ els.push(el.firstChild);}
		}
	},
	elementWalker : function(parent, func){
		this.walker(parent, function(el){ if(el.nodeType===1){ func(el);}});
	}
};

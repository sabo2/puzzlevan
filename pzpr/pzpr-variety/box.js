/*! @license pzpr.js v0.3.2 (c) 2009-2016 sabo2, MIT license
 *   https://bitbucket.org/sabo2/pzprv3 */
!function(a,b){"object"==typeof module&&module.exports?module.exports=[a,b]:pzpr.classmgr.makeCustom(a,b)}(["box"],{MouseEvent:{use:!0,mouseinput:function(){this.puzzle.playmode?(this.mousestart||this.mousemove)&&this.inputcell():this.puzzle.editmode&&this.mousestart&&this.input_onstart()},input_onstart:function(){var a=this.getcell_excell();a.isnull||"excell"!==a.group||(a!==this.cursor.getex()?this.setcursor(a):this.inputnumber(a))},inputnumber:function(a){var b=a.qnum,c=a.getmaxnum();"left"===this.btn?a.setQnum(b!==c?b+1:0):"right"===this.btn&&a.setQnum(0!==b?b-1:c),a.draw()}},KeyEvent:{enablemake:!0,moveTarget:function(a){var b=this.cursor,c=b.getex(),d=c.NDIR;switch(a){case"up":b.bx===b.minx&&b.miny<b.by&&(d=c.UP);break;case"down":b.bx===b.minx&&b.maxy>b.by&&(d=c.DN);break;case"left":b.by===b.miny&&b.minx<b.bx&&(d=c.LT);break;case"right":b.by===b.miny&&b.maxx>b.bx&&(d=c.RT)}return d!==c.NDIR?(b.movedir(d,2),c.draw(),b.draw(),!0):!1},keyinput:function(a){this.key_inputexcell(a)},key_inputexcell:function(a){var b=this.cursor.getex(),c=b.qnum,d=b.getmaxnum();if(a>="0"&&"9">=a){var e=+a;0>=c||this.prev!==b?d>=e&&b.setQnum(e):d>=10*c+e?b.setQnum(10*c+e):d>=e&&b.setQnum(e)}else{if(" "!==a&&"-"!==a)return;b.setQnum(0)}this.prev=b,this.cursor.draw()}},TargetCursor:{initCursor:function(){this.init(-1,-1)}},EXCell:{qnum:0,disInputHatena:!0,maxnum:function(){var a=this.bx,b=this.by;if(-1===a&&-1===b)return 0;for(var c=0,d=-1===a?this.board.rows:this.board.cols;d>0;d--)c+=d;return c},minnum:0},Board:{cols:9,rows:9,hasexcell:1},BoardExec:{adjustBoardData:function(a,b){var c=1|b.x1,d=1|b.y1;this.qnumw=[],this.qnumh=[];for(var e=this.board,f=d;f<=b.y2;f+=2)this.qnumw[f]=e.getex(-1,f).qnum;for(var g=c;g<=b.x2;g+=2)this.qnumh[g]=e.getex(g,-1).qnum},adjustBoardData2:function(a,b){var c=b.x1+b.x2,d=b.y1+b.y2,e=1|b.x1,f=1|b.y1,g=this.board;switch(a){case this.FLIPY:for(var h=e;h<=b.x2;h+=2)g.getex(h,-1).setQnum(this.qnumh[h]);break;case this.FLIPX:for(var i=f;i<=b.y2;i+=2)g.getex(-1,i).setQnum(this.qnumw[i]);break;case this.TURNR:for(var i=f;i<=b.y2;i+=2)g.getex(-1,i).setQnum(this.qnumh[i]);for(var h=e;h<=b.x2;h+=2)g.getex(h,-1).setQnum(this.qnumw[c-h]);break;case this.TURNL:for(var i=f;i<=b.y2;i+=2)g.getex(-1,i).setQnum(this.qnumh[d-i]);for(var h=e;h<=b.x2;h+=2)g.getex(h,-1).setQnum(this.qnumw[h])}}},Graphic:{numbercolor_func:"qnum",paint:function(){this.drawBGCells(),this.drawDotCells(!1),this.drawShadedCells(),this.drawGrid(),this.drawBGEXcells(),this.drawNumbers_box(),this.drawCircledNumbers_box(),this.drawChassis(),this.drawTarget()},getCanvasCols:function(){return this.getBoardCols()+2*this.margin+1},getCanvasRows:function(){return this.getBoardRows()+2*this.margin+1},getOffsetCols:function(){return.5},getOffsetRows:function(){return.5},drawNumbers_box:function(){for(var a=this.vinc("excell_number","auto"),b=this.range.excells,c=0;c<b.length;c++){var d=b[c];d.id>=this.board.cols+this.board.rows||(a.vid="excell_text_"+d.id,d.bx>=0||d.by>=0?(a.fillStyle=this.getNumberColor(d),this.disptext(""+d.qnum,d.bx*this.bw,d.by*this.bh)):a.vhide())}},drawCircledNumbers_box:function(){var a=[],b=this.board,c=this.range.x1,d=this.range.y1,e=this.range.x2,f=this.range.y2;if(e>=b.maxbx)for(var g=1|d,h=Math.min(b.maxby,f);h>=g;g+=2)a.push([b.maxbx+1,g]);if(f>=b.maxby)for(var i=1|c,h=Math.min(b.maxbx,e);h>=i;i+=2)a.push([i,b.maxby+1]);var j=this.vinc("excell_circle","auto",!0),k=.36*this.cw;j.fillStyle=this.circledcolor,j.strokeStyle=this.quescolor;for(var l=0;l<a.length;l++){var m=(a[l][0]!==b.maxbx+1?a[l][0]:a[l][1])+1>>1;j.vid=["ex2_cir_",a[l][0],a[l][1]].join("_"),m>0?j.shapeCircle(a[l][0]*this.bw,a[l][1]*this.bh,k):j.vhide()}var n={globalratio:.95};j=this.vinc("excell_number2","auto"),j.fillStyle=this.fontcolor;for(var l=0;l<a.length;l++){var m=(a[l][0]!==b.maxbx+1?a[l][0]:a[l][1])+1>>1;j.vid=["ex2_cirtext_",a[l][0],a[l][1]].join("_"),m>0?this.disptext(""+m,a[l][0]*this.bw,a[l][1]*this.bh,n):j.vhide()}}},Encode:{decodePzpr:function(a){this.decodeBox()},encodePzpr:function(a){this.encodeBox()},decodeBox:function(){for(var a=0,b=this.outbstr,c=this.board,d=0;d<b.length;d++){var e=b.charAt(d),f=c.excell[a];if("-"===e?(f.qnum=parseInt(b.substr(d+1,2),32),d+=2):f.qnum=parseInt(e,32),a++,a>=c.cols+c.rows){d++;break}}this.outbstr=b.substr(d)},encodeBox:function(){for(var a="",b=this.board,c=0,d=b.cols+b.rows;d>c;c++){var e=b.excell[c].qnum;a+=32>e?""+e.toString(32):"-"+e.toString(32)}this.outbstr+=a}},FileIO:{decodeData:function(){for(var a=this.board,b=this.getItemList(a.rows+1),c=0;c<b.length;c++){var d=b[c];if("."!==d){var e=c%(a.cols+1)*2-1,f=(c/(a.cols+1)<<1)-1,g=a.getex(e,f);g.isnull||(g.qnum=+d);var h=a.getc(e,f);h.isnull||("#"===d?h.qans=1:"+"===d&&(h.qsub=1))}}},encodeData:function(){for(var a=this.board,b=-1;b<a.maxby;b+=2){for(var c=-1;c<a.maxbx;c+=2){var d=a.getex(c,b);if(d.isnull){var e=a.getc(c,b);e.isnull?this.datastr+=". ":1===e.qans?this.datastr+="# ":1===e.qsub?this.datastr+="+ ":this.datastr+=". "}else d.id<a.cols+a.rows?this.datastr+=d.qnum+" ":this.datastr+=". "}this.datastr+="\n"}}},AnsCheck:{checklist:["checkShadeCellExist","checkShadeCells"],checkShadeCells:function(a){for(var b=this.board,c=0;c<b.excell.length;c++){var d,e=b.excell[c],f=e.qnum,g=e.getaddr(),h=0,i=new this.klass.CellList;if(-1===g.by&&g.bx>0&&g.bx<2*b.cols)for(d=g.move(0,2).getc();!d.isnull;)1===d.qans&&(h+=g.by+1>>1),i.add(d),d=g.move(0,2).getc();else{if(!(-1===g.bx&&g.by>0&&g.by<2*b.rows))continue;for(d=g.move(2,0).getc();!d.isnull;)1===d.qans&&(h+=g.bx+1>>1),i.add(d),d=g.move(2,0).getc()}if(f!==h){if(this.failcode.add("nmSumRowShadeNe"),this.checkOnly)break;e.seterr(1),i.seterr(1)}}}},FailCode:{nmSumRowShadeNe:["数字と黒マスになった数字の合計が正しくありません。","A number is not equal to the sum of the number of shaded cells."]}});
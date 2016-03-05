/*! @license pzpr.js v0.3.2 (c) 2009-2016 sabo2, MIT license
 *   https://bitbucket.org/sabo2/pzprv3 */
!function(a,b){"object"==typeof module&&module.exports?module.exports=[a,b]:pzpr.classmgr.makeCustom(a,b)}(["tentaisho"],{MouseEvent:{mouseinput:function(){this.puzzle.playmode?this.mousestart||this.mousemove?"left"===this.btn&&this.isBorderMode()?this.inputborder_tentaisho():this.inputQsubLine():this.mouseend&&this.notInputted()&&this.inputBGcolor3():this.puzzle.editmode&&(this.mousestart&&"left"===this.btn?this.inputstar():(this.mousestart||this.mousemove)&&"right"===this.btn&&this.inputBGcolor1())},inputBGcolor1:function(){var a=this.getcell();a.isnull||a===this.mouseCell||(null===this.inputData&&(this.inputData=0===a.qsub?3:0),a.setQsub(this.inputData),this.mouseCell=a,a.draw())},inputBGcolor3:function(){if(this.puzzle.playeronly||!this.puzzle.getConfig("discolor")){var a=this.getpos(.34),b=a.gets();if(null!==b&&0!==b.getStar()){var c=b.validcell();if(null!==c){var d=c.room.clist;d.encolor()&&d.draw()}}}},inputborder_tentaisho:function(){var a=this.getpos(.34);if(!this.prevPos.equals(a)){var b=this.prevPos.getborderobj(a);b.isnull||(null===this.inputData&&(this.inputData=0===b.qans?1:0),b.setQans(this.inputData),b.draw()),this.prevPos=a}},inputstar:function(){var a=this.getpos(.25);if(!this.prevPos.equals(a)){var b=a.gets();null!==b&&("left"===this.btn?b.setStar({0:1,1:2,2:0}[b.getStar()]):"right"===this.btn&&b.setStar({0:2,1:0,2:1}[b.getStar()]),b.draw()),this.prevPos=a}}},KeyEvent:{enablemake:!0,moveTarget:function(a){return this.moveTBorder(a)},keyinput:function(a){this.key_inputstar(a)},key_inputstar:function(a){var b=this.cursor.gets();null!==b&&("1"===a?b.setStar(1):"2"===a?b.setStar(2):(" "===a||"-"===a||"0"===a||"3"===a)&&b.setStar(0),b.draw())}},Cell:{qnum:0,minnum:0,disInputHatena:!0,subclear:function(){1===this.qsub&&(this.addOpe("qsub",1,0),this.qsub=0),this.error=0}},Cross:{qnum:0,minnum:0},Border:{qnum:0,minnum:0},Star:{bx:null,by:null,isnull:!0,id:null,piece:null,getStar:function(){return this.piece.qnum},setStar:function(a){this.puzzle.opemgr.disCombine=!0,this.piece.setQnum(a),this.puzzle.opemgr.disCombine=!1},iserror:function(){return this.piece.error>0},validcell:function(){var a=this.piece,b=null;return"cell"===a.group?b=a:"cross"===a.group&&0===a.lcnt?b=a.relcell(-1,-1):"border"===a.group&&0===a.qans&&(b=a.sidecell[0]),b},draw:function(){this.puzzle.painter.paintRange(this.bx-1,this.by-1,this.bx+1,this.by+1)},getaddr:function(){return new this.klass.Address(this.bx,this.by)}},Address:{gets:function(){return this.board.gets(this.bx,this.by)}},TargetCursor:{gets:function(){return this.board.gets(this.bx,this.by)}},CellList:{encolor:function(){for(var a=this.getAreaStarInfo().star,b=!1,c=null!==a?a.getStar():0,d=0;d<this.length;d++){var e=this[d];(this.puzzle.playeronly||3!==e.qsub||2===c)&&e.qsub!==(c>0?c:0)&&(e.setQsub(c>0?c:0),b=!0)}return b},getAreaStarInfo:function(){for(var a={star:null,err:-1},b=0;b<this.length;b++)for(var c=this[b],d=this.board.starinside(c.bx,c.by,c.bx+1,c.by+1),e=0;e<d.length;e++){var f=d[e];if(f.getStar()>0&&null!==f.validcell()){if(0===a.err)return{star:null,err:-2};a={star:f,err:0}}}return a}},Board:{hascross:1,hasborder:1,createExtraObject:function(){this.star=[]},initExtraObject:function(a,b){this.initStar(this.cols,this.rows)},starmax:0,star:[],initStar:function(a,b){this.starmax=(2*a-1)*(2*b-1),this.star=[];for(var c=0;c<this.starmax;c++){this.star[c]=new this.klass.Star;var d=this.star[c];d.id=c,d.isnull=!1,d.bx=c%(2*a-1)+1,d.by=(c/(2*a-1)|0)+1,d.piece=d.getaddr().getobj()}},gets:function(a,b){var c=null,d=this.cols,e=this.rows;return 0>=a||a>=d<<1||0>=b||b>=e<<1||(c=a-1+(b-1)*(2*d-1)),null!==c?this.star[c]:null},starinside:function(a,b,c,d){for(var e=new this.klass.PieceList,f=b;d>=f;f++)for(var g=a;c>=g;g++){var h=this.gets(g,f);h&&e.add(h)}return e},encolorall:function(){for(var a=this.board.roommgr.components,b=0;b<a.length;b++)a[b].clist.encolor();this.puzzle.redraw()}},BoardExec:{adjustBoardData2:function(a,b){var c=this.board;c.initStar(c.cols,c.rows)}},AreaRoomGraph:{enabled:!0,setExtraData:function(a){a.clist=new this.klass.CellList(a.getnodeobjs());var b=a.clist.getAreaStarInfo();a.star=b.star,a.error=b.err}},Graphic:{gridcolor_type:"LIGHT",errbcolor1_type:"DARK",bgcellcolor_func:"qsub3",qsubcolor1:"rgb(176,255,176)",qsubcolor2:"rgb(108,108,108)",borderQanscolor:"rgb(72, 72, 72)",paint:function(){this.drawBGCells(),this.drawDashedGrid(),this.drawQansBorders(),this.drawBorderQsubs(),this.drawStars(),this.drawChassis(),this.drawTarget_tentaisho()},drawStars:function(){var a=this.vinc("star","auto",!0);a.lineWidth=Math.max(.04*this.cw,1);for(var b=this.range,c=this.board.starinside(b.x1,b.y1,b.x2,b.y2),d=0;d<c.length;d++){var e=c[d],f=e.bx,g=e.by;a.vid="s_star1_"+e.id,1===e.getStar()?(a.strokeStyle=e.iserror()?this.errcolor1:this.quescolor,a.fillStyle="white",a.shapeCircle(f*this.bw,g*this.bh,.16*this.cw)):a.vhide(),a.vid="s_star2_"+e.id,2===e.getStar()?(a.fillStyle=e.iserror()?this.errcolor1:this.quescolor,a.fillCircle(f*this.bw,g*this.bh,.18*this.cw)):a.vhide()}},drawTarget_tentaisho:function(){this.drawCursor(!1,this.puzzle.editmode)}},Encode:{decodePzpr:function(a){this.decodeStar()},encodePzpr:function(a){this.encodeStar()},decodeKanpen:function(){this.fio.decodeStarFile()},encodeKanpen:function(){this.fio.encodeStarFile()},decodeStar:function(a){var b=this.board;b.disableInfo();for(var c=0,a=this.outbstr,d=0;d<a.length;d++){var e=b.star[c],f=a.charAt(d);if(this.include(f,"0","f")){var g=parseInt(f,16);e.setStar(g%2+1),c+=(g>>1)+1}else this.include(f,"g","z")&&(c+=parseInt(f,36)-15);if(c>=b.starmax)break}b.enableInfo(),this.outbstr=a.substr(d+1)},encodeStar:function(){for(var a=0,b="",c=this.board,d=0;d<c.starmax;d++){var e="",f=c.star[d];if(f.getStar()>0){for(var g=1;7>=g;g++){var h=c.star[d+g];if(h&&h.getStar()>0){e=""+(2*(g-1)+(f.getStar()-1)).toString(16),d+=g-1;break}}""===e&&(e=(13+f.getStar()).toString(16),d+=7)}else a++;0===a?b+=e:(e||20===a)&&(b+=(a+15).toString(36)+e,a=0)}a>0&&(b+=(a+15).toString(36)),this.outbstr+=b}},FileIO:{decodeData:function(){this.decodeStarFile(),this.decodeBorderAns(),this.decodeCellQsub()},encodeData:function(){this.encodeStarFile(),this.encodeBorderAns(),this.encodeCellQsub()},kanpenOpen:function(){this.decodeStarFile(),this.decodeAnsAreaRoom()},kanpenSave:function(){this.encodeStarFile(),this.encodeAnsAreaRoom()},decodeStarFile:function(){var a=this.board,b=this.readLines(2*a.rows-1),c=0;a.disableInfo();for(var d=0;d<b.length;d++)for(var e=0;e<b[d].length;e++){var f=a.star[c];"1"===b[d].charAt(e)?f.setStar(1):"2"===b[d].charAt(e)&&f.setStar(2),c++}a.enableInfo()},encodeStarFile:function(){for(var a=this.board,b=0,c=1;c<=2*a.rows-1;c++){for(var d=1;d<=2*a.cols-1;d++){var e=a.star[b];1===e.getStar()?this.datastr+="1":2===e.getStar()?this.datastr+="2":this.datastr+=".",b++}this.datastr+="\n"}},decodeAnsAreaRoom:function(){this.decodeAreaRoom_com(!1)},encodeAnsAreaRoom:function(){this.encodeAreaRoom_com(!1)},kanpenOpenXML:function(){this.decodeStar_XMLBoard(),this.decodeAnsAreaRoom_XMLAnswer()},kanpenSaveXML:function(){this.encodeStar_XMLBoard(),this.encodeAnsAreaRoom_XMLAnswer()},decodeStar_XMLBoard:function(){for(var a=this.xmldoc.querySelectorAll("board number"),b=0;b<a.length;b++){var c=a[b],d=this.board.gets(+c.getAttribute("c"),+c.getAttribute("r"));null!==d&&d.setStar(+c.getAttribute("n"))}},encodeStar_XMLBoard:function(){for(var a=this.xmldoc.querySelector("board"),b=this.board,c=0;c<b.starmax;c++){var d=b.star[c],e=d.getStar();e>0&&a.appendChild(this.createXMLNode("number",{r:d.by,c:d.bx,n:e}))}},decodeAnsAreaRoom_XMLAnswer:function(){var a=[];this.decodeCellXMLArow(function(b,c){"u"===c?a.push(-1):a.push(+c.substr(1))}),this.rdata2Border(!1,a),this.board.roommgr.rebuild()},encodeAnsAreaRoom_XMLAnswer:function(){var a=this.board;a.roommgr.rebuild();var b=a.roommgr.components;this.xmldoc.querySelector("answer").appendChild(this.createXMLNode("areas",{N:b.length})),this.encodeCellXMLArow(function(a){var c=b.indexOf(a.room);return c>=0?"n"+c:"u"})}},AnsCheck:{checklist:["checkStarOnLine","checkAvoidStar","checkFractal","checkStarRegion"],checkStarOnLine:function(){for(var a=this.board,b=0;b<a.starmax;b++){var c=a.star[b];if(!(c.getStar()<=0||null!==c.validcell())){if(this.failcode.add("bdPassStar"),this.checkOnly)break;switch(c.piece.group){case"cross":c.piece.setCrossBorderError();break;case"border":c.piece.seterr(1)}}}},checkFractal:function(){var a=this.board.roommgr.components;a:for(var b=0;b<a.length;b++){var c=a[b].clist,d=a[b].star;if(null!==d)for(var e=0;e<c.length;e++){var f=c[e],g=this.board.getc(2*d.bx-f.bx,2*d.by-f.by);if(g.isnull||f.room!==g.room){if(this.failcode.add("bkNotSymSt"),this.checkOnly)break a;c.seterr(1)}}}},checkAvoidStar:function(){this.checkErrorFlag(-1,"bkNoStar")},checkStarRegion:function(){this.checkErrorFlag(-2,"bkPlStar")},checkErrorFlag:function(a,b){for(var c=this.board.roommgr.components,d=0;d<c.length;d++)if(c[d].error===a){if(this.failcode.add(b),this.checkOnly)break;c[d].clist.seterr(1)}}},FailCode:{bkNoStar:["星が含まれていない領域があります。","A block has no stars."],bdPassStar:["星を線が通過しています。","A line goes over the star."],bkNotSymSt:["領域が星を中心に点対称になっていません。","An area is not point symmetric about the star."],bkPlStar:["星が複数含まれる領域があります。","A block has two or more stars."]}});
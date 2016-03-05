/*! @license pzpr.js v0.3.2 (c) 2009-2016 sabo2, MIT license
 *   https://bitbucket.org/sabo2/pzprv3 */
!function(a,b){"object"==typeof module&&module.exports?module.exports=[a,b]:pzpr.classmgr.makeCustom(a,b)}(["hitori"],{MouseEvent:{RBShadeCell:!0,use:!0,redblk:!0,mouseinput:function(){this.puzzle.playmode?(this.mousestart||this.mousemove)&&this.inputcell():this.puzzle.editmode&&this.mousestart&&this.inputqnum()}},KeyEvent:{enablemake:!0},Cell:{disInputHatena:!0,maxnum:function(){return Math.max(this.board.cols,this.board.rows)},posthook:{qnum:function(a){this.board.setInfoByCell(this),this.redDisp()},qans:function(a){this.board.setInfoByCell(this),this.redDisp()}},redDisp:function(){var a=this.puzzle,b=a.board;a.getConfig("autoerr")&&(a.painter.paintRange(b.minbx-1,this.by-1,b.maxbx+1,this.by+1),a.painter.paintRange(this.bx-1,b.minby-1,this.bx+1,b.maxby+1))}},Board:{cols:8,rows:8},AreaUnshadeGraph:{enabled:!0},Graphic:{gridcolor_type:"LIGHT",bcolor_type:"GREEN",bgcellcolor_func:"qsub1",numbercolor_func:"auto",fontErrcolor:"red",fontShadecolor:"rgb(96,96,96)",paint:function(){this.drawBGCells(),this.drawGrid(),this.drawShadedCells(),this.drawNumbers_hitori(),this.drawChassis(),this.drawTarget()},drawNumbers_hitori:function(){var a=this.puzzle,b=a.board,c=a.checker;if(!b.haserror&&a.getConfig("autoerr")){var d=a.klass.CellList.prototype,e=d.seterr,f=c.failcode;c.inCheck=!0,c.checkOnly=!1,c.failcode={add:function(){}},d.seterr=d.setinfo,c.checkRowsColsSameQuesNumber(),d.seterr=e,c.failcode=f,c.inCheck=!1;var g=this.range.cells;this.range.cells=b.cell,this.drawNumbers(),this.range.cells=g,b.cell.setinfo(0)}else this.drawNumbers()}},Encode:{decodePzpr:function(a){this.decodeHitori()},encodePzpr:function(a){this.encodeHitori()},decodeHitori:function(){var a=0,b=0,c=this.outbstr,d=this.board;for(b=0;b<c.length;b++){var e=d.cell[a],f=c.charAt(b);if(this.include(f,"0","9")||this.include(f,"a","z")?e.qnum=parseInt(f,36):"-"===f?(e.qnum=parseInt(c.substr(b+1,2),36),b+=2):"%"===f&&(e.qnum=-2),a++,!d.cell[a])break}this.outbstr=c.substr(b)},encodeHitori:function(){for(var a=0,b="",c=this.board,d=0;d<c.cell.length;d++){var e="",f=c.cell[d].qnum;-2===f?e="%":f>=0&&16>f?e=f.toString(36):f>=16&&256>f?e="-"+f.toString(36):a++,0===a?b+=e:(b+=".",a=0)}a>0&&(b+="."),this.outbstr+=b},decodeKanpen:function(){this.fio.decodeCellQnum_kanpen_hitori()},encodeKanpen:function(){this.fio.encodeCellQnum_kanpen_hitori()}},FileIO:{decodeData:function(){this.decodeCellQnum(),this.decodeCellAns()},encodeData:function(){this.encodeCellQnum(),this.encodeCellAns()},kanpenOpen:function(){this.decodeCellQnum_kanpen_hitori(),this.decodeCellAns()},kanpenSave:function(){this.encodeCellQnum_kanpen_hitori(),this.encodeCellAns()},decodeCellQnum_kanpen_hitori:function(){this.decodeCell(function(a,b){"0"!==b&&"."!==b&&(a.qnum=+b)})},encodeCellQnum_kanpen_hitori:function(){this.encodeCell(function(a){return a.qnum>0?a.qnum+" ":"0 "})},kanpenOpenXML:function(){this.decodeCellQnum_XMLBoard_Brow(),this.decodeCellAns_XMLAnswer()},kanpenSaveXML:function(){this.encodeCellQnum_XMLBoard_Brow(),this.encodeCellAns_XMLAnswer()}},AnsCheck:{checklist:["checkShadeCellExist","checkAdjacentShadeCell","checkConnectUnshadeRB","checkRowsColsSameQuesNumber"],checkRowsColsSameQuesNumber:function(){this.checkRowsCols(this.isDifferentNumberInClist_hitori,"nmDupRow")},isDifferentNumberInClist_hitori:function(a){var b=a.filter(function(a){return a.isUnshade()&&a.isNum()});return this.isIndividualObject(b,function(a){return a.qnum})}}});
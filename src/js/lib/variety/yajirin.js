/*! @license pzpr.js v3.5.2-pre (c) 2009-2015 sabo2, MIT license
 *   https://bitbucket.org/sabo2/pzprv3 */
pzpr.classmgr.makeCustom(["yajirin"],{MouseEvent:{mouseinput:function(){this.owner.playmode?this.mousestart||this.mousemove?this.btn.Left?this.inputLine():this.btn.Right&&this.inputcell():this.mouseend&&this.notInputted()&&this.inputcell():this.owner.editmode&&(this.mousestart||this.mousemove?this.inputdirec():this.mouseend&&this.notInputted()&&this.inputqnum())}},KeyEvent:{enablemake:!0,moveTarget:function(a){return a.match(/shift/)?!1:this.moveTCell(a)},keyinput:function(a){this.key_inputdirec(a)||this.key_inputqnum(a)}},Cell:{minnum:0,numberRemainsUnshaded:!0,noLP:function(){return this.isShade()||this.isNum()}},Border:{enableLineNG:!0},Board:{hasborder:1},BoardExec:{adjustBoardData:function(a,b){this.adjustNumberArrow(a,b)}},LineManager:{isCenterLine:!0},Flags:{use:!0,redline:!0,irowake:1},Graphic:{gridcolor_type:"LIGHT",dotcolor:"rgb(255, 96, 191)",paint:function(){this.drawBGCells(),this.drawDotCells(!1),this.drawGrid(),this.drawShadedCells(),this.drawArrowNumbers(),this.drawLines(),this.drawPekes(),this.drawChassis(),this.drawTarget()}},Encode:{decodePzpr:function(){this.decodeArrowNumber16()},encodePzpr:function(){this.encodeArrowNumber16()},decodeKanpen:function(){this.owner.fio.decodeCellDirecQnum_kanpen(!0)},encodeKanpen:function(){this.owner.fio.encodeCellDirecQnum_kanpen(!0)}},FileIO:{decodeData:function(){this.decodeCellDirecQnum(),this.decodeCellAns(),this.decodeBorderLine()},encodeData:function(){this.encodeCellDirecQnum(),this.encodeCellAns(),this.encodeBorderLine()},kanpenOpen:function(){this.decodeCellDirecQnum_kanpen(!1),this.decodeBorderLine()},kanpenSave:function(){this.encodeCellDirecQnum_kanpen(!1),this.encodeBorderLine()},decodeCellDirecQnum_kanpen:function(a){this.decodeCell(function(b,c){if("#"!==c||a)if("+"!==c||a){if("-4"===c)b.qnum=-2;else if("."!==c){var d=parseInt(c),e=(48&d)>>4;0===e?b.qdir=b.UP:1===e?b.qdir=b.LT:2===e?b.qdir=b.DN:3===e&&(b.qdir=b.RT),b.qnum=15&d}}else b.qsub=1;else b.qans=1})},encodeCellDirecQnum_kanpen:function(a){this.encodeCell(function(b){var c,d=b.qnum>=0&&b.qnum<16?b.qnum:-1;if(-1!==d&&b.qdir!==b.NDIR)return b.qdir===b.UP?c=0:b.qdir===b.LT?c=1:b.qdir===b.DN?c=2:b.qdir===b.RT&&(c=3),""+((c<<4)+(15&d))+" ";if(-2===b.qnum)return"-4 ";if(!a){if(1===b.qans)return"# ";if(1===b.qsub)return"+ "}return". "})},kanpenOpenXML:function(){this.decodeCellDirecQnum_XMLBoard(),this.decodeBorderLine_XMLAnswer()},kanpenSaveXML:function(){this.encodeCellDirecQnum_XMLBoard(),this.encodeBorderLine_XMLAnswer()},decodeCellDirecQnum_XMLBoard:function(){this.decodeCellXMLBoard(function(a,b){if(b>=0){var c=(48&b)>>4;0===c?a.qdir=a.UP:1===c?a.qdir=a.LT:2===c?a.qdir=a.DN:3===c&&(a.qdir=a.RT),a.qnum=15&b}else-1===b?a.qsub=1:-2===b?a.qans=1:-4===b&&(a.qnum=-2)})},encodeCellDirecQnum_XMLBoard:function(){this.encodeCellXMLBoard(function(a){var b=-3,c=0;return-1!==a.qnum&&a.qdir!==a.NDIR?(a.qdir===a.UP?c=0:a.qdir===a.LT?c=1:a.qdir===a.DN?c=2:a.qdir===a.RT&&(c=3),b=(c<<4)+(15&a.qnum)):-2===a.qnum?b=-4:1===a.qans?b=-2:1===a.qsub&&(b=-1),b})}},AnsCheck:{checklist:["checkBranchLine","checkCrossLine","checkLineOnShadeCell","checkAdjacentShadeCell","checkDeadendLine+","checkArrowNumber","checkOneLoop","checkEmptyCell_yajirin+"],checkEmptyCell_yajirin:function(){this.checkAllCell(function(a){return 0===a.lcnt&&!a.isShade()&&a.noNum()},"ceEmpty")},checkArrowNumber:function(){for(var a=this.owner.board,b=0;b<a.cellmax;b++){var c=a.cell[b];if(c.isValidNum()&&0!==c.qdir&&!c.isShade()){for(var d=c.getaddr(),e=c.qdir,f=new this.owner.CellList;;){d.movedir(e,2);var g=d.getc();if(g.isnull)break;f.add(g)}if(c.qnum!==f.filter(function(a){return a.isShade()}).length){if(this.failcode.add("anShadeNe"),this.checkOnly)break;c.seterr(1),f.seterr(1)}}}}},FailCode:{ceEmpty:["黒マスも線も引かれていないマスがあります。","There is an empty cell."]}});
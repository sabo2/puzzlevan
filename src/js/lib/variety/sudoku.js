/*! @license pzpr.js v3.5.2-pre (c) 2009-2015 sabo2, MIT license
 *   https://bitbucket.org/sabo2/pzprv3 */
pzpr.classmgr.makeCustom(["sudoku"],{MouseEvent:{mouseinput:function(){this.mousestart&&this.inputqnum()}},KeyEvent:{enablemake:!0,enableplay:!0},Cell:{maxnum:function(){return Math.max(this.owner.board.qcols,this.owner.board.qrows)}},Board:{qcols:9,qrows:9,hasborder:1,initBoardSize:function(a,b){this.common.initBoardSize.call(this,a,b);var c,d;c=d=2*(0|Math.sqrt(this.qcols)),6===this.qcols&&(c=6);for(var e=0;e<this.bdmax;e++){var f=this.border[e];(f.bx%c===0||f.by%d===0)&&(f.ques=1)}this.resetInfo()}},AreaRoomManager:{enabled:!0},Graphic:{paint:function(){this.drawBGCells(),this.drawGrid(),this.drawBorders(),this.drawNumbers(),this.drawChassis(),this.drawCursor()}},Encode:{decodePzpr:function(){this.decodeNumber16()},encodePzpr:function(){this.encodeNumber16()},decodeKanpen:function(){this.owner.fio.decodeCellQnum_kanpen()},encodeKanpen:function(){this.owner.fio.encodeCellQnum_kanpen()}},FileIO:{decodeData:function(){this.decodeCellQnum(),this.decodeCellAnumsub()},encodeData:function(){this.encodeCellQnum(),this.encodeCellAnumsub()},kanpenOpen:function(){this.decodeCellQnum_kanpen(),this.decodeCellAnum_kanpen()},kanpenSave:function(){this.encodeCellQnum_kanpen(),this.encodeCellAnum_kanpen()}},AnsCheck:{checklist:["checkDifferentNumberInRoom","checkDifferentNumberInLine","checkNoNumCell+"],checkDifferentNumberInLine:function(){this.checkRowsCols(this.isDifferentNumberInClist,"nmDupRow")}}});
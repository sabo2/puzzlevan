/*! @license pzpr.js v3.5.2 (c) 2009-2015 sabo2, MIT license
 *   https://bitbucket.org/sabo2/pzprv3 */
pzpr.classmgr.makeCustom(["ripple","cojun"],{MouseEvent:{mouseinput:function(){this.owner.playmode?this.mousestart&&this.inputqnum():this.owner.editmode&&(this.mousestart||this.mousemove&&this.btn.Left?this.inputborder():this.mouseend&&this.notInputted()&&this.inputqnum())}},KeyEvent:{enablemake:!0,enableplay:!0},Cell:{maxnum:function(){return this.owner.board.rooms.getCntOfRoomByCell(this)}},Board:{hasborder:1},"Board@cojun":{qcols:8,qrows:8},AreaRoomManager:{enabled:!0},Graphic:{gridcolor_type:"DLIGHT",paint:function(){this.drawBGCells(),this.drawGrid(),this.drawNumbers(),this.drawBorders(),this.drawChassis(),this.drawCursor()}},Encode:{decodePzpr:function(){this.decodeBorder(),this.decodeNumber16()},encodePzpr:function(){this.encodeBorder(),this.encodeNumber16()},decodeKanpen:function(){this.owner.fio.decodeAreaRoom(),this.owner.fio.decodeCellQnum_kanpen()},encodeKanpen:function(){this.owner.fio.encodeAreaRoom(),this.owner.fio.encodeCellQnum_kanpen()}},FileIO:{decodeData:function(){this.decodeBorderQues(),this.decodeCellQnum(),this.decodeCellAnumsub()},encodeData:function(){this.encodeBorderQues(),this.encodeCellQnum(),this.encodeCellAnumsub()},kanpenOpen:function(){this.decodeAreaRoom(),this.decodeCellQnum_kanpen(),this.decodeCellAnum_kanpen()},kanpenSave:function(){this.encodeAreaRoom(),this.encodeCellQnum_kanpen(),this.encodeCellAnum_kanpen()},kanpenOpenXML:function(){this.decodeAreaRoom_XMLBoard(),this.decodeCellQnum_XMLBoard(),this.decodeCellAnum_XMLAnswer()},kanpenSaveXML:function(){this.encodeAreaRoom_XMLBoard(),this.encodeCellQnum_XMLBoard(),this.encodeCellAnum_XMLAnswer()},UNDECIDED_NUM_XML:0},AnsCheck:{checklist:["checkDifferentNumberInRoom","checkRippleNumber@ripple","checkAdjacentDiffNumber@cojun","checkUpperNumber@cojun","checkNoNumCell+"],checkRippleNumber:function(){var a=!0,b=this.owner.board;a:for(var c=0;c<b.cellmax;c++){var d=b.cell[c],e=d.getNum(),f=d.bx,g=d.by;if(!(0>=e)){for(var h=2;2*e>=h;h+=2){var i=b.getc(f+h,g);if(!i.isnull&&i.getNum()===e){if(a=!1,this.checkOnly)break a;d.seterr(1),i.seterr(1)}}for(var h=2;2*e>=h;h+=2){var i=b.getc(f,g+h);if(!i.isnull&&i.getNum()===e){if(a=!1,this.checkOnly)break a;d.seterr(1),i.seterr(1)}}}}a||this.failcode.add("nmSmallGap")},checkUpperNumber:function(){for(var a=this.owner.board,b=this.getRoomInfo(),c=0;c<a.cellmax-a.qcols;c++){var d=a.cell[c],e=d.adjacent.bottom,f=e.id;if(b.id[c]===b.id[f]&&d.isNum()&&e.isNum()&&!(d.getNum()>=e.getNum())){if(this.failcode.add("bkSmallOnBig"),this.checkOnly)break;d.seterr(1),e.seterr(1)}}}},FailCode:{bkDupNum:["1つの部屋に同じ数字が複数入っています。","A room has two or more same numbers."],bkSmallOnBig:["同じ部屋で上に小さい数字が乗っています。","There is an small number on big number in a room."],nmSmallGap:["数字よりもその間隔が短いところがあります。","The gap of the same kind of number is smaller than the number."]}});
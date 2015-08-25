/*! @license pzpr.js v3.5.2-pre (c) 2009-2015 sabo2, MIT license
 *   https://bitbucket.org/sabo2/pzprv3 */
pzpr.classmgr.makeCustom(["numlin"],{MouseEvent:{mouseinput:function(){this.owner.playmode?this.btn.Left?this.mousestart||this.mousemove?this.inputLine():this.mouseend&&this.notInputted()&&this.inputpeke():this.btn.Right&&(this.mousestart||this.mousemove)&&this.inputpeke():this.owner.editmode&&this.mousestart&&this.inputqnum()}},KeyEvent:{enablemake:!0},Board:{hasborder:1},LineManager:{isCenterLine:!0},AreaLineManager:{enabled:!0},Flags:{redline:!0},Graphic:{gridcolor_type:"LIGHT",paint:function(){this.drawBGCells(),this.drawGrid(),this.drawPekes(),this.drawLines(),this.drawCellSquare(),this.drawNumbers(),this.drawChassis(),this.drawTarget()},drawCellSquare:function(){for(var a=this.vinc("cell_number_base","crispEdges",!0),b=.7*this.bw-1,c=.7*this.bh-1,d=this.range.cells,e=0;e<d.length;e++){var f=d[e];a.vid="c_sq_"+f.id,-1!==f.qnum?(a.fillStyle=1===f.error?this.errbcolor1:"white",a.fillRectCenter(f.bx*this.bw,f.by*this.bh,b,c)):a.vhide()}}},Encode:{decodePzpr:function(){this.decodeNumber16()},encodePzpr:function(){this.encodeNumber16()},decodeKanpen:function(){this.owner.fio.decodeCellQnum_kanpen()},encodeKanpen:function(){this.owner.fio.encodeCellQnum_kanpen()}},FileIO:{decodeData:function(){this.decodeCellQnum(),this.decodeBorderLine()},encodeData:function(){this.encodeCellQnum(),this.encodeBorderLine()},kanpenOpen:function(){this.decodeCellQnum_kanpen(),this.decodeBorderLine()},kanpenSave:function(){this.encodeCellQnum_kanpen(),this.encodeBorderLine()}},AnsCheck:{checklist:["checkBranchLine","checkCrossLine","checkTripleObject","checkLinkSameNumber","checkLineOverLetter","checkDeadendConnectLine+","checkDisconnectLine","checkNoLineObject+"],checkLinkSameNumber:function(){this.checkSameObjectInRoom(this.getLareaInfo(),function(a){return a.getNum()},"nmConnDiff")}},FailCode:{nmConnDiff:["異なる数字がつながっています。","Different numbers are connected."]}});
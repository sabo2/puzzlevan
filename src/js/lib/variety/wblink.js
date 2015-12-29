/*! @license pzpr.js v3.5.2 (c) 2009-2015 sabo2, MIT license
 *   https://bitbucket.org/sabo2/pzprv3 */
pzpr.classmgr.makeCustom(["wblink"],{MouseEvent:{mouseinput:function(){this.owner.playmode?this.btn.Left?this.mousestart||this.mousemove?this.inputLine():this.mouseend&&this.notInputted()&&this.inputpeke():this.btn.Right&&(this.mousestart||this.mousemove)&&this.inputpeke():this.owner.editmode&&this.mousestart&&this.inputqnum()},inputLine:function(){var a=this.getpos(.1);if(!this.prevPos.equals(a)){var b=this.getlineobj(this.prevPos,a);if(!b.isnull){var c=b.getlinesize(),d=this.owner.board.borderinside(c.x1,c.y1,c.x2,c.y2);null===this.inputData&&(this.inputData=b.isLine()?0:1),1===this.inputData?d.setLine():0===this.inputData&&d.removeLine(),this.inputData=2,this.owner.painter.paintRange(c.x1-1,c.y1-1,c.x2+1,c.y2+1)}this.prevPos=a}},getlineobj:function(a,b){return 1===(1&b.bx)&&a.bx===b.bx&&1===Math.abs(a.by-b.by)||1===(1&b.by)&&a.by===b.by&&1===Math.abs(a.bx-b.bx)?(a.onborder()?a:b).getb():this.owner.board.nullobj},inputpeke:function(){var a=this.getpos(.22);if(!this.btn.Right||!this.prevPos.equals(a)){var b=a.getb();if(!b.isnull){null===this.inputData&&(this.inputData=2!==b.qsub?2:0),b.setQsub(this.inputData);var c=b.getlinesize();this.owner.board.borderinside(c.x1,c.y1,c.x2,c.y2).setLineVal(0),this.prevPos=a,this.owner.painter.paintRange(c.x1-1,c.y1-1,c.x2+1,c.y2+1),b.draw()}}}},KeyEvent:{enablemake:!0,keyinput:function(a){this.key_inputcircle(a)},key_inputcircle:function(a){var b=this.cursor.getc();if("1"===a)b.setQnum(1!==b.qnum?1:-1);else if("2"===a)b.setQnum(2!==b.qnum?2:-1);else if("-"===a)b.setQnum(-2!==b.qnum?-2:-1);else{if("3"!==a&&" "!==a)return;b.setQnum(-1)}b.draw()}},Cell:{numberAsObject:!0,maxnum:2},Border:{getlinesize:function(){var a=this.getaddr(),b=a.clone();if(this.isVert()){for(;a.move(-1,0).getc().noNum();)a.move(-1,0);for(;b.move(1,0).getc().noNum();)b.move(1,0)}else{for(;a.move(0,-1).getc().noNum();)a.move(0,-1);for(;b.move(0,1).getc().noNum();)b.move(0,1)}return a.getc().isnull||b.getc().isnull?{x1:-1,y1:-1,x2:-1,y2:-1}:{x1:a.bx,y1:a.by,x2:b.bx,y2:b.by}}},BorderList:{setLine:function(){this.each(function(a){a.setLine()})},removeLine:function(){this.each(function(a){a.removeLine()})},setLineVal:function(a){this.each(function(b){b.setLineVal(a)})}},Board:{qcols:8,qrows:8,hasborder:1},LineManager:{isCenterLine:!0},AreaLineManager:{enabled:!0},Graphic:{gridcolor_type:"THIN",circlefillcolor_func:"qnum2",circlestrokecolor_func:"qnum2",circleratio:[.35,.3],lwratio:8,paint:function(){this.drawBGCells(),this.drawGrid(!1,this.owner.editmode&&!this.outputImage),this.drawPekes(),this.drawLines(),this.drawCircles(),this.drawHatenas(),this.drawTarget()}},Encode:{decodePzpr:function(){this.decodeCircle()},encodePzpr:function(){this.encodeCircle()}},FileIO:{decodeData:function(){this.decodeCellQnum(),this.decodeBorderLine()},encodeData:function(){this.encodeCellQnum(),this.encodeBorderLine()}},AnsCheck:{checklist:["checkCrossLine","checkTripleObject","checkUnshadedCircle","checkShadedCircle","checkNoLineObject+"],checkUnshadedCircle:function(){this.checkWBcircle(1,"lcInvWhite")},checkShadedCircle:function(){this.checkWBcircle(2,"lcInvBlack")},checkWBcircle:function(a,b){for(var c=!0,d=this.getLareaInfo(),e=1;e<=d.max;e++){var f=d.area[e].clist;if(!(f.length<=1)){var g=f[0],h=f[f.length-1];if(g.qnum===a&&h.qnum===a){if(c=!1,this.checkOnly)break;d.setErrLareaById(e,1),g.seterr(1),h.seterr(1)}}}c||(this.failcode.add(b),this.owner.board.border.setnoerr())}},FailCode:{lcTripleNum:["3つ以上の○が繋がっています。","Three or more objects are connected."],lcInvWhite:["白丸同士が繋がっています。","Two white circles are connected."],lcInvBlack:["黒丸同士が繋がっています。","Two black circles are connected."],nmNoLine:["○から線が出ていません。","A circle doesn't start any line."]}});
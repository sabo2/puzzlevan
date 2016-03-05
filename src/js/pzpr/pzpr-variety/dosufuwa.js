/*! @license pzpr.js v0.3.2 (c) 2009-2016 sabo2, MIT license
 *   https://bitbucket.org/sabo2/pzprv3 */
!function(a,b){"object"==typeof module&&module.exports?module.exports=[a,b]:pzpr.classmgr.makeCustom(a,b)}(["dosufuwa"],{MouseEvent:{mouseinput:function(){this.puzzle.playmode?(this.mousestart||this.mousemove)&&this.inputcell_dosufuwa():this.puzzle.editmode&&(this.mousestart||this.mousemove?this.inputborder():this.mouseend&&this.notInputted()&&this.inputblock())},inputcell_dosufuwa:function(){var a=this.getcell();if(!a.isnull&&a!==this.mouseCell&&1!==a.ques){if(null===this.inputData)"left"===this.btn?1===a.qans?this.inputData=2:2===a.qans?this.inputData=-2:1===a.qsub?this.inputData=0:this.inputData=1:"right"===this.btn&&(1===a.qans?this.inputData=0:2===a.qans?this.inputData=1:1===a.qsub?this.inputData=2:this.inputData=-2);else if(1===this.inputData&&this.mouseCell.getdir(a,2)!==a.UP||2===this.inputData&&this.mouseCell.getdir(a,2)!==a.DN)return;this.inputData>=0?(a.setQans(this.inputData),a.setQsub(0)):(a.setQans(0),a.setQsub(1)),a.draw(),this.mouseCell=a}},inputblock:function(){var a=this.getcell();a.isnull||(a.setQues(0===a.ques?1:0),a.setQans(0),a.setQsub(0),a.draw())}},Cell:{posthook:{qans:function(a){this.room.clist.drawCmp()}}},Border:{isBorder:function(){return this.isnull||this.ques>0||!(1!==this.sidecell[0].ques&&1!==this.sidecell[1].ques)}},CellList:{cmp:null,drawCmp:function(){for(var a=0,b=0,c=0;c<this.length;c++)1===this[c].qans?a++:2===this[c].qans&&b++;var d=1===a&&1===b;this.cmp!==d&&(this.cmp=d,this.draw())}},Board:{hasborder:1},AreaRoomGraph:{enabled:!0,isnodevalid:function(a){return 0===a.ques},setExtraData:function(a){this.common.setExtraData.call(this,a),a.clist.drawCmp()}},Graphic:{gridcolor_type:"LIGHT",autocmp:"room",cellcolor_func:"ques",dotcolor_type:"PINK",qsubcolor1:"rgb(224, 224, 255)",paint:function(){this.drawBGCells(),this.drawGrid(),this.drawShadedCells(),this.drawDotCells(!0),this.drawCircles(),this.drawBorders(),this.drawChassis()},getBGCellColor:function(a){return 1===a.error||1===a.qinfo?this.errbcolor1:this.puzzle.execConfig("autocmp")&&a.room&&a.room.clist.cmp?this.qsubcolor1:null},getCircleStrokeColor:function(a){return 1===a.qans?1===a.error?this.errcolor1:this.quescolor:null},getCircleFillColor:function(a){return 1===a.qans?1===a.error?this.errbcolor1:"white":2===a.qans?1===a.error?this.errcolor1:this.quescolor:null}},Encode:{decodePzpr:function(a){this.decodeBorder(),this.decodeBlockCell()},encodePzpr:function(a){this.encodeBorder_makaro(),this.encodeBlockCell()},decodeBlockCell:function(){var a=0,b=0,c=this.outbstr,d=this.board;for(b=0;b<c.length;b++){var e=c.charAt(b);if(this.include(e,"0","9")||this.include(e,"a","z")?(a+=parseInt(e,36),d.cell[a]&&(d.cell[a].ques=1)):"."===e&&(a+=35),a++,!d.cell[a]){b++;break}}this.outbstr=c.substr(b)},encodeBlockCell:function(){for(var a="",b=0,c=this.board,d=0;d<c.cell.length;d++){var e="";1===c.cell[d].ques?e=".":b++,e?(a+=b.toString(36),b=0):36===b&&(a+=".",b=0)}this.outbstr+=a},encodeBorder_makaro:function(){for(var a=this.board,b=[],c=0;c<a.border.length;c++)b[c]=a.border[c].ques,a.border[c].ques=a.border[c].isBorder()?1:0;this.encodeBorder();for(var c=0;c<a.border.length;c++)a.border[c].ques=b[c]}},FileIO:{decodeData:function(){this.decodeAreaRoom(),this.decodeCellQanssub()},encodeData:function(){this.encodeAreaRoom(),this.encodeCellQanssub()},decodeAreaRoom_com:function(a){var b=this.board;this.readLine();var c=this.getItemList(b.rows);this.rdata2Border(a,c);for(var d=0;d<b.cell.length;d++)"#"===c[d]&&(b.cell[d].ques=1);b.roommgr.rebuild()},encodeAreaRoom_com:function(a){var b=this.board;b.roommgr.rebuild();var c=b.roommgr.components;this.datastr+=c.length+"\n";for(var d=0;d<b.cell.length;d++){var e=c.indexOf(b.cell[d].room);this.datastr+=""+(e>=0?e:"#")+" ",(d+1)%b.cols===0&&(this.datastr+="\n")}}},AnsCheck:{checklist:["checkOverUnshadeCircle","checkOverShadeCircle","checkBalloonIsTop","checkIronBallIsBottom","checkNoUnshadeCircle+","checkNoShadeCircle+"],checkOverUnshadeCircle:function(){this.checkAllBlock(this.board.roommgr,function(a){return 1===a.qans},function(a,b,c,d){return 1>=c},"bkUCGe2")},checkOverShadeCircle:function(){this.checkAllBlock(this.board.roommgr,function(a){return 2===a.qans},function(a,b,c,d){return 1>=c},"bkSCGe2")},checkNoUnshadeCircle:function(){this.checkAllBlock(this.board.roommgr,function(a){return 1===a.qans},function(a,b,c,d){return c>=1},"bkNoUC")},checkNoShadeCircle:function(){this.checkAllBlock(this.board.roommgr,function(a){return 2===a.qans},function(a,b,c,d){return c>=1},"bkNoSC")},checkBalloonIsTop:function(){this.checkAllCell(function(a){var b=a.adjacent.top;return 1===a.qans&&!b.isnull&&1!==b.ques&&1!==b.qans},"cuNotTop")},checkIronBallIsBottom:function(){this.checkAllCell(function(a){var b=a.adjacent.bottom;return 2===a.qans&&!b.isnull&&1!==b.ques&&2!==b.qans},"csNotBottom")}},FailCode:{bkUCGe2:["1つの領域に風船が複数入っています。","An area has two or more balloons."],bkSCGe2:["1つの領域に鉄球が複数入っています。","An area has two or more iron balls."],bkNoUC:["風船が入っていない領域があります。","An area has no balloon."],bkNoSC:["鉄球が入っていない領域があります。","An area has no iron ball."],cuNotTop:["風船の上に風船や黒マスがありません。","A balloon is not on the top of the row or under another balloon."],csNotBottom:["鉄球の下の鉄球や黒マスがありません。","An iron ball is not on the bottom of the row or on another iron ball."]}});
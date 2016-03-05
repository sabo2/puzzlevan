/*! @license pzpr.js v0.3.2 (c) 2009-2016 sabo2, MIT license
 *   https://bitbucket.org/sabo2/pzprv3 */
!function(a,b){"object"==typeof module&&module.exports?module.exports=[a,b]:pzpr.classmgr.makeCustom(a,b)}(["juosan"],{MouseEvent:{mouseinput:function(){this.puzzle.playmode?this.mousestart||this.mousemove?this.inputTateyoko():this.mouseend&&this.notInputted()&&this.clickTateyoko():this.puzzle.editmode&&(this.mousestart||this.mousemove?this.inputborder():this.mouseend&&this.notInputted()&&this.inputqnum())},clickTateyoko:function(){var a=this.getcell();a.isnull||(a.setQans(("left"===this.btn?{0:12,12:13,13:0}:{0:13,12:0,13:12})[a.qans]),a.draw())}},KeyEvent:{enablemake:!0},Cell:{maxnum:function(){return Math.min(255,this.room.clist.length)}},Board:{hasborder:1,disable_subclear:!0},BoardExec:{adjustBoardData:function(a,b){if(a&this.TURN)for(var c={0:0,12:13,13:12},d=this.board.cellinside(b.x1,b.y1,b.x2,b.y2),e=0;e<d.length;e++){var f=d[e];f.setQans(c[f.qans])}}},AreaRoomGraph:{enabled:!0,hastop:!0},Graphic:{gridcolor_type:"LIGHT",linecolor_type:"LIGHT",errbcolor1_type:"DARK",numbercolor_func:"fixed",paint:function(){this.drawBGCells(),this.drawDashedGrid(),this.drawTateyokos(),this.drawNumbers_juosan(),this.drawMBs(),this.drawBorders(),this.drawChassis(),this.drawTarget()},drawNumbers_juosan:function(){var a=this.vinc("cell_number","auto");a.fillStyle=this.fontcolor;for(var b=this.range.cells,c=0;c<b.length;c++){var d=b[c],e=d.qnum>0?""+d.qnum:-2===d.qnum?"?":"";if(a.vid="cell_text_"+d.id,e){var f={ratio:[.45],position:this.TOPLEFT};this.disptext(e,d.bx*this.bw,d.by*this.bh,f)}else a.vhide()}}},Encode:{decodePzpr:function(a){this.decodeBorder(),this.decodeRoomNumber16()},encodePzpr:function(a){this.encodeBorder(),this.encodeRoomNumber16()}},FileIO:{decodeData:function(){this.decodeAreaRoom(),this.decodeCellQnum(),this.decodeCellBar()},encodeData:function(){this.encodeAreaRoom(),this.encodeCellQnum(),this.encodeCellBar()},decodeCellBar:function(){this.decodeCell(function(a,b){"1"===b?a.qans=12:"2"===b&&(a.qans=13)})},encodeCellBar:function(){this.encodeCell(function(a){if(1!==a.ques){if(0===a.qans)return"0 ";if(12===a.qans)return"1 ";if(13===a.qans)return"2 "}return". "})}},AnsCheck:{checklist:["checkParallelBarCount","checkMajorityBarOver","checkMajorityBarLack","checkEmptyCell_juosan+"],checkParallelBarCount:function(){this.checkRowsColsSeparate(this.isParallelCount,function(a){return a.qans},"baParaGe3")},checkRowsColsSeparate:function(a,b,c){var d,e=!0,f=this.board;a:do{d={isvert:!1};for(var g=1;g<=f.maxby;g+=2)for(var h=1;h<=f.maxbx;h+=2){for(var i=b(f.getc(h,g)),j=h;j+2<f.maxbx&&b(f.getc(j+2,g))===i;)j+=2;if(!a.call(this,f.cellinside(h,g,j,g),d)&&(e=!1,this.checkOnly))break a;h=j}d={isvert:!0};for(var h=1;h<=f.maxbx;h+=2)for(var g=1;g<=f.maxby;g+=2){for(var i=b(f.getc(h,g)),k=g;k+2<f.maxby&&b(f.getc(h,k+2))===i;)k+=2;if(!a.call(this,f.cellinside(h,g,h,k),d)&&(e=!1,this.checkOnly))break a;g=k}}while(0);return e||(this.failcode.add(c),this.board.cell.setnoerr()),e},isParallelCount:function(a,b){return 0===a[0].qans?!0:12===a[0].qans&&b.isvert?!0:(13!==a[0].qans||b.isvert)&&a.length>=3?(a.seterr(4),!1):!0},checkMajorityBarOver:function(){this.checkMajorityBarCount(!0,"bkMajorBarGt")},checkMajorityBarLack:function(){this.checkMajorityBarCount(!1,"bkMajorBarLt")},checkMajorityBarCount:function(a,b){for(var c=!0,d=this.board.roommgr.components,e=0;e<d.length;e++){var f=d[e];if(f.top.isValidNum()){for(var g=f.clist,h=0,i=0,j=0,k=0;k<g.length;k++)12===g[k].qans?h++:13===g[k].qans&&i++;if(j=h>i?h:i,f.top.qnum!==j&&a!==j<=f.top.qnum){if(c=!1,this.checkOnly)break;h>i?g.filter(function(a){return 12===a.qans}).seterr(4):i>h&&g.filter(function(a){return 13===a.qans}).seterr(4)}}}c||(this.failcode.add(b),this.board.cell.setnoerr())},checkEmptyCell_juosan:function(){this.checkAllCell(function(a){return 0===a.qans},"ceNoBar")}},FailCode:{ceNoBar:["何も入っていないマスがあります。","There is an empty cell."],baParaGe3:["縦棒か横棒が3マス以上並んでいます。","There are at least there vertical or horizonal bars in parallel."],bkMajorBarGt:["縦棒か横棒の多い方の数が部屋の数字より多いです。","The number of majority of vartial or horizonal bars is grater than the number of the area."],bkMajorBarLt:["縦棒か横棒の多い方の数が部屋の数字より少ないです。","The number of majority of vartial or horizonal bars is less than the number of the area."]}});
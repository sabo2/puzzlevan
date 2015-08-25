/*! @license pzpr.js v3.5.2-pre (c) 2009-2015 sabo2, MIT license
 *   https://bitbucket.org/sabo2/pzprv3 */
pzpr.classmgr.makeCustom(["tatamibari"],{MouseEvent:{mouseinput:function(){this.owner.playmode?(this.mousestart||this.mousemove)&&(this.btn.Left&&this.isBorderMode()?this.inputborder():this.inputQsubLine()):this.owner.editmode&&this.mousestart&&this.inputqnum()}},KeyEvent:{enablemake:!0,keyinput:function(a){this.key_inputMarks(a)},key_inputMarks:function(a){var b=this.cursor.getc();if("q"===a||"1"===a)b.setQnum(1);else if("w"===a||"2"===a)b.setQnum(2);else if("e"===a||"3"===a)b.setQnum(3);else if("r"===a||"4"===a)b.setQnum(-1);else if(" "===a)b.setQnum(-1);else{if("-"!==a)return;b.setQnum(-2!==b.qnum?-2:-1)}b.draw()}},Cell:{numberAsObject:!0,maxnum:3},Board:{hasborder:1},BoardExec:{adjustBoardData:function(a,b){if(a&this.TURN)for(var c={2:3,3:2},d=this.owner.board.cellinside(b.x1,b.y1,b.x2,b.y2),e=0;e<d.length;e++){var f=d[e],g=c[f.qnum];g&&f.setQnum(g)}}},AreaRoomManager:{enabled:!0},Graphic:{gridcolor_type:"DLIGHT",bordercolor_func:"qans",paint:function(){this.drawBGCells(),this.drawDashedGrid(),this.drawBorders(),this.drawMarks(),this.drawHatenas(),this.drawBorderQsubs(),this.drawChassis(),this.drawTarget()},drawMarks:function(){var a=this.vinc("cell_ques","crispEdges",!0),b=Math.max(this.cw/12,3)/2,c=.7*this.bw;a.fillStyle=this.borderQuescolor;for(var d=this.range.cells,e=0;e<d.length;e++){var f=d[e],g=f.qnum,h=f.bx*this.bw,i=f.by*this.bh;a.vid="c_lp1_"+f.id,1===g||2===g?a.fillRectCenter(h,i,b,c):a.vhide(),a.vid="c_lp2_"+f.id,1===g||3===g?a.fillRectCenter(h,i,c,b):a.vhide()}}},Encode:{decodePzpr:function(){this.decodeTatamibari()},encodePzpr:function(){this.encodeTatamibari()},decodeTatamibari:function(){for(var a=0,b=this.outbstr,c=this.owner.board,d=0;d<b.length;d++){var e=b.charAt(d),f=c.cell[a];if("."===e?f.qnum=-2:"1"===e?f.qnum=2:"2"===e?f.qnum=3:"3"===e?f.qnum=1:e>="g"&&"z">=e?a+=parseInt(e,36)-16:a++,a++,a>=c.cellmax)break}this.outbstr=b.substr(d)},encodeTatamibari:function(){for(var a=0,b="",c=this.owner.board,d=0;d<c.cellmax;d++){var e="",f=c.cell[d].qnum;-2===f?e=".":1===f?e="3":2===f?e="1":3===f?e="2":a++,0===a?b+=e:(e||20===a)&&(b+=(15+a).toString(36)+e,a=0)}a>0&&(b+=(15+a).toString(36)),this.outbstr+=b}},FileIO:{decodeData:function(){this.decodeCell(function(a,b){"a"===b?a.qnum=2:"b"===b?a.qnum=3:"c"===b?a.qnum=1:"-"===b&&(a.qnum=-2)}),this.decodeBorderAns()},encodeData:function(){this.encodeCell(function(a){return-2===a.qnum?"- ":1===a.qnum?"c ":2===a.qnum?"a ":3===a.qnum?"b ":". "}),this.encodeBorderAns()}},AnsCheck:{checklist:["checkBorderCross","checkNoNumber","checkSquareTatami","checkHorizonLongTatami","checkVertLongTatami","checkDoubleNumber","checkRoomRect","checkBorderDeadend+"],checkSquareTatami:function(){this.checkAllArea(this.getRoomInfo(),function(a,b,c,d){return 1!==d||0>=c||a*b!==c||a===b},"bkNotSquare")},checkHorizonLongTatami:function(){this.checkAllArea(this.getRoomInfo(),function(a,b,c,d){return 3!==d||0>=c||a*b!==c||a>b},"bkNotHRect")},checkVertLongTatami:function(){this.checkAllArea(this.getRoomInfo(),function(a,b,c,d){return 2!==d||0>=c||a*b!==c||b>a},"bkNotVRect")}},FailCode:{bkNoNum:["記号の入っていないタタミがあります。","A tatami has no marks."],bkNumGe2:["1つのタタミに2つ以上の記号が入っています。","A tatami has plural marks."],bkNotRect:["タタミの形が長方形ではありません。","A tatami is not rectangle."],bkNotSquare:["正方形でないタタミがあります。","A tatami is not regular rectangle."],bkNotHRect:["横長ではないタタミがあります。","A tatami is not horizontally long rectangle."],bkNotVRect:["縦長ではないタタミがあります。","A tatami is not vertically long rectangle."]}});
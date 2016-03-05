/*! @license pzpr.js v0.3.2 (c) 2009-2016 sabo2, MIT license
 *   https://bitbucket.org/sabo2/pzprv3 */
!function(a,b){"object"==typeof module&&module.exports?module.exports=[a,b]:pzpr.classmgr.makeCustom(a,b)}(["hakoiri"],{MouseEvent:{mouseinput:function(){this.puzzle.playmode?"left"===this.btn?this.mousestart&&this.inputqnum():"right"===this.btn&&this.mousemove&&this.inputDot():this.puzzle.editmode&&(this.mousestart||this.mousemove)&&this.inputborder(),this.mouseend&&this.notInputted()&&this.inputqnum()},inputDot:function(){var a=this.getcell();a.isnull||a===this.mouseCell||-1!==a.qnum||(null===this.inputData&&(this.inputData=1===a.qsub?0:1),a.setAnum(-1),a.setQsub(1===this.inputData?1:0),this.mouseCell=a,a.draw())}},KeyEvent:{enablemake:!0,enableplay:!0,keyinput:function(a){this.key_hakoiri(a)},key_hakoiri:function(a){"1"===a||"q"===a||"a"===a||"z"===a?a="1":"2"===a||"w"===a||"s"===a||"x"===a?a="2":"3"===a||"e"===a||"d"===a||"c"===a?a="3":"4"===a||"r"===a||"f"===a||"v"===a?a="s1":("5"===a||"t"===a||"g"===a||"b"===a)&&(a=" "),this.key_inputqnum(a)}},Cell:{numberAsObject:!0,maxnum:3},Board:{hasborder:1},AreaNumberGraph:{enabled:!0},AreaRoomGraph:{enabled:!0},Graphic:{bcolor_type:"GREEN",dotcolor_type:"PINK",bbcolor:"rgb(127, 127, 127)",paint:function(){this.drawBGCells(),this.drawGrid(),this.drawBorders(),this.drawDotCells(!0),this.drawQnumMarks(),this.drawHatenas(),this.drawChassis(),this.drawCursor()},drawQnumMarks:function(){var a=this.vinc("cell_mark","auto");a.lineWidth=2;for(var b=.3*this.cw,c=.26*this.cw,d=this.range.cells,e=0;e<d.length;e++){var f=d[e];a.vid="c_mk_"+f.id,a.strokeStyle=this.getNumberColor(f);var g=f.bx*this.bw,h=f.by*this.bh;switch(f.getNum()){case 1:a.strokeCircle(g,h,b);break;case 2:a.beginPath(),a.setOffsetLinePath(g,h,0,-c,-b,c,b,c,!0),a.stroke();break;case 3:a.strokeRectCenter(g,h,b,b);break;default:a.vhide()}}}},Encode:{decodePzpr:function(a){this.decodeBorder(),this.decodeNumber10()},encodePzpr:function(a){this.encodeBorder(),this.encodeNumber10()}},FileIO:{decodeData:function(){this.decodeAreaRoom(),this.decodeCellQnum(),this.decodeCellAnumsub()},encodeData:function(){this.encodeAreaRoom(),this.encodeCellQnum(),this.encodeCellAnumsub()}},AnsCheck:{checklist:["checkAroundMarks","checkOverFourMarksInBox","checkDifferentNumberInRoom","checkConnectNumber","checkAllMarkInBox"],checkOverFourMarksInBox:function(){this.checkAllBlock(this.board.roommgr,function(a){return a.isNum()},function(a,b,c,d){return 3>=c},"bkNumGt3")},checkAllMarkInBox:function(){this.checkAllBlock(this.board.roommgr,function(a){return a.isNum()},function(a,b,c,d){return c>=3},"bkNumLt3")},checkAroundMarks:function(){for(var a=this.board,b=0;b<a.cell.length;b++){var c=a.cell[b],d=c.getNum();if(!(0>d)){var e=0,f=new this.klass.CellList,g=function(a){return!a.isnull&&d===a.getNum()};if(f.add(c),e=c.relcell(2,0),g(e)&&f.add(e),e=c.relcell(0,2),g(e)&&f.add(e),e=c.relcell(-2,2),g(e)&&f.add(e),e=c.relcell(2,2),g(e)&&f.add(e),!(f.length<=1)){if(this.failcode.add("nmAround"),this.checkOnly)break;f.seterr(1)}}}}},FailCode:{bkDupNum:["1つのハコに同じ記号が複数入っています。","A box has same plural marks."],bkNumGt3:["1つのハコに4つ以上の記号が入っています。","A box has four or more marks."],bkNumLt3:["1つのハコに2つ以下の記号しか入っていません。","A box has tow or less marks."],nmDivide:["タテヨコにつながっていない記号があります。","Marks are devided."],nmAround:["同じ記号がタテヨコナナメに隣接しています。","Same marks are adjacent."]}});
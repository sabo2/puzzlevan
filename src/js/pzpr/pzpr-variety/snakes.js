/*! @license pzpr.js v0.3.2 (c) 2009-2016 sabo2, MIT license
 *   https://bitbucket.org/sabo2/pzprv3 */
!function(a,b){"object"==typeof module&&module.exports?module.exports=[a,b]:pzpr.classmgr.makeCustom(a,b)}(["snakes"],{MouseEvent:{use:!0,mouseinput:function(){this.puzzle.playmode?(this.mousestart||this.mousemove)&&(this.inputDot_snakes()||this.dragnumber_snakes()):this.puzzle.editmode&&(this.mousestart||this.mousemove&&this.notInputted())&&this.inputdirec(),this.mouseend&&this.notInputted()&&this.inputqnum_snakes()},dragnumber_snakes:function(){var a=this.getcell();a.isnull||a===this.mouseCell||(this.mouseCell.isnull?(this.inputData=-1!==a.anum?a.anum:10,this.mouseCell=a):-1===a.qnum&&this.inputData>=1&&this.inputData<=5?("left"===this.btn?this.inputData++:"right"===this.btn&&this.inputData--,this.inputData>=1&&this.inputData<=5&&(a.setQdir(0),a.setAnum(this.inputData),a.setQsub(0),this.mouseCell=a,a.draw())):-1===a.qnum&&10===this.inputData&&(a.setAnum(-1),a.setQsub(0),a.draw()))},inputDot_snakes:function(){if("right"!==this.btn||null!==this.inputData&&this.inputData>=0)return!1;var a=this.getcell();return a.isnull||a===this.mouseCell?this.inputData<0:null===this.inputData?-1===a.anum?(this.inputData=1!==a.qsub?-2:-3,!0):!1:(a.setAnum(-1),a.setQsub(-2===this.inputData?1:0),a.draw(),this.mouseCell=a,!0)},inputqnum_snakes:function(){var a=this.getcell();a.isnull||(this.mouseCell=this.board.emptycell,this.inputqnum())}},KeyEvent:{enablemake:!0,enableplay:!0,moveTarget:function(a){return a.match(/shift/)?!1:this.moveTCell(a)},keyinput:function(a){this.puzzle.editmode&&this.key_inputdirec(a)||(!this.puzzle.playmode||"q"!==a&&"-"!==a||(a="s1"),this.key_inputqnum(a))}},Cell:{maxnum:5,minnum:function(){return this.puzzle.playmode?1:0},draw:function(){this.puzzle.getConfig("snakebd")?this.puzzle.painter.paintRange(this.bx-2,this.by-2,this.bx+2,this.by+2):this.getaddr().draw()}},Board:{hasborder:1,addExtraInfo:function(){this.snakemgr=this.addInfoList(this.klass.AreaSnakeGraph)}},BoardExec:{adjustBoardData:function(a,b){this.adjustNumberArrow(a,b)}},"AreaSnakeGraph:AreaGraphBase":{enabled:!0,setComponentRefs:function(a,b){a.snake=b},getObjNodeList:function(a){return a.snakenodes},resetObjNodeList:function(a){a.snakenodes=[]},isnodevalid:function(a){return a.anum>0},isedgevalidbynodeobj:function(a,b){return-1===a.anum==(-1===b.anum)&&1===Math.abs(a.anum-b.anum)}},Graphic:{hideHatena:!0,gridcolor_type:"LIGHT",dotcolor_type:"PINK",cellcolor_func:"qnum",fontcolor:"white",numbercolor_func:"fixed",paint:function(){this.drawBGCells(),this.drawDotCells(!0),this.drawDashedGrid(),this.drawBorders(),this.drawShadedCells(),this.drawArrowNumbers(),this.drawAnswerNumbers(),this.drawChassis(),this.drawCursor()},getBorderColor:function(a){if(!this.puzzle.getConfig("snakebd"))return!1;var b=a.sidecell[0],c=a.sidecell[1];return b.isnull||c.isnull||-1!==b.qnum||-1!==c.qnum||-1===b.anum&&-1===c.anum||-1===b.anum==(-1===c.anum)&&1===Math.abs(b.anum-c.anum)?null:this.borderQanscolor},drawAnswerNumbers:function(){var a=this.vinc("cell_anumber","auto");a.fillStyle=this.fontAnscolor;for(var b=this.range.cells,c=0;c<b.length;c++){var d=b[c],e=-1===d.qnum&&d.anum>0?""+d.anum:"";a.vid="cell_ansnum_"+d.id,e?this.disptext(e,d.bx*this.bw,d.by*this.bh):a.vhide()}}},Encode:{decodePzpr:function(a){this.decodeArrowNumber16()},encodePzpr:function(a){this.encodeArrowNumber16()}},FileIO:{decodeData:function(){this.decodeCellDirecQnum(),this.decodeCellAnumsub()},encodeData:function(){this.encodeCellDirecQnum(),this.encodeCellAnumsub()}},AnsCheck:{checklist:["checkNumberExist","checkSnakeSize","checkOtherAnsNumberInRoom","checkSideCell_snakes","checkArrowNumber","checkSnakesView"],checkNumberExist:function(){if(!this.puzzle.execConfig("allowempty")){if(this.board.cell.some(function(a){return a.isValidNum()}))return;this.failcode.add("brNoValidNum")}},checkSnakeSize:function(){this.checkAllArea(this.board.snakemgr,function(a,b,c,d){return 5===c},"bkSizeNe5")},checkOtherAnsNumberInRoom:function(){this.checkDifferentNumberInRoom_main(this.board.snakemgr,this.isDifferentAnsNumberInClist)},checkSideCell_snakes:function(){function a(a,b){var c=a.snake,d=b.snake;return null!==c&&null!==d&&c!==d}for(var b=!0,c=this.board,d=0;d<c.cell.length;d++){var e=c.cell[d],f=e.adjacent.right;if(!f.isnull&&a(e,f)){if(b=!1,this.checkOnly)break;e.snake.clist.seterr(1),f.snake.clist.seterr(1)}if(f=e.adjacent.bottom,!f.isnull&&a(e,f)){if(b=!1,this.checkOnly)break;e.snake.clist.seterr(1),f.snake.clist.seterr(1)}}b||this.failcode.add("bsSnake")},checkArrowNumber:function(){function a(){return i=j.getc(),!i.isnull&&-1===i.qnum&&-1===i.anum}function b(a){return a.isnull||-1!==a.qnum||-1===a.anum}for(var c=!0,d=this.board,e=0;e<d.cell.length;e++){var f=d.cell[e],g=f.qnum,h=f.qdir;if(!(0>g||0===h)){var i,j=f.getaddr();for(j.movedir(h,2);a();)j.movedir(h,2);if(0!==g||b(i)){if(g>0&&(b(i)||i.anum!==g)){if(c=!1,this.checkOnly)break;f.seterr(1),i.seterr(1)}}else{if(c=!1,this.checkOnly)break;f.seterr(1),0>=g&&i.seterr(1)}}}c||this.failcode.add("anNumberNe")},checkSnakesView:function(){for(var a=this.board.snakemgr.components,b=0;b<a.length;b++){var c=a[b].clist,d=c.filter(function(a){return 1===a.anum})[0];if(d){var e,f=d.NDIR,g=d.adjacent;if(e=g.bottom,e.isnull||2!==e.anum||(f=d.UP),e=g.top,e.isnull||2!==e.anum||(f=d.DN),e=g.right,e.isnull||2!==e.anum||(f=d.LT),e=g.left,e.isnull||2!==e.anum||(f=d.RT),f!==d.NDIR){var h=d.getaddr(),i=new this.klass.CellList;for(i.add(d);!d.isnull&&(h.movedir(f,2),d=h.getc(),d.isnull||i.add(d),!d.isnull&&-1===d.qnum&&-1===d.anum););if(!(d.isnull||d.anum<=0||-1!==d.qnum||null===d.snake||d.snake===a[b])){if(this.failcode.add("snakeAttack"),this.checkOnly)break;i.seterr(1),c.seterr(1),d.snake.clist.seterr(1)}}}}}},FailCode:{brNoValidNum:["盤面に数字がありません。","There are no numbers on the board."],bkDupNum:["同じ数字が入っています。","A Snake has same plural marks."],bkSizeNe5:["大きさが５ではない蛇がいます。","The size of a snake is not five."],bsSnake:["別々の蛇が接しています。","Other snakes are adjacent."],anNumberNe:["矢印の先にある数字が正しくありません。","There is a wrong number which is in front of the arrowed number."],snakeAttack:["蛇の視線の先に別の蛇がいます。","A snake can see another snake."]}});
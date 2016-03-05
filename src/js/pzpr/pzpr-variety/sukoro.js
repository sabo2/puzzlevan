/*! @license pzpr.js v0.3.2 (c) 2009-2016 sabo2, MIT license
 *   https://bitbucket.org/sabo2/pzprv3 */
!function(a,b){"object"==typeof module&&module.exports?module.exports=[a,b]:pzpr.classmgr.makeCustom(a,b)}(["sukoro","view","sukororoom"],{"MouseEvent@sukoro,view":{mouseinput:function(){this.mousestart&&this.inputqnum()}},"MouseEvent@sukororoom":{mouseinput:function(){this.puzzle.playmode?this.mousestart&&this.inputqnum():this.puzzle.editmode&&(this.mousestart||this.mousemove&&"left"===this.btn?this.inputborder():this.mouseend&&this.notInputted()&&this.inputqnum())}},KeyEvent:{enablemake:!0,enableplay:!0,keyinput:function(a){this.key_sukoro(a)},key_sukoro:function(a){if(this.puzzle.playmode){var b=this.cursor.getc();"q"===a||"a"===a||"z"===a?a=1===b.qsub?"1":"s1":"w"===a||"s"===a||"x"===a?a=2===b.qsub?"2":"s2":"e"===a||"d"===a||"c"===a||"-"===a?a=" ":"1"===a&&1===b.anum?a="s1":"2"===a&&2===b.anum&&(a="s2")}this.key_inputqnum(a)}},Cell:{numberWithMB:!0,maxnum:4,getViewClist:function(){for(var a=this.bx,b=this.by,c=new this.klass.CellList,d=1;4>=d;d++)for(var e=new this.klass.Address(a,b);;){e.movedir(d,2);var f=e.getc();if(f.isnull||!f.noNum()||1===f.qsub)break;c.add(f)}return c}},"Cell@view":{maxnum:function(){return Math.min(255,this.board.cols+this.board.rows-2)},minnum:0},"Board@view":{cols:8,rows:8},"Board@sukororoom":{cols:8,rows:8,hasborder:1},AreaNumberGraph:{enabled:!0},"AreaRoomGraph@sukororoom":{enabled:!0},Graphic:{paint:function(){this.drawBGCells(),this.drawGrid(),"sukororoom"===this.pid&&this.drawBorders(),this.drawMBs(),this.drawNumbers(),this.drawChassis(),this.drawCursor()}},"Graphic@view":{bgcellcolor_func:"error2",errbcolor2:"rgb(255, 255, 127)"},"Encode@sukoro":{decodePzpr:function(a){this.decodeNumber10()},encodePzpr:function(a){this.encodeNumber10()}},"Encode@view":{decodePzpr:function(a){this.decodeNumber16()},encodePzpr:function(a){this.encodeNumber16()}},"Encode@sukororoom":{decodePzpr:function(a){this.decodeBorder(),this.decodeNumber10()},encodePzpr:function(a){this.encodeBorder(),this.encodeNumber10()}},FileIO:{decodeData:function(){"sukororoom"===this.pid&&this.decodeBorderQues(),this.decodeCellQnum(),this.decodeCellAnumsub()},encodeData:function(){"sukororoom"===this.pid&&this.encodeBorderQues(),this.encodeCellQnum(),this.encodeCellAnumsub()}},AnsCheck:{checklist:["checkNumberExist","checkAdjacentDiffNumber@!sukororoom","checkDifferentNumberInRoom@sukororoom","checkNoMixedRoom@sukororoom","checkDir4NumberCount@!view","checkViewOfNumber@view","checkConnectNumber","checkNoSuspendCell"],checkNumberExist:function(){if(!this.puzzle.execConfig("allowempty")){if(this.board.cell.some(function(a){return a.isValidNum()}))return;this.failcode.add("brNoValidNum")}},checkNoMixedRoom:function(){this.checkSameObjectInRoom(this.board.roommgr,function(a){return a.isNumberObj()?1:2},"bkMixed")},checkDir4NumberCount:function(){this.checkDir4Cell(function(a){return a.isNumberObj()},0,"nmNumberNe")},checkNoSuspendCell:function(){this.checkAllCell(function(a){return 1===a.qsub},"ceSuspend")},checkViewOfNumber:function(){for(var a=this.board.cell,b=0;b<a.length;b++){var c=a[b];if(c.isValidNum()){var d=c.getViewClist();if(c.getNum()!==d.length){if(this.failcode.add("nmSumViewNe"),this.checkOnly)break;c.seterr(1),d.seterr(2)}}}}},FailCode:{brNoValidNum:["盤面に数字がありません。","There are no numbers on the board."],bkDupNum:["1つの部屋に同じ数字が複数入っています。","A room has two or more same numbers."],bkMixed:["数字のあるなしが混在した部屋があります。","A room includes both numbered and non-numbered cells."],nmNumberNe:["数字と、その数字の上下左右に入る数字の数が一致していません。","The number of numbers placed in four adjacent cells is not equal to the number."],nmSumViewNe:["数字と、他のマスにたどり着くまでのマスの数の合計が一致していません。","Sum of four-way gaps to another number is not equal to the number."],ceSuspend:["数字の入っていないマスがあります。","There is a cell that is not filled in number."]}});
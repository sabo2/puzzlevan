/*! @license pzpr.js v0.3.2 (c) 2009-2016 sabo2, MIT license
 *   https://bitbucket.org/sabo2/pzprv3 */
!function(a,b){"object"==typeof module&&module.exports?module.exports=[a,b]:pzpr.classmgr.makeCustom(a,b)}(["nawabari","fourcells","fivecells"],{MouseEvent:{mouseinput:function(){this.puzzle.playmode?(this.mousestart||this.mousemove)&&("left"===this.btn&&this.isBorderMode()?this.inputborder():this.inputQsubLine()):this.puzzle.editmode&&this.mousestart&&this.inputqnum()}},KeyEvent:{enablemake:!0},"KeyEvent@fourcells,fivecells":{keyinput:function(a){"w"===a?this.key_inputvalid(a):this.key_inputqnum(a)},key_inputvalid:function(a){if("w"===a){var b=this.cursor.getc();b.isnull||(b.setQues(7!==b.ques?7:0),b.setNum(-1),b.drawaround())}}},Cell:{getdir4BorderCount:function(){for(var a=0,b=this.getdir4cblist(),c=0;c<b.length;c++){var d=b[c][0],e=b[c][1];(d.isnull||d.isEmpty()||e.isBorder())&&a++}return a}},"Cell@nawabari":{maxnum:4,minnum:0},"Cell@fourcells":{maxnum:3},"Cell@fivecells":{maxnum:3,minnum:0},"Border@fourcells,fivecells":{isGrid:function(){return this.sidecell[0].isValid()&&this.sidecell[1].isValid()},isBorder:function(){return this.qans>0||this.isQuesBorder()},isQuesBorder:function(){return!!(this.sidecell[0].isEmpty()^this.sidecell[1].isEmpty())}},"Board@nawabari":{hasborder:1},"Board@fourcells,fivecells":{hasborder:2,initBoardSize:function(a,b){this.common.initBoardSize.call(this,a,b);var c=a*b%("fivecells"===this.pid?5:4);c>=1&&(this.getc(this.minbx+1,this.minby+1).ques=7),c>=2&&(this.getc(this.maxbx-1,this.minby+1).ques=7),c>=3&&(this.getc(this.minbx+1,this.maxby-1).ques=7),c>=4&&(this.getc(this.maxbx-1,this.maxby-1).ques=7)}},AreaRoomGraph:{enabled:!0},Graphic:{gridcolor_type:"DLIGHT",numbercolor_func:"qnum",paint:function(){this.drawBGCells(),"nawabari"===this.pid?(this.drawDashedGrid(),this.drawBorders()):(this.drawValidDashedGrid(),this.drawQansBorders(),this.drawQuesBorders()),this.drawNumbers(),this.drawBorderQsubs(),"nawabari"===this.pid&&this.drawChassis(),this.drawTarget()}},"Graphic@nawabari":{bordercolor_func:"qans"},"Graphic@fourcells,fivecells":{getQansBorderColor:function(a){if(1===a.qans){var b=a.error;return 1===b?this.errcolor1:-1===b?this.errborderbgcolor:this.borderQanscolor}return null},getQuesBorderColor:function(a){return a.isQuesBorder()?this.quescolor:null},drawValidDashedGrid:function(){var a=this.vinc("grid_waritai","crispEdges",!0),b=this.cw/10+3,c=Math.max(this.cw/b,1),d=this.cw/(2*c);a.lineWidth=1,a.strokeStyle=this.gridcolor;for(var e=this.range.borders,f=0;f<e.length;f++){var g=e[f];if(a.vid="b_grid_wari_"+g.id,g.isGrid()){var h=g.bx*this.bw,i=g.by*this.bh;g.isVert()?a.strokeDashedLine(h,i-this.bh,h,i+this.bh,[d]):a.strokeDashedLine(h-this.bw,i,h+this.bw,i,[d])}else a.vhide()}}},Encode:{decodePzpr:function(a){this.decodeFivecells()},encodePzpr:function(a){this.encodeFivecells()},decodeFivecells:function(){var a=0,b=0,c=this.outbstr,d=this.board;for(b=0;b<c.length;b++){var e=d.cell[a],f=c.charAt(b);if(e.ques=0,"7"===f?e.ques=7:"."===f?e.qnum=-2:this.include(f,"0","9")?e.qnum=parseInt(f,10):this.include(f,"a","z")&&(a+=parseInt(f,36)-10),a++,a>=d.cell.length)break}this.outbstr=c.substr(b)},encodeFivecells:function(){for(var a="",b=0,c=this.board,d=0;d<c.cell.length;d++){var e="",f=c.cell[d].qnum,g=c.cell[d].ques;7===g?e="7":-2===f?e=".":-1!==f?e=f.toString(10):b++,0===b?a+=e:(e||26===b)&&(a+=(9+b).toString(36)+e,b=0)}b>0&&(a+=(9+b).toString(36)),this.outbstr+=a}},FileIO:{decodeData:function(){this.decodeCell(function(a,b){a.ques=0,"*"===b?a.ques=7:"-"===b?a.qnum=-2:"."!==b&&(a.qnum=+b)}),this.decodeBorderAns()},encodeData:function(){"fourcells"===this.pid&&(this.filever=1),this.encodeCell(function(a){return 7===a.ques?"* ":-2===a.qnum?"- ":a.qnum>=0?a.qnum+" ":". "}),this.encodeBorderAns()}},AnsCheck:{checklist:["checkRoomRect@nawabari","checkNoNumber@nawabari","checkDoubleNumber@nawabari","checkOverFourCells@fourcells","checkOverFiveCells@fivecells","checkdir4BorderAns","checkBorderDeadend+","checkLessFourCells@fourcells","checkLessFiveCells@fivecells"],checkOverFourCells:function(){this.checkAllArea(this.board.roommgr,function(a,b,c,d){return c>=4},"bkSizeLt4")},checkLessFourCells:function(){this.checkAllArea(this.board.roommgr,function(a,b,c,d){return 4>=c},"bkSizeGt4")},checkOverFiveCells:function(){this.checkAllArea(this.board.roommgr,function(a,b,c,d){return c>=5},"bkSizeLt5")},checkLessFiveCells:function(){this.checkAllArea(this.board.roommgr,function(a,b,c,d){return 5>=c},"bkSizeGt5")},checkdir4BorderAns:function(){this.checkAllCell(function(a){return a.isValidNum()&&a.getdir4BorderCount()!==a.qnum},"nmBorderNe")}},FailCode:{nmBorderNe:["数字の周りにある境界線の本数が違います。","The number is not equal to the number of border lines around it."],bkNoNum:["数字の入っていない部屋があります。","A room has no numbers."],bkNumGe2:["1つの部屋に2つ以上の数字が入っています。","A room has plural numbers."],bkSizeLt4:["サイズが4マスより小さいブロックがあります。","The size of block is smaller than four."],bkSizeLt5:["サイズが5マスより小さいブロックがあります。","The size of block is smaller than five."],bkSizeGt4:["サイズが4マスより大きいブロックがあります。","The size of block is larger than four."],bkSizeGt5:["サイズが5マスより大きいブロックがあります。","The size of block is larger than five."]}});
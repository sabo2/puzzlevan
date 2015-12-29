/*! @license pzpr.js v3.5.2 (c) 2009-2015 sabo2, MIT license
 *   https://bitbucket.org/sabo2/pzprv3 */
pzpr.classmgr.makeCustom(["nurimaze"],{MouseEvent:{mouseinput:function(){this.owner.playmode?(this.mousestart||this.mousemove)&&this.inputtile_nurimaze():this.owner.editmode&&(this.mousestart||this.mousemove?this.inputEdit():this.mouseend&&this.inputEdit_end())},inputtile_nurimaze:function(){var a=this.getcell();if(!a.isnull&&a!==this.mouseCell){null===this.inputData&&this.decIC(a);var b=this.owner.board,c=b.rooms.getClistByCell(a);if(1===this.inputData)for(var d=0;d<c.length;d++)if(0!==c[d].ques||b.startpos.equals(c[d])||b.goalpos.equals(c[d])){if(this.mousestart){this.inputData=1!==a.qsub?2:0;break}return}this.mouseCell=a;for(var d=0;d<c.length;d++){var e=c[d];(1===this.inputData?e.setShade:e.clrShade).call(e),e.setQsub(2===this.inputData?1:0)}c.draw()}},inputEdit:function(){var a=this.getcell();a.isnull||(null===this.inputData&&this.inputEdit_first(),10===this.inputData?this.owner.board.startpos.input(a):11===this.inputData?this.owner.board.goalpos.input(a):null!==this.inputData&&this.inputborder())},inputEdit_first:function(){var a=this.getpos(.33),b=this.owner.board;b.startpos.equals(a)?this.inputData=10:b.goalpos.equals(a)?this.inputData=11:this.inputborder()},inputEdit_end:function(){var a=this.getcell();a.isnull||(10===this.inputData||11===this.inputData?(this.inputData=null,a.draw()):this.notInputted()&&(a!==this.cursor.getc()?this.setcursor(a):this.inputQuesMark(a)))},inputQuesMark:function(a){var b=this.owner.board,c=-1;this.btn.Left?c={0:41,41:42,42:0}[a.ques]:this.btn.Right&&(c={0:42,42:41,41:0}[a.ques]),(0===c||!b.startpos.equals(a)&&!b.goalpos.equals(a))&&(a.setQues(c),a.draw())}},KeyEvent:{enablemake:!0,keyinput:function(a){this.keydown&&this.owner.editmode&&this.key_inputqnum_nurimaze(a)},key_inputqnum_nurimaze:function(a){var b=this.cursor.getc(),c=this.owner.board,d=b.ques,e=-1;"1"===a||"q"===a?e=41!==d?41:0:"2"===a||"w"===a?e=42!==d?42:0:"3"===a||"e"===a||" "===a||"BS"===a?e=0:"s"===a?c.startpos.input(b):"g"===a&&c.goalpos.input(b),e===d||0!==e&&(c.startpos.equals(b)||c.goalpos.equals(b))||(b.setQues(e),b.draw())}},Board:{hasborder:1,startpos:null,goalpos:null,initialize:function(){this.common.initialize.call(this);var a=this.owner;this.startpos=new a.StartAddress(1,1),this.goalpos=new a.GoalAddress(2*this.qcols-1,2*this.qrows-1),this.startpos.partner=this.goalpos,this.goalpos.partner=this.startpos},initBoardSize:function(a,b){this.common.initBoardSize.call(this,a,b),this.disableInfo(),this.startpos.init(1,1),this.goalpos.init(2*this.qcols-1,2*this.qrows-1),this.enableInfo()},exchangestartgoal:function(){var a=this.startpos.getc(),b=this.goalpos.getc();this.startpos.set(b),this.goalpos.set(a),this.startpos.draw(),this.goalpos.draw()}},BoardExec:{posinfo:{},adjustBoardData:function(a,b){var c=this.owner.board;this.posinfo_start=this.getAfterPos(a,b,c.startpos.getc()),this.posinfo_goal=this.getAfterPos(a,b,c.goalpos.getc())},adjustBoardData2:function(a){var b,c=this.owner.board,d=this.owner.opemgr,e=this.posinfo_start,f=this.posinfo_goal;b=a&this.REDUCE&&(e.isdel||f.isdel)&&!d.undoExec&&!d.redoExec,b&&(d.forceRecord=!0),c.startpos.set(e.pos.getc()),c.goalpos.set(f.pos.getc()),b&&(d.forceRecord=!1)}},"StartGoalAddress:Address":{type:"",partner:null,init:function(a,b){return this.bx=a,this.by=b,this},input:function(a){this.partner.equals(a)?this.owner.board.exchangestartgoal():this.equals(a)?this.draw():this.set(a)},set:function(a){var b=this.getaddr();this.addOpe(a.bx,a.by),this.bx=a.bx,this.by=a.by,b.draw(),this.draw()},addOpe:function(a,b){(this.bx!==a||this.by!==b)&&this.owner.opemgr.add(new this.owner.StartGoalOperation(this.type,this.bx,this.by,a,b))}},"StartAddress:StartGoalAddress":{type:"start"},"GoalAddress:StartGoalAddress":{type:"goal"},"StartGoalOperation:Operation":{setData:function(a,b,c,d){this.bx1=a,this.by1=b,this.bx2=c,this.by2=d},decode:function(a){return"PS"!==a[0]&&"PG"!==a[0]?!1:(this.property="PS"===a[0]?"start":"goal",this.bx1=+a[1],this.by1=+a[2],this.bx2=+a[3],this.by2=+a[4],!0)},toString:function(){return["start"===this.property?"PS":"PG",this.bx1,this.by1,this.bx2,this.by2].join(",")},isModify:function(a){return this.manager.changeflag&&a.bx2===this.bx1&&a.by2===this.by1&&a.property===this.property?(a.bx2=this.bx2,a.by2=this.by2,!0):!1},undo:function(){this.exec(this.bx1,this.by1)},redo:function(){this.exec(this.bx2,this.by2)},exec:function(a,b){var c=this.owner.board,d=c.getc(a,b);"start"===this.property?c.startpos.set(d):"goal"===this.property&&c.goalpos.set(d)}},OperationManager:{initialize:function(){this.common.initialize.call(this),this.operationlist.push(this.owner.StartGoalOperation)}},AreaUnshadeManager:{enabled:!0},AreaRoomManager:{enabled:!0},Flags:{use:!0},Graphic:{bgcellcolor_func:"qans1",errbcolor2:"rgb(192, 192, 255)",bcolor_type:"GREEN",bbcolor:"rgb(127, 127, 127)",paint:function(){this.drawBGCells(),this.drawGrid(),this.drawShadedCells(),this.drawQuesMarks(),this.drawStartGoal(),this.drawBorders(),this.drawChassis(),this.drawBoxBorders(!0),this.drawTarget()},drawStartGoal:function(){var a=this.vinc("cell_sg","auto"),b=this.owner.board,c=this.range;a.vid="text_stpos";var d=b.startpos.getc();d.bx>=c.x1&&c.x2>=d.bx&&d.by>=c.y1&&c.y2>=d.by&&(d.isnull?a.vhide():(a.fillStyle=10===this.owner.mouse.inputData?"red":1===d.qans?this.fontShadecolor:this.quescolor,this.disptext("S",d.bx*this.bw,d.by*this.bh))),a.vid="text_glpos",d=b.goalpos.getc(),d.bx>=c.x1&&c.x2>=d.bx&&d.by>=c.y1&&c.y2>=d.by&&(d.isnull?a.vhide():(a.fillStyle=11===this.owner.mouse.inputData?"red":1===d.qans?this.fontShadecolor:this.quescolor,this.disptext("G",d.bx*this.bw,d.by*this.bh)))},drawQuesMarks:function(){var a=this.vinc("cell_mark","auto",!0),b=.3*this.cw,c=.26*this.cw;a.lineWidth=2;for(var d=this.range.cells,e=0;e<d.length;e++){var f=d[e],g=f.ques,h=f.bx*this.bw,i=f.by*this.bh;a.strokeStyle=this.getCellNumberColor(f),a.vid="c_mk1_"+f.id,41===g?a.strokeCircle(h,i,b):a.vhide(),a.vid="c_mk2_"+f.id,42===g?(a.beginPath(),a.setOffsetLinePath(h,i,0,-c,-b,c,b,c,!0),a.stroke()):a.vhide()}}},Encode:{decodePzpr:function(){this.decodeBorder(),this.decodeCell_nurimaze()},encodePzpr:function(){this.encodeBorder(),this.encodeCell_nurimaze()},decodeCell_nurimaze:function(){var a=0,b=0,c=this.outbstr,d=this.owner.board;for(b=0;b<c.length;b++){var e=c.charAt(b),f=d.cell[a];if("1"===e?d.startpos.set(f):"2"===e?d.goalpos.set(f):"3"===e?f.ques=41:"4"===e?f.ques=42:(this.include(e,"5","9")||this.include(e,"a","z"))&&(a+=parseInt(e,36)-5),a++,a>=d.cellmax)break}this.outbstr=c.substr(b+1)},encodeCell_nurimaze:function(){for(var a="",b=0,c=this.owner.board,d=0;d<c.cellmax;d++){var e="",f=c.cell[d];c.startpos.equals(f)?e="1":c.goalpos.equals(f)?e="2":41===f.ques?e="3":42===f.ques?e="4":b++,0===b?a+=e:(e||31===b)&&(a+=(4+b).toString(36)+e,b=0)}b>0&&(a+=(4+b).toString(36)),this.outbstr+=a}},FileIO:{decodeData:function(){this.decodeAreaRoom(),this.decodeCellQues_nurimaze(),this.decodeCellAns()},encodeData:function(){this.encodeAreaRoom(),this.encodeCellQues_nurimaze(),this.encodeCellAns()},decodeCellQues_nurimaze:function(){var a=this.owner.board;this.decodeCell(function(b,c){"s"===c?a.startpos.set(b):"g"===c?a.goalpos.set(b):"o"===c?b.ques=41:"t"===c&&(b.ques=42)})},encodeCellQues_nurimaze:function(){var a=this.owner.board;this.encodeCell(function(b){return a.startpos.equals(b)?"s ":a.goalpos.equals(b)?"g ":41===b.ques?"o ":42===b.ques?"t ":". "})}},AnsCheck:{checklist:["checkSameColorTile","checkShadedObject","checkConnectUnshade","check2x2ShadeCell+","check2x2UnshadeCell++","checkUnshadeLoop","checkRouteCheckPoint","checkRouteNoDeadEnd"],checkShadedObject:function(){var a=this.owner.board;this.checkAllCell(function(b){return 1===b.qans&&(0!==b.ques||a.startpos.equals(b)||a.goalpos.equals(b))},"objShaded")},check2x2UnshadeCell:function(){this.check2x2Block(function(a){return a.isUnshade()},"cu2x2")},checkUnshadeLoop:function(){for(var a={cell:[]},b=this.owner.board,c=0;c<b.cellmax;c++)a.cell[c]=b.wcell.getLinkCell(b.cell[c]);for(var d=[],c=0;c<b.cellmax;c++)d[c]=0===b.cell[c].qans?0:null;for(var c=0;c<b.cellmax;c++)0===d[c]&&this.searchloop(c,a,d);var e=b.cell.filter(function(a){return 1===d[a.id]});e.length>0&&(this.failcode.add("cuLoop"),e.seterr(1))},searchloop:function(a,b,c){for(var d=[],e=[a],f=0;f<this.owner.board.cellmax;f++)d[f]=!1;for(;e.length>0;){var f=e[e.length-1];d[f]=!0;var g=b.cell[f].length>0?b.cell[f][0]:null;if(null!==g){for(var h=0;h<b.cell[f].length;h++)b.cell[f][h]===g&&b.cell[f].splice(h,1);for(var h=0;h<b.cell[g].length;h++)b.cell[g][h]===f&&b.cell[g].splice(h,1);if(d[g]){c[g]=1;for(var h=e.length-1;h>=0&&e[h]!==g;h--)c[e[h]]=1}else e.push(g)}else{var i=e.pop();0===c[i]&&(c[i]=2)}}},checkRouteCheckPoint:function(){var a=this.getRouteInfo(),b=this.failcode.length;this.checkAllCell(function(b){return 41===b.ques&&2===a[b.id]},"routeIgnoreCP"),b===this.failcode.length||this.checkOnly||this.owner.board.cell.filter(function(b){return 1===a[b.id]}).seterr(2)},checkRouteNoDeadEnd:function(){var a=this.getRouteInfo(),b=this.failcode.length;this.checkAllCell(function(b){return 42===b.ques&&1===a[b.id]},"routePassDeadEnd"),b===this.failcode.length||this.checkOnly||this.owner.board.cell.filter(function(b){return 1===a[b.id]}).seterr(2)},getRouteInfo:function(){return this._info.maze=this._info.maze||this.searchRoute()},searchRoute:function(){for(var a={cell:[]},b=this.owner.board,c=0;c<b.cellmax;c++)a.cell[c]=b.wcell.getLinkCell(b.cell[c]);for(var d=[],c=0;c<b.cellmax;c++)d[c]=0===b.cell[c].qans?0:null;for(var e=[b.startpos.getc().id];e.length>0;){var c=e[e.length-1],f=a.cell[c].length>0?a.cell[c][0]:null;if(null!==f){for(var g=0;g<a.cell[c].length;g++)a.cell[c][g]===f&&a.cell[c].splice(g,1);for(var g=0;g<a.cell[f].length;g++)a.cell[f][g]===c&&a.cell[f].splice(g,1);if(b.goalpos.equals(b.cell[f])){d[f]=1;for(var g=e.length;g>=0;g--)d[e[g]]=1}else e.push(f)}else{var h=e.pop();0===d[h]&&(d[h]=2)}}for(var c=0;c<b.cellmax;c++)0===d[c]&&(d[c]=2);return d}},FailCode:{cu2x2:["2x2の白マスのかたまりがあります。","There is a 2x2 block of unshaded cells."],cuLoop:["白マスで輪っかができています。","There is a looped unshaded cells."],routeIgnoreCP:["○がSからGへの経路上にありません。","There is a circle out of the shortest route from S to G."],routePassDeadEnd:["△がSからGへの経路上にあります。","There is a triangle on the shortest route from S to G."],objShaded:["オブジェクトが黒マスになっています。","An object is shaded."]}});
/*! @license pzpr.js v3.5.2-pre (c) 2009-2015 sabo2, MIT license
 *   https://bitbucket.org/sabo2/pzprv3 */
pzpr.classmgr.makeCustom(["loopsp"],{MouseEvent:{mouseinput:function(){this.owner.playmode?this.btn.Left?this.mousestart||this.mousemove?this.inputLine():this.mouseend&&this.notInputted()&&this.inputpeke():this.btn.Right&&(this.mousestart||this.mousemove)&&this.inputpeke():this.owner.editmode&&this.mousestart&&this.inputLoopsp()},inputLoopsp:function(){var a=this.getcell();a.isnull||a===this.mouseCell||(a!==this.cursor.getc()?this.setcursor(a):this.inputcell_loopsp(a),this.mouseCell=a)},inputcell_loopsp:function(a){var b=a.ques,c=a.qnum;this.btn.Left?-1===c?0===b?a.setQues(11):b>=11&&16>=b?a.setQues(b+1):17===b&&(a.setQues(0),a.setQnum(-2)):-2===c?a.setQnum(1):c<a.getmaxnum()?a.setQnum(c+1):(a.setQues(0),a.setQnum(-1)):this.btn.Right&&(-1===c?0===b?(a.setQues(0),a.setQnum(-2)):11===b?(a.setQues(0),a.setQnum(-1)):b>=12&&17>=b&&a.setQues(b-1):-2===c?(a.setQues(17),a.setQnum(-1)):c>1?a.setQnum(c-1):(a.setQues(0),a.setQnum(-2))),a.draw()}},KeyEvent:{enablemake:!0,keyinput:function(a){this.key_inputLineParts(a)},key_inputLineParts:function(a){var b=this.cursor.getc();if("q"===a)b.setQues(11),b.setQnum(-1);else if("w"===a)b.setQues(12),b.setQnum(-1);else if("e"===a)b.setQues(13),b.setQnum(-1);else if("r"===a)b.setQues(0),b.setQnum(-1);else if(" "===a)b.setQues(0),b.setQnum(-1);else if("a"===a)b.setQues(14),b.setQnum(-1);else if("s"===a)b.setQues(15),b.setQnum(-1);else if("d"===a)b.setQues(16),b.setQnum(-1);else if("f"===a)b.setQues(17),b.setQnum(-1);else{if(!(a>="0"&&"9">=a||"-"===a))return;this.key_inputqnum_main(b,a)&&b.setQues(0)}this.prev=b,b.draw()}},Border:{enableLineNG:!0,enableLineCombined:!0},Board:{hasborder:1},BoardExec:{adjustBoardData:function(a,b){if(a&this.TURNFLIP){var c={};switch(a){case this.FLIPY:c={14:17,15:16,16:15,17:14};break;case this.FLIPX:c={14:15,15:14,16:17,17:16};break;case this.TURNR:c={12:13,13:12,14:17,15:14,16:15,17:16};break;case this.TURNL:c={12:13,13:12,14:15,15:16,16:17,17:14}}for(var d=this.owner.board.cellinside(b.x1,b.y1,b.x2,b.y2),e=0;e<d.length;e++){var f=d[e],g=c[f.ques];g&&f.setQues(g)}}}},LineManager:{isCenterLine:!0,isLineCross:!0},Flags:{redline:!0,irowake:!0},Graphic:{hideHatena:!0,gridcolor_type:"LIGHT",linecolor_type:"LIGHT",globalfontsizeratio:.85,circleratio:[.4,.35],minYdeg:.36,maxYdeg:.74,paint:function(){this.drawBGCells(),this.drawDashedGrid(),this.drawLines(),this.drawCircles(),this.drawNumbers(),this.drawPekes(),this.drawLineParts(),this.drawChassis(),this.drawTarget()},repaintParts:function(a){this.range.cells=a.cellinside(),this.drawCircles(),this.drawNumbers(),this.drawLineParts()}},Encode:{decodePzpr:function(){this.decodeLoopsp()},encodePzpr:function(){this.encodeLoopsp()},decodeLoopsp:function(){for(var a=0,b=this.outbstr,c=this.owner.board,d=0;d<b.length;d++){var e=b.charAt(d),f=c.cell[a];if("."===e?f.qnum=-2:"-"===e?(f.qnum=parseInt(b.substr(d+1,2),16),d+=2):e>="0"&&"9">=e?f.qnum=parseInt(e,16):e>="a"&&"f">=e?f.qnum=parseInt(e,16):e>="g"&&"m">=e?f.ques=parseInt(e,36)-5:e>="n"&&"z">=e&&(a+=parseInt(e,36)-23),a++,a>=c.cellmax)break}this.outbstr=b.substr(d+1)},encodeLoopsp:function(){for(var a="",b="",c=0,d=this.owner.board,e=0;e<d.cellmax;e++){var f=d.cell[e].qnum,g=d.cell[e].ques;-2===f?b=".":f>=0&&16>f?b=f.toString(16):f>=16&&256>f?b="-"+f.toString(16):g>=11&&17>=g?b=(g+5).toString(36):(b="",c++),0===c?a+=b:(b||13===c)&&(a+=(22+c).toString(36)+b,c=0)}c>0&&(a+=(22+c).toString(36)),this.outbstr+=a}},FileIO:{decodeData:function(){this.decodeCell(function(a,b){"o"===b?a.ques=6:"-"===b?a.ques=-2:b>="a"&&"g">=b?a.ques=parseInt(b,36)+1:"."!==b&&(a.qnum=parseInt(b))}),this.decodeBorderLine()},encodeData:function(){this.encodeCell(function(a){return 6===a.ques?"o ":a.ques>=11&&a.ques<=17?""+(a.ques-1).toString(36)+" ":-2===a.ques?"- ":-1!==a.qnum?a.qnum.toString()+" ":". "}),this.encodeBorderLine()}},AnsCheck:{checklist:["checkenableLineParts","checkBranchLine","checkCrossOnNumber","checkLoopNumber","checkNumberLoop","checkNumberInLoop","checkNotCrossOnMark","checkNoLine+","checkDeadendLine++"],checkCrossOnNumber:function(){this.checkAllCell(function(a){return 4===a.lcnt&&a.isNum()},"lnCrossOnNum")},checkLoopNumber:function(){this.checkAllLoops(function(a){for(var b=a.filter(function(a){return a.isValidNum()}),c=null,d=0;d<b.length;d++)if(null===c)c=b[d].getNum();else if(c!==b[d].getNum())return b.seterr(1),!1;return!0},"lpPlNum")},checkNumberLoop:function(){var a=this.owner.board.cell;this.checkAllLoops(function(b){var c=b.filter(function(a){return a.isValidNum()});if(0===c.length)return!0;for(var d=c[0].getNum(),e=0;e<a.length;e++){var f=a[e];if(f.getNum()===d&&!c.include(f))return c.seterr(1),!1}return!0},"lpSepNum")},checkNumberInLoop:function(){this.checkAllLoops(function(a){return a.filter(function(a){return a.isNum()}).length>0},"lpNoNum")},checkAllLoops:function(a,b){for(var c=!0,d=this.getLineInfo(),e=1;e<=d.max;e++){var f=d.path[e].blist;if(!a(f.cellinside())){if(c=!1,this.checkOnly)break;f.seterr(1)}}c||(this.failcode.add(b),this.owner.board.border.setnoerr())}},FailCode:{lnCrossOnNum:["○の部分で線が交差しています。","The lines are crossed on the number."],lpPlNum:["異なる数字を含んだループがあります。","A loop has plural kinds of number."],lpSepNum:["同じ数字が異なるループに含まれています。","A kind of numbers are in differernt loops."],lpNoNum:["○を含んでいないループがあります。","A loop has no numbers."]}});
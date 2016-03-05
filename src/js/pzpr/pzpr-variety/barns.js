/*! @license pzpr.js v0.3.2 (c) 2009-2016 sabo2, MIT license
 *   https://bitbucket.org/sabo2/pzprv3 */
!function(a,b){"object"==typeof module&&module.exports?module.exports=[a,b]:pzpr.classmgr.makeCustom(a,b)}(["barns"],{MouseEvent:{redline:!0,mouseinput:function(){this.puzzle.playmode?"left"===this.btn?this.mousestart||this.mousemove?this.inputLine():this.mouseend&&this.notInputted()&&this.inputpeke():"right"===this.btn&&(this.mousestart||this.mousemove)&&this.inputpeke():this.puzzle.editmode&&(this.mousestart||this.mousemove)&&("left"===this.btn?this.inputborder():"right"===this.btn&&this.inputIcebarn())},inputIcebarn:function(){var a=this.getcell();a.isnull||a===this.mouseCell||(null===this.inputData&&(this.inputData=a.ice()?0:6),a.setQues(this.inputData),a.draw(),this.mouseCell=a)}},Border:{enableLineNG:!0,isLineNG:function(){return 1===this.ques}},Board:{cols:8,rows:8,hasborder:1},LineGraph:{enabled:!0,isLineCross:!0},Graphic:{irowake:!0,gridcolor_type:"LIGHT",linecolor_type:"LIGHT",errbcolor1_type:"DARK",bgcellcolor_func:"icebarn",maxYdeg:.7,paint:function(){this.drawBGCells(),this.drawDashedGrid(),this.drawBorders(),this.drawLines(),this.drawPekes(),this.drawChassis()}},Encode:{decodePzpr:function(a){this.decodeBarns(),this.decodeBorder()},encodePzpr:function(a){this.encodeBarns(),this.encodeBorder()},decodeBarns:function(){for(var a=0,b=this.outbstr,c=this.board,d=[16,8,4,2,1],e=0;e<b.length;e++){for(var f=parseInt(b.charAt(e),32),g=0;5>g;g++)c.cell[a]&&(c.cell[a].ques=f&d[g]?6:0,a++);if(!c.cell[a])break}this.outbstr=b.substr(e+1)},encodeBarns:function(){for(var a="",b=0,c=0,d=this.board,e=[16,8,4,2,1],f=0;f<d.cell.length;f++)6===d.cell[f].ques&&(c+=e[b]),b++,5===b&&(a+=c.toString(32),b=0,c=0);b>0&&(a+=c.toString(32)),this.outbstr+=a}},FileIO:{decodeData:function(){this.decodeCell(function(a,b){"1"===b&&(a.ques=6)}),this.decodeBorderQues(),this.decodeBorderLine()},encodeData:function(){this.encodeCell(function(a){return 6===a.ques?"1 ":". "}),this.encodeBorderQues(),this.encodeBorderLine()}},AnsCheck:{checklist:["checkBranchLine","checkCrossOutOfIce","checkIceLines","checkOneLoop","checkNoLine","checkDeadendLine+"],checkCrossOutOfIce:function(){this.checkAllCell(function(a){return 4===a.lcnt&&!a.ice()},"lnCrossExIce")}}});
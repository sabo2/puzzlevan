/*! @license pzpr.js v0.3.2 (c) 2009-2016 sabo2, MIT license
 *   https://bitbucket.org/sabo2/pzprv3 */
!function(a,b){"object"==typeof module&&module.exports?module.exports=[a,b]:pzpr.classmgr.makeCustom(a,b)}(["kurotto"],{MouseEvent:{use:!0,mouseinput:function(){this.puzzle.playmode?(this.mousestart||this.mousemove)&&this.inputcell():this.puzzle.editmode&&this.mousestart&&this.inputqnum()}},KeyEvent:{enablemake:!0},Cell:{numberRemainsUnshaded:!0,maxnum:function(){var a=this.board.cell.length-1;return 255>=a?a:255},minnum:0,checkComplete:function(){if(!this.isValidNum())return!0;for(var a=0,b=[],c=this.getdir4clist(),d=0;d<c.length;d++){var e=c[d][0].sblk;if(null!==e){for(var f=0;f<b.length;f++)if(b[f]===e){e=null;break}null!==e&&(a+=e.clist.length,b.push(e))}}return this.qnum===a}},AreaShadeGraph:{enabled:!0},Graphic:{hideHatena:!0,autocmp:"number",gridcolor_type:"DLIGHT",bgcellcolor_func:"qsub1",numbercolor_func:"qnum",globalfontsizeratio:.85,circleratio:[.45,.4],setRange:function(a,b,c,d){var e=this.puzzle,f=e.board;e.execConfig("autocmp")&&(a=f.minbx-2,b=f.minby-2,c=f.maxbx+2,d=f.maxby+2),this.common.setRange.call(this,a,b,c,d)},paint:function(){this.drawDotCells(!1),this.drawGrid(),this.drawShadedCells(),this.drawCircles(),this.drawNumbers(),this.drawChassis(),this.drawTarget()},getCircleFillColor:function(a){return this.puzzle.execConfig("autocmp")&&a.isValidNum()?a.checkComplete()?this.qcmpcolor:this.circledcolor:null}},Encode:{decodePzpr:function(a){this.decodeNumber16()},encodePzpr:function(a){this.encodeNumber16()}},FileIO:{decodeData:function(){this.decodeCellQnum(),this.decodeCellAns()},encodeData:function(){this.encodeCellQnum(),this.encodeCellAns()}},AnsCheck:{checklist:["checkShadeCellExist","checkCellNumber_kurotto"],checkCellNumber_kurotto:function(){for(var a=this.board,b=0;b<a.cell.length;b++){var c=a.cell[b];if(!c.checkComplete()){if(this.failcode.add("nmSumSizeNe"),this.checkOnly)break;c.seterr(1)}}}},FailCode:{nmSumSizeNe:["隣り合う黒マスの個数の合計が数字と違います。","The number is not equal to sum of adjacent masses of shaded cells."]}});
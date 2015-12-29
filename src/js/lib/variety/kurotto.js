/*! @license pzpr.js v3.5.2 (c) 2009-2015 sabo2, MIT license
 *   https://bitbucket.org/sabo2/pzprv3 */
pzpr.classmgr.makeCustom(["kurotto"],{MouseEvent:{mouseinput:function(){this.owner.playmode?(this.mousestart||this.mousemove)&&this.inputcell():this.owner.editmode&&this.mousestart&&this.inputqnum()}},KeyEvent:{enablemake:!0},Cell:{numberRemainsUnshaded:!0,maxnum:function(){var a=this.owner.board.qcols*this.owner.board.qrows-1;return 255>=a?a:255},minnum:0,checkComplete:function(a){if(!this.isValidNum())return!0;for(var b=0,c=[],d=this.getdir4clist(),e=0;e<d.length;e++){var f=a.getRoomID(d[e][0]);if(null!==f){for(var g=0;g<c.length;g++)if(c[g]===f){f=null;break}null!==f&&(b+=a.area[f].clist.length,c.push(f))}}return this.qnum===b}},AreaShadeManager:{enabled:!0},Flags:{use:!0,autocmp:"number"},Graphic:{hideHatena:!0,gridcolor_type:"DLIGHT",bgcellcolor_func:"qsub1",globalfontsizeratio:.85,circleratio:[.45,.4],setRange:function(a,b,c,d){var e=this.owner,f=e.board;e.execConfig("autocmp")&&(a=f.minbx-2,b=f.minby-2,c=f.maxbx+2,d=f.maxby+2),this.common.setRange.call(this,a,b,c,d)},paint:function(){var a=this.owner,b=a.board;this.check_binfo=a.execConfig("autocmp")?b.getShadeInfo():null,this.drawDotCells(!1),this.drawGrid(),this.drawShadedCells(),this.drawCircles(),this.drawNumbers(),this.drawChassis(),this.drawTarget()},getCircleFillColor:function(a){if(a.isValidNum()){var b=!!this.check_binfo&&a.checkComplete(this.check_binfo);return b?this.qcmpcolor:this.circledcolor}return null}},Encode:{decodePzpr:function(){this.decodeNumber16()},encodePzpr:function(){this.encodeNumber16()}},FileIO:{decodeData:function(){this.decodeCellQnum(),this.decodeCellAns()},encodeData:function(){this.encodeCellQnum(),this.encodeCellAns()}},AnsCheck:{checklist:["checkCellNumber_kurotto"],checkCellNumber_kurotto:function(){for(var a=this.owner.board,b=a.getShadeInfo(),c=0;c<a.cellmax;c++){var d=a.cell[c];if(!d.checkComplete(b)){if(this.failcode.add("nmSumSizeNe"),this.checkOnly)break;d.seterr(1)}}}},FailCode:{nmSumSizeNe:["隣り合う黒マスの個数の合計が数字と違います。","The number is not equal to sum of adjacent masses of shaded cells."]}});
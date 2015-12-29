/*! @license pzpr.js v3.5.2 (c) 2009-2015 sabo2, MIT license
 *   https://bitbucket.org/sabo2/pzprv3 */
pzpr.classmgr.makeCustom(["tasquare"],{MouseEvent:{mouseinput:function(){this.owner.playmode?(this.mousestart||this.mousemove)&&this.inputcell():this.owner.editmode&&this.mousestart&&this.inputqnum()}},KeyEvent:{enablemake:!0},Cell:{numberRemainsUnshaded:!0},AreaShadeManager:{enabled:!0},AreaUnshadeManager:{enabled:!0},Flags:{use:!0},Graphic:{hideHatena:!0,gridcolor_type:"LIGHT",globalfontsizeratio:.85,paint:function(){this.drawBGCells(),this.drawDotCells(!1),this.drawGrid(),this.drawShadedCells(),this.drawCellSquare(),this.drawNumbers(),this.drawChassis(),this.drawTarget()},drawCellSquare:function(){var a=this.vinc("cell_square","crispEdges",!0),b=.8*this.bw-1,c=.8*this.bh-1;a.lineWidth=1,a.strokeStyle="black";for(var d=this.range.cells,e=0;e<d.length;e++){var f=d[e];a.vid="c_sq_"+f.id,-1!==f.qnum?(a.fillStyle=1===f.error?this.errbcolor1:"white",a.shapeRectCenter(f.bx*this.bw,f.by*this.bh,b,c)):a.vhide()}}},Encode:{decodePzpr:function(){this.decodeNumber16()},encodePzpr:function(){this.encodeNumber16()}},FileIO:{decodeData:function(){this.decodeCellQnumAns()},encodeData:function(){this.encodeCellQnumAns()}},AnsCheck:{checklist:["checkSquareShade","checkConnectUnshade","checkSumOfSize","checkAtLeastOne"],checkSquareShade:function(){this.checkAllArea(this.getShadeInfo(),function(a,b,c){return a*b===c&&a===b},"csNotSquare")},checkSumOfSize:function(){this.checkNumberSquare(!0,"nmSumSizeNe")},checkAtLeastOne:function(){this.checkNumberSquare(!1,"nmNoSideShade")},checkNumberSquare:function(a,b){for(var c=this.owner.board,d=this.getShadeInfo(),e=0;e<c.cellmax;e++){var f=c.cell[e];if(!(a?f.qnum<0:-1===f.qnum)){var g=new this.owner.CellList,h=f.adjacent;if(h.top.isShade()&&g.extend(d.getRoomByCell(h.top).clist),h.bottom.isShade()&&g.extend(d.getRoomByCell(h.bottom).clist),h.left.isShade()&&g.extend(d.getRoomByCell(h.left).clist),h.right.isShade()&&g.extend(d.getRoomByCell(h.right).clist),!(a?g.length===f.qnum:g.length>0)){if(this.failcode.add(b),this.checkOnly)break;g.seterr(1),f.seterr(1)}}}}},FailCode:{nmSumSizeNe:["数字とそれに接する黒マスの大きさの合計が一致しません。","Sum of the adjacent masses of shaded cells is not equal to the number."],nmNoSideShade:["□に黒マスが接していません。","No shaded cells are adjacent to square marks."]}});
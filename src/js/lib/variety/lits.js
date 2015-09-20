/*! @license pzpr.js v3.5.2-pre (c) 2009-2015 sabo2, MIT license
 *   https://bitbucket.org/sabo2/pzprv3 */
pzpr.classmgr.makeCustom(["lits","norinori"],{MouseEvent:{mouseinput:function(){this.owner.playmode?(this.mousestart||this.mousemove)&&this.inputcell():this.owner.editmode&&(this.mousestart||this.mousemove)&&this.inputborder()}},Board:{hasborder:1,getTetrominoInfo:function(a){for(var b=new this.owner.AreaInfo,c=0;c<this.cellmax;c++)b.id[c]=null;for(var d=1;d<=a.max;d++){var e=a.area[d].clist.filter(function(a){return a.isShade()}),f=e.length;if(4===f){for(var g=e.getTopCell(),h=g.bx,i=g.by,j=0,k=0;f>k;k++)j+=10*(e[k].by-i>>1)+(e[k].bx-h>>1);switch(j){case 13:case 15:case 27:case 31:case 33:case 49:case 51:for(var k=0;f>k;k++)b.id[e[k].id]="L";break;case 6:case 60:for(var k=0;f>k;k++)b.id[e[k].id]="I";break;case 14:case 30:case 39:case 41:for(var k=0;f>k;k++)b.id[e[k].id]="T";break;case 20:case 24:case 38:case 42:for(var k=0;f>k;k++)b.id[e[k].id]="S"}}}return this.getBlockInfo(b)},getBlockInfo:function(a){for(var b=new this.owner.AreaInfo,c=0;c<this.cellmax;c++)b.id[c]=null!==a.id[c]?0:null;for(var c=0;c<this.cellmax;c++){var d=this.cell[c];if(0===b.id[d.id]){for(var e=b.addArea(),f=[d],g=0;f.length>0;){var h=f.pop();if(0===b.id[h.id]){e.clist[g++]=h,b.id[h.id]=e.id;for(var i=h.getdir4clist(),j=0;j<i.length;j++)a.id[h.id]===a.id[i[j][0].id]&&f.push(i[j][0])}}e.clist.length=g}}return b}},CellList:{isSeqBlock:function(){for(var a=this.length>0?[this[0]]:[],b=this.length,c={},d=0;b>d;d++)c[this[d].id]=0;for(;a.length>0;){var e=a.pop();if(1!==c[e.id]){b--,c[e.id]=1;for(var f=e.getdir4clist(),d=0;d<f.length;d++)0===c[f[d][0].id]&&a.push(f[d][0])}}return 0===b}},AreaShadeManager:{enabled:!0},AreaRoomManager:{enabled:!0},Flags:{use:!0},"Flags@lits":{use:!0,redblk:!0},Graphic:{paint:function(){this.drawBGCells(),"lits"===this.owner.pid&&this.drawDotCells(!1),this.drawGrid(),"norinori"===this.owner.pid&&this.drawShadedCells(),this.drawBorders(),this.drawChassis(),"norinori"===this.owner.pid&&this.drawBoxBorders(!1)}},"Graphic@lits":{gridcolor_type:"DARK",bgcellcolor_func:"qans2",qanscolor:"rgb(96, 96, 96)",errcolor2:"rgb(32, 32, 255)"},"Graphic@norinori":{gridcolor_type:"LIGHT",bgcellcolor_func:"qsub1",bcolor:"rgb(96, 224, 160)",bbcolor:"rgb(96, 127, 127)"},Encode:{decodePzpr:function(a){var b=pzpr.parser,c=a===b.URL_PZPRV3&&this.checkpflag("d")||a===b.URL_PZPRAPP&&!this.checkpflag("c");c&&"norinori"!==this.owner.pid?this.decodeLITS_old():this.decodeBorder()},encodePzpr:function(a){a===pzpr.parser.URL_PZPRV3||"norinori"===this.owner.pid?this.encodeBorder():(this.outpflag="c",this.encodeBorder())},decodeKanpen:function(){this.owner.fio.decodeAreaRoom()},encodeKanpen:function(){this.owner.fio.encodeAreaRoom()},decodeLITS_old:function(){for(var a=this.outbstr,b=this.owner.board,c=0;c<b.bdmax;c++){var d=b.border[c],e=d.sidecell[0],f=d.sidecell[1];e.isnull||f.isnull||a.charAt(e.id)===a.charAt(f.id)||(d.ques=1)}this.outbstr=a.substr(b.cellmax)}},FileIO:{decodeData:function(){this.decodeAreaRoom(),this.decodeCellAns()},encodeData:function(){this.encodeAreaRoom(),this.encodeCellAns()},kanpenOpen:function(){this.decodeAreaRoom(),this.decodeCellAns()},kanpenSave:function(){this.encodeAreaRoom(),this.encodeCellAns()},kanpenOpenXML:function(){this.decodeAreaRoom_XMLBoard(),this.decodeCellAns_XMLAnswer()},kanpenSaveXML:function(){this.encodeAreaRoom_XMLBoard(),this.encodeCellAns_XMLAnswer()}},"AnsCheck@lits#1":{checklist:["check2x2ShadeCell","checkOverShadeCellInArea","checkSeqBlocksInRoom","checkTetromino","checkConnectShade","checkNoShadeCellInArea","checkLessShadeCellInArea"]},"AnsCheck@norinori#1":{checklist:["checkOverShadeCell","checkOverShadeCellInArea","checkSingleShadeCell","checkSingleShadeCellInArea","checkNoShadeCellInArea"]},"AnsCheck@lits":{checkOverShadeCellInArea:function(){this.checkAllBlock(this.getRoomInfo(),function(a){return a.isShade()},function(a,b,c){return 4>=c},"bkShadeGt4")},checkLessShadeCellInArea:function(){this.checkAllBlock(this.getRoomInfo(),function(a){return a.isShade()},function(a,b,c){return c>=4},"bkShadeLt4")},checkSeqBlocksInRoom:function(){for(var a=this.owner.board,b=1;b<=a.rooms.max;b++){var c=a.rooms.area[b].clist.filter(function(a){return a.isShade()});if(!c.isSeqBlock()){if(this.failcode.add("bkShadeDivide"),this.checkOnly)break;c.seterr(1)}}},checkTetromino:function(){for(var a=this.getRoomInfo(),b=this.owner.board.getTetrominoInfo(a),c=1;c<=b.max;c++){var d=b.area[c].clist;if(!(d.length<=4)){if(this.failcode.add("bsSameShape"),this.checkOnly)break;d.seterr(2)}}}},"AnsCheck@norinori":{checkOverShadeCell:function(){this.checkAllArea(this.getShadeInfo(),function(a,b,c){return 2>=c},"csGt2")},checkSingleShadeCell:function(){this.checkAllArea(this.getShadeInfo(),function(a,b,c){return c>=2},"csLt2")},checkOverShadeCellInArea:function(){this.checkAllBlock(this.getRoomInfo(),function(a){return a.isShade()},function(a,b,c){return 2>=c},"bkShadeGt2")},checkSingleShadeCellInArea:function(){this.checkAllBlock(this.getRoomInfo(),function(a){return a.isShade()},function(a,b,c){return 1!==c},"bkShadeLt2")}},"FailCode@lits":{bkShadeLt4:["黒マスのカタマリが４マス未満の部屋があります。","A room has three or less shaded cells."],bkShadeGt4:["５マス以上の黒マスがある部屋が存在します。","A room has five or more shaded cells."],bsSameShape:["同じ形のテトロミノが接しています。","Some Tetrominos that are the same shape are Adjacent."]},"FailCode@norinori":{csLt2:["１マスだけの黒マスのカタマリがあります。","There is a single shaded cell."],csGt2:["２マスより大きい黒マスのカタマリがあります。","The size of a mass of shaded cells is over two."],bkShadeLt2:["１マスしか黒マスがない部屋があります。","A room has only one shaded cell."],bkShadeGt2:["２マス以上の黒マスがある部屋が存在します。","A room has three or mode shaded cells."]}});
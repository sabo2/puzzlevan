/*! @license pzpr.js v3.5.2-pre (c) 2009-2015 sabo2, MIT license
 *   https://bitbucket.org/sabo2/pzprv3 */
pzpr.classmgr.makeCustom(["lightup"],{MouseEvent:{mouseinput:function(){this.owner.playmode?(this.mousestart||this.mousemove&&1!==this.inputData)&&this.inputcell():this.owner.editmode&&this.mousestart&&this.inputqnum()}},KeyEvent:{enablemake:!0},Cell:{qlight:0,akariinfo:0,numberRemainsUnshaded:!0,maxnum:4,minnum:0,posthook:{qnum:function(a){this.setAkariInfo(a)},qans:function(a){this.setAkariInfo(a)}},isAkari:function(){return 1===this.qans},setAkariInfo:function(){var a=0,b=this.akariinfo;-1!==this.qnum?a=2:1===this.qans&&(a=1),b!==a&&(this.akariinfo=a,this.setQlight(b,a))},setQlight:function(a,b){var c=this.akariRangeClist();if(0===a&&1===b)for(var d=0;d<c.length;d++)c[d].qlight=1;else{for(var d=0;d<c.length;d++){var e=c[d],f=e.qlight;0===f&&(1===a&&0===b||0===a&&2===b)||(1!==f||2!==a||0!==b)&&(e.qlight=e.akariRangeClist().some(function(a){return a.isAkari()})?1:0)}2===b&&(this.qlight=0)}var g=this.akariRange();this.owner.painter.paintRange(g.x1-1,this.by-1,g.x2+1,this.by+1),this.owner.painter.paintRange(this.bx-1,g.y1-1,this.bx+1,g.y2+1)},akariRangeClist:function(){var a,b=new this.owner.CellList,c=this.adjacent;for(b.add(this),a=c.left;!a.isnull&&-1===a.qnum;)b.add(a),a=a.adjacent.left;for(a=c.right;!a.isnull&&-1===a.qnum;)b.add(a),a=a.adjacent.right;for(a=c.top;!a.isnull&&-1===a.qnum;)b.add(a),a=a.adjacent.top;for(a=c.bottom;!a.isnull&&-1===a.qnum;)b.add(a),a=a.adjacent.bottom;return b},akariRange:function(){var a,b,c={},d=this.adjacent;for(a=this,b=d.left;!b.isnull&&-1===b.qnum;)a=b,b=a.adjacent.left;for(c.x1=a.bx,a=this,b=d.right;!b.isnull&&-1===b.qnum;)a=b,b=a.adjacent.right;for(c.x2=a.bx,a=this,b=d.top;!b.isnull&&-1===b.qnum;)a=b,b=a.adjacent.top;for(c.y1=a.by,a=this,b=d.bottom;!b.isnull&&-1===b.qnum;)a=b,b=a.adjacent.bottom;return c.y2=a.by,c}},Board:{resetInfo:function(){this.initQlight()},initQlight:function(){for(var a=0;a<this.cellmax;a++){var b=this.cell[a];b.qlight=0,b.akariinfo=0,-1!==b.qnum?b.akariinfo=2:1===b.qans&&(b.akariinfo=1)}for(var a=0;a<this.cellmax;a++){var b=this.cell[a];if(1===b.akariinfo)for(var c=b.akariRangeClist(),d=0;d<c.length;d++)c[d].qlight=1}}},Flags:{use:!0},Graphic:{hideHatena:!0,gridcolor_type:"LIGHT",dotcolor_type:"PINK",cellcolor_func:"qnum",fontcolor:"white",fontErrcolor:"white",lightcolor:"rgb(192, 255, 127)",paint:function(){this.drawBGCells(),this.drawGrid(),this.drawShadedCells(),this.drawNumbers(),this.drawAkari(),this.drawDotCells(!0),this.drawChassis(),this.drawTarget()},getBGCellColor:function(a){if(-1===a.qnum){if(1===a.error)return this.errbcolor1;if(1===a.qlight)return this.lightcolor}return null},drawAkari:function(){for(var a=this.vinc("cell_akari","auto"),b=.4*this.cw,c="rgb(0, 127, 96)",d=this.range.cells,e=0;e<d.length;e++){var f=d[e];a.vid="c_AK_"+f.id,f.isAkari()?(a.fillStyle=4!==f.error?c:this.errcolor1,a.fillCircle(f.bx*this.bw,f.by*this.bh,b)):a.vhide()}}},Encode:{decodePzpr:function(){this.decode4Cell()},encodePzpr:function(){this.encode4Cell()},decodeKanpen:function(){this.owner.fio.decodeCellQnumb()},encodeKanpen:function(){this.owner.fio.encodeCellQnumb()}},FileIO:{decodeData:function(){this.decodeCellQnumAns()},encodeData:function(){this.encodeCellQnumAns()},kanpenOpen:function(){this.decodeCell(function(a,b){"+"===b?a.qans=1:"*"===b?a.qsub=1:"5"===b?a.qnum=-2:"."!==b&&(a.qnum=parseInt(b))})},kanpenSave:function(){this.encodeCell(function(a){return 1===a.qans?"+ ":1===a.qsub?"* ":a.qnum>=0?a.qnum.toString()+" ":-2===a.qnum?"5 ":". "})}},AnsCheck:{checklist:["checkNotDuplicateAkari","checkDir4Akari","checkShinedCell"],checkDir4Akari:function(){this.checkDir4Cell(function(a){return a.isAkari()},0,"nmAkariNe")},checkShinedCell:function(){this.checkAllCell(function(a){return a.noNum()&&1!==a.qlight},"ceDark")},checkNotDuplicateAkari:function(){this.checkRowsColsPartly(this.isPluralAkari,function(a){return a.isNum()},"akariDup")},isPluralAkari:function(a){var b=a.filter(function(a){return a.isAkari()}),c=b.length<=1;return c||b.seterr(4),c}},FailCode:{nmAkariNe:["数字のまわりにある照明の数が間違っています。","The number is not equal to the number of Akari around it."],akariDup:["照明に別の照明の光が当たっています。","Akari is shined from another Akari."],ceDark:["照明に照らされていないセルがあります。","A cell is not shined."]}});
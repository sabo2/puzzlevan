/*! @license pzpr.js v3.5.2 (c) 2009-2015 sabo2, MIT license
 *   https://bitbucket.org/sabo2/pzprv3 */
pzpr.classmgr.makeCustom(["kaero"],{MouseEvent:{mouseinput:function(){this.owner.playmode?this.mousestart||this.mousemove?this.btn.Left?this.inputMoveLine():this.btn.Right&&this.inputpeke():this.mouseend&&this.notInputted()&&this.inputlight():this.owner.editmode&&(this.mousestart||this.mousemove?this.inputborder():this.mouseend&&this.notInputted()&&this.inputqnum())},inputlight:function(){var a=this.getcell();a.isnull||(0===a.qsub?a.setQsub(this.btn.Left?1:2):1===a.qsub?a.setQsub(this.btn.Left?2:0):2===a.qsub&&a.setQsub(this.btn.Left?0:1),a.draw())}},KeyEvent:{enablemake:!0,keyinput:function(a){this.key_inputqnum_kaero(a)},key_inputqnum_kaero:function(a){var b=this.cursor.getc();if(a.length>1&&"BS"!==a)return!1;if(a>="a"&&"z">=a){var c=parseInt(a,36)-10,d=b.qnum;b.setQnum((d-1)%26===c&&d>0&&26>=d?d+26:(d-1)%26===c?-1:c+1)}else if("-"===a)b.setQnum(-2!==b.qnum?-2:-1);else if("BS"===a)b.setQnum(b.qnum>=0?-2:-1);else{if(" "!==a)return;b.setQnum(-1)}this.prev=b,b.draw()}},Cell:{maxnum:52},CellList:{getDeparture:function(){return this.map(function(a){return a.base}).notnull()}},Board:{qcols:6,qrows:6,hasborder:1},LineManager:{isCenterLine:!0},AreaRoomManager:{enabled:!0},AreaLineManager:{enabled:!0,moveline:!0},Graphic:{gridcolor_type:"LIGHT",bgcellcolor_func:"qsub2",qsubcolor1:"rgb(224, 224, 255)",qsubcolor2:"rgb(255, 255, 144)",paint:function(){this.drawBGCells(),this.drawDashedGrid(),this.drawBorders(),this.drawTip(),this.drawPekes(),this.drawDepartures(),this.drawLines(),this.drawCellSquare(),this.drawNumbers_kaero(),this.drawChassis(),this.drawTarget()},drawCellSquare:function(){for(var a=this.vinc("cell_number_base","crispEdges",!0),b=.7*this.bw-1,c=.7*this.bh-1,d=this.owner.execConfig("dispmove"),e=this.range.cells,f=0;f<e.length;f++){var g=e[f];a.vid="c_sq_"+g.id,!d&&g.isDeparture()||d&&g.isDestination()?(a.fillStyle=1===g.error?this.errbcolor1:1===g.qsub?this.qsubcolor1:2===g.qsub?this.qsubcolor2:"white",a.fillRectCenter(g.bx*this.bw,g.by*this.bh,b,c)):a.vhide()}},drawNumbers_kaero:function(){for(var a=this.vinc("cell_number","auto"),b=this.owner.execConfig("dispmove"),c={ratio:[.85]},d=this.range.cells,e=0;e<d.length;e++){var f=d[e],g=f.bx*this.bw,h=f.by*this.bh,i=(b?f.base:f).qnum,j="";a.vid="cell_text_"+f.id,-1!==i?(-2===i?j="?":j+=i>0&&26>=i?(i+9).toString(36).toUpperCase():i>26&&52>=i?(i-17).toString(36).toLowerCase():i,a.fillStyle=this.getCellNumberColor(f),this.disptext(j,g,h,c)):a.vhide()}}},Encode:{decodePzpr:function(){this.decodeBorder(),this.decodeKaero()},encodePzpr:function(){this.encodeBorder(),this.encodeKaero()},decodeKaero:function(){for(var a=0,b=0,c=this.outbstr,d=this.owner.board,e=0;e<c.length;e++){var f=c.charAt(e),g=d.cell[a];if(this.include(f,"0","9")?g.qnum=parseInt(f,36)+27:this.include(f,"A","Z")?g.qnum=parseInt(f,36)-9:"-"===f?(g.qnum=parseInt(c.charAt(e+1),36)+37,e++):"."===f?g.qnum=-2:this.include(f,"a","z")&&(a+=parseInt(f,36)-10),a++,a>=d.cellmax){b=e+1;break}}this.outbstr=c.substring(b)},encodeKaero:function(){for(var a="",b=0,c=this.owner.board,d=0;d<c.cellmax;d++){var e="",f=c.cell[d].qnum;-2===f?e=".":f>=1&&26>=f?e=""+(f+9).toString(36).toUpperCase():f>=27&&36>=f?e=""+(f-27).toString(10):f>=37&&72>=f?e="-"+(f-37).toString(36).toUpperCase():b++,0===b?a+=e:(e||26===b)&&(a+=(9+b).toString(36).toLowerCase()+e,b=0)}b>0&&(a+=(9+b).toString(36).toLowerCase()),this.outbstr+=a}},FileIO:{decodeData:function(){this.decodeCellQnum(),this.decodeCellQanssub(),this.decodeBorderQues(),this.decodeBorderLine()},encodeData:function(){this.encodeCellQnum(),this.encodeCellQanssub(),this.encodeBorderQues(),this.encodeBorderLine()}},AnsCheck:{checklist:["checkBranchLine","checkCrossLine","checkConnectObject","checkLineOverLetter","checkSameObjectInRoom_kaero","checkGatheredObject","checkNoObjectBlock","checkDisconnectLine"],checkSameObjectInRoom_kaero:function(){var a=this.getRoomInfo();a:for(var b=1;b<=a.max;b++)for(var c=a.area[b].clist,d=-1,e=c.getDeparture(),f=0;f<e.length;f++){var g=e[f].qnum;if(-1===d)d=g;else if(d!==g){if(this.failcode.add("bkPlNum"),this.checkOnly)break a;this.owner.execConfig("dispmove")||e.seterr(4),c.seterr(1)}}},checkGatheredObject:function(){for(var a=0,b=this.owner.board,c=this.getRoomInfo(),d=0;d<b.cellmax;d++){var e=b.cell[d].base.qnum;e>a&&(a=e)}a:for(var e=0;a>=e;e++)for(var f=b.cell.filter(function(a){return e===a.base.qnum}),g=null,h=0;h<f.length;h++){var i=c.getRoomID(f[h]);if(null===g)g=i;else if(null!==i&&g!==i){this.failcode.add("bkSepNum"),this.owner.execConfig("dispmove")||f.getDeparture().seterr(4),f.seterr(1);break a}}},checkNoObjectBlock:function(){this.checkNoMovedObjectInRoom(this.getRoomInfo())}},FailCode:{bkNoNum:["アルファベットのないブロックがあります。","A block has no letters."],bkPlNum:["１つのブロックに異なるアルファベットが入っています。","A block has plural kinds of letters."],bkSepNum:["同じアルファベットが異なるブロックに入っています。","Same kinds of letters are placed different blocks."]}});
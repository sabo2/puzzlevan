/*! @license pzpr.js v3.5.2-pre (c) 2009-2015 sabo2, MIT license
 *   https://bitbucket.org/sabo2/pzprv3 */
pzpr.classmgr.makeCustom(["triplace"],{MouseEvent:{mouseinput:function(){this.owner.playmode?this.mousestart||this.mousemove?this.owner.key.isZ?this.inputBGcolor():this.btn.Left&&this.isBorderMode()?this.inputborder():this.inputQsubLine():this.mouseend&&this.notInputted()&&this.inputBGcolor():this.owner.editmode&&this.mousestart&&this.input51()},inputBGcolor:function(){var a=this.getcell();a.isnull||a.is51cell()||a===this.mouseCell||(null===this.inputData&&(this.btn.Left?this.inputData=0===a.qsub?1:1===a.qsub?2:0:this.btn.Right&&(this.inputData=0===a.qsub?2:1===a.qsub?0:1)),a.setQsub(this.inputData),this.mouseCell=a,a.draw())}},KeyEvent:{enablemake:!0,keyinput:function(a){this.inputnumber51(a,{2:this.owner.board.qcols-(this.cursor.bx>>1)-1,4:this.owner.board.qrows-(this.cursor.by>>1)-1})}},Cell:{disInputHatena:!0,minnum:0,set51cell:function(){this.setQues(51),this.setQnum(-1),this.setQnum2(-1),this.set51aroundborder()},remove51cell:function(){this.setQues(0),this.setQnum(-1),this.setQnum2(-1),this.set51aroundborder()},set51aroundborder:function(){for(var a=this.getdir4cblist(),b=0;b<a.length;b++){var c=a[b][0],d=a[b][1];d.isnull||d.setQues(this.is51cell()^c.is51cell()?1:0)}}},EXCell:{ques:51},Board:{hasborder:1,hasexcell:1,initialize:function(){this.common.initialize.call(this),this.tiles=this.addInfoList(this.owner.AreaTriTileManager)},getTileInfo:function(){for(var a=this.tiles.getAreaInfo(),b=1;b<=a.max;b++){var c=a.area[b].clist.getRectSize();a.area[b].is1x3=c.x1!==c.x2&&c.y1!==c.y2||3!==c.cnt?0:1}return a}},BoardExec:{adjustBoardData:function(a,b){this.adjustQues51_1(a,b)},adjustBoardData2:function(a,b){this.adjustQues51_2(a,b)}},"AreaTriTileManager:AreaManager":{enabled:!0,relation:["cell","border"],isvalid:function(a){return!a.is51cell()},bdfunc:function(a){return a.isBorder()}},Graphic:{gridcolor_type:"LIGHT",bgcellcolor_func:"qsub2",borderQanscolor:"rgb(0, 160, 0)",paint:function(){this.drawBGCells(),this.drawBGEXcells(),this.drawQues51(),this.drawGrid(),this.drawQansBorders(),this.drawQuesBorders(),this.drawBorderQsubs(),this.drawChassis_ex1(!1),this.drawNumbersOn51(),this.drawTarget()}},Encode:{decodePzpr:function(){this.decodeTriplace()},encodePzpr:function(){this.encodeTriplace()},decodeTriplace:function(){var a=0,b=0,c=this.outbstr,d=this.owner.board;d.disableInfo();for(var e=0;e<c.length;e++){var f=c.charAt(e),g=d.cell[a];if(f>="g"&&"z">=f?a+=parseInt(f,36)-16:(g.set51cell(),"_"===f||("%"===f?(g.qnum2=parseInt(c.charAt(e+1),36),e++):"$"===f?(g.qnum=parseInt(c.charAt(e+1),36),e++):"-"===f?(g.qnum2="."!==c.charAt(e+1)?parseInt(c.charAt(e+1),16):-1,g.qnum=parseInt(c.substr(e+2,2),16),e+=3):"+"===f?(g.qnum2=parseInt(c.substr(e+1,2),16),g.qnum="."!==c.charAt(e+3)?parseInt(c.charAt(e+3),16):-1,e+=3):"="===f?(g.qnum2=parseInt(c.substr(e+1,2),16),g.qnum=parseInt(c.substr(e+3,2),16),e+=4):(g.qnum2="."!==c.charAt(e)?parseInt(c.charAt(e),16):-1,g.qnum="."!==c.charAt(e+1)?parseInt(c.charAt(e+1),16):-1,e+=1))),a++,a>=d.cellmax){b=e+1;break}}d.enableInfo(),a=0;for(var e=b;e<c.length;e++){var f=c.charAt(e),h=d.excell[a];if("."===f?h.qnum2=-1:"-"===f?(h.qnum2=parseInt(c.substr(e+1,2),16),e+=2):h.qnum2=parseInt(f,16),a++,a>=d.qcols){b=e+1;break}}for(var e=b;e<c.length;e++){var f=c.charAt(e),h=d.excell[a];if("."===f?h.qnum=-1:"-"===f?(h.qnum=parseInt(c.substr(e+1,2),16),e+=2):h.qnum=parseInt(f,16),a++,a>=d.qcols+d.qrows){b=e+1;break}}this.outbstr=c.substr(b)},encodeTriplace:function(){for(var a="",b=this.owner.board,c=0,d=0;d<b.cellmax;d++){var e="",f=b.cell[d];51===f.ques?-1===f.qnum&&-1===f.qnum2?e="_":-1===f.qnum2&&f.qnum<35?e="$"+f.qnum.toString(36):-1===f.qnum&&f.qnum2<35?e="%"+f.qnum2.toString(36):(e+=f.qnum2.toString(16),e+=f.qnum.toString(16),f.qnum>=16&&f.qnum2>=16?e="="+e:f.qnum>=16?e="-"+e:f.qnum2>=16&&(e="+"+e)):c++,0===c?a+=e:(e||20===c)&&(a+=(c+15).toString(36)+e,c=0)}c>0&&(a+=(c+15).toString(36));for(var d=0;d<b.qcols;d++){var g=b.excell[d].qnum2;0>g?a+=".":16>g?a+=g.toString(16):256>g&&(a+="-"+g.toString(16))}for(var d=b.qcols;d<b.qcols+b.qrows;d++){var g=b.excell[d].qnum;0>g?a+=".":16>g?a+=g.toString(16):256>g&&(a+="-"+g.toString(16))}this.outbstr+=a}},FileIO:{decodeData:function(){this.decodeCellQnum51(),this.decodeBorderAns(),this.decodeCell(function(a,b){"+"===b?a.qsub=1:"-"===b&&(a.qsub=2)})},encodeData:function(){this.encodeCellQnum51(),this.encodeBorderAns(),this.encodeCell(function(a){return 1===a.qsub?"+ ":2===a.qsub?"- ":". "})}},AnsCheck:{checklist:["checkOverThreeCells","checkRowsColsTileCount","checkLessThreeCells"],getTileInfo:function(){return this._info.tile=this._info.tile||this.owner.board.getTileInfo()},checkOverThreeCells:function(){this.checkAllArea(this.getTileInfo(),function(a,b,c){return c>=3},"bkSizeLt3")},checkLessThreeCells:function(){this.checkAllArea(this.getTileInfo(),function(a,b,c){return 3>=c},"bkSizeGt3")},checkRowsColsTileCount:function(){this.checkRowsColsPartly(this.isTileCount,function(a){return a.is51cell()},"asLblockNe")},isTileCount:function(a,b){for(var c=this.getTileInfo(),d=b.key51num,e=0,f=[],g=0;g<a.length;g++){var h=c.id[a[g].id];1!==c.area[h].is1x3||f[h]||(e++,f[h]=!0)}var i=0>d||e===d;return i||(b.keycell.seterr(1),a.seterr(1)),i}},FailCode:{bkSizeLt3:["サイズが3マスより小さいブロックがあります。","The size of block is smaller than three."],bkSizeGt3:["サイズが3マスより大きいブロックがあります。","The size of block is larger than three."],asLblockNe:["数字の下か右にあるまっすぐのブロックの数が間違っています。","The number of straight blocks underward or rightward is not correct."]}});
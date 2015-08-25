/*! @license pzpr.js v3.5.2-pre (c) 2009-2015 sabo2, MIT license
 *   https://bitbucket.org/sabo2/pzprv3 */
pzpr.classmgr.makeCustom(["pipelink","pipelinkr"],{MouseEvent:{mouseinput:function(){this.owner.playmode?this.btn.Left?this.mousestart||this.mousemove?this.inputLine():this.mouseend&&this.notInputted()&&this.inputpeke():this.btn.Right&&(this.mousestart||this.mousemove)&&this.inputpeke():this.owner.editmode&&this.mousestart&&this.inputQues([0,11,12,13,14,15,16,17,-2])}},KeyEvent:{enablemake:!0,keyinput:function(a){this.key_inputLineParts(a)},key_inputLineParts:function(a){if(this.owner.playmode)return!1;var b=this.cursor.getc();if("q"===a)b.setQues(11);else if("w"===a)b.setQues(12);else if("e"===a)b.setQues(13);else if("r"===a)b.setQues(0);else if(" "===a)b.setQues(0);else if("a"===a)b.setQues(14);else if("s"===a)b.setQues(15);else if("d"===a)b.setQues(16);else if("f"===a)b.setQues(17);else if("-"===a)b.setQues(-2!==b.ques?-2:0);else{if("pipelinkr"!==this.owner.pid||"1"!==a)return!1;b.setQues(6)}return b.drawaround(),!0}},Border:{enableLineNG:!0,enableLineCombined:!0},Board:{hasborder:1},BoardExec:{adjustBoardData:function(a,b){if(a&this.TURNFLIP){var c={};switch(a){case this.FLIPY:c={14:17,15:16,16:15,17:14};break;case this.FLIPX:c={14:15,15:14,16:17,17:16};break;case this.TURNR:c={12:13,13:12,14:17,15:14,16:15,17:16};break;case this.TURNL:c={12:13,13:12,14:15,15:16,16:17,17:14}}for(var d=this.owner.board.cellinside(b.x1,b.y1,b.x2,b.y2),e=0;e<d.length;e++){var f=d[e],g=c[f.ques];g&&f.setQues(g)}}}},LineManager:{isCenterLine:!0,isLineCross:!0},Flags:{redline:!0,irowake:1},Graphic:{gridcolor_type:"LIGHT",linecolor_type:"LIGHT",circleratio:[.42,.37],minYdeg:.42,paint:function(){this.drawBGCells(),this.drawDashedGrid(),"pipelinkr"===this.owner.pid&&(this.drawCircles(),this.drawBorders()),this.drawHatenas(),this.drawLines(),this.drawPekes(),this.drawLineParts(),this.drawChassis(),this.drawTarget()},getBGCellColor:function(a){return 1===a.error?this.errbcolor1:6===a.ques&&2===this.owner.getConfig("disptype_pipelinkr")?this.icecolor:null},getBorderColor:function(a){if(2===this.owner.getConfig("disptype_pipelinkr")){var b=a.sidecell[0],c=a.sidecell[1];if(!b.isnull&&!c.isnull&&b.ice()^c.ice())return this.quescolor}return null},getCircleStrokeColor:function(a){return 1===this.owner.getConfig("disptype_pipelinkr")&&6===a.ques?this.quescolor:null},circlefillcolor_func:"null",repaintParts:function(a){this.range.cells=a.cellinside(),this.drawLineParts()}},Encode:{decodePzpr:function(){this.decodePipelink(),this.checkPuzzleid();var a=this.owner;"pipelinkr"===a.pid&&a.setConfig("disptype_pipelinkr",this.checkpflag("i")?2:1)},encodePzpr:function(a){var b=this.owner;this.outpflag="pipelinkr"===b.pid&&2===b.getConfig("disptype_pipelinkr")?"i":null,this.encodePipelink(a)},decodePipelink:function(){for(var a=0,b=this.outbstr,c=this.owner.board,d=0;d<b.length;d++){var e=b.charAt(d);if("."===e)c.cell[a].ques=-2;else if(e>="0"&&"9">=e){for(var f=0,g=parseInt(e,10)+1;g>f;f++)a<c.cellmax&&(c.cell[a].ques=6,a++);a--}else e>="a"&&"g">=e?c.cell[a].ques=parseInt(e,36)+1:e>="h"&&"z">=e&&(a+=parseInt(e,36)-17);if(a++,a>=c.cellmax)break}this.outbstr=b.substr(d)},encodePipelink:function(a){var b,c=pzpr.parser,d="",e=this.owner.board;b=0;for(var f=0;f<e.cellmax;f++){var g="",h=e.cell[f].ques;if(-2===h)g=".";else if(6===h)if(a===c.URL_PZPRV3){for(var i=1;10>i&&!(f+i>=e.cellmax||6!==e.cell[f+i].ques);i++);g=(i-1).toString(10),f=f+i-1}else a===c.URL_PZPRAPP&&(g="0");else h>=11&&17>=h?g=(h-1).toString(36):b++;0===b?d+=g:(g||19===b)&&(d+=(16+b).toString(36)+g,b=0)}b>0&&(d+=(16+b).toString(36)),this.outbstr+=d},checkPuzzleid:function(){var a=this.owner,b=a.board;if("pipelink"===a.pid)for(var c=0;c<b.cellmax;c++)if(6===b.cell[c].ques){a.changepid("pipelinkr");break}}},FileIO:{decodeData:function(){var a=this.readLine();this.decodeCell(function(a,b){"o"===b?a.ques=6:"-"===b?a.ques=-2:"."!==b&&(a.ques=parseInt(b,36)+1)}),this.decodeBorderLine();var b=this.owner;b.enc.checkPuzzleid(),"pipelinkr"===b.pid&&b.setConfig("disptype_pipelinkr","circle"===a?1:2)},encodeData:function(){var a=this.owner;"pipelink"===a.pid?this.datastr+="pipe\n":"pipelinkr"===a.pid&&(this.datastr+=1===a.getConfig("disptype_pipelinkr")?"circle\n":"ice\n"),this.encodeCell(function(a){return 6===a.ques?"o ":-2===a.ques?"- ":a.ques>=11&&a.ques<=17?""+(a.ques-1).toString(36)+" ":". "}),this.encodeBorderLine()}},AnsCheck:{checklist:["checkenableLineParts","checkCrossOutOfMark@pipelinkr","checkIceLines@pipelinkr","checkBranchLine","checkOneLoop","checkNotCrossOnMark","checkNoLine","checkDeadendLine+"],checkCrossOutOfMark:function(){this.checkAllCell(function(a){return 4===a.lcnt&&6!==a.ques&&11!==a.ques},"lnCrossExIce")}},"CheckInfo@pipelinkr":{text:function(a){var b=this.owner,c=[],d="ja"===(a||b.getConfig("language"))?0:1,e=2===b.getConfig("disptype_pipelinkr");if(0===this.length)return b.faillist.complete[d];for(var f=0;f<this.length;f++){var g=this[f];e||("lnCrossExIce"===g?g="lnCrossExCir":"lnCurveOnIce"===g&&(g="lnCurveOnCir")),c.push(b.faillist[g][d])}return c.join("\n")}},FailCode:{lnCrossExCir:["○の部分以外で線が交差しています。","There is a crossing line out of circles."],lnCurveOnCir:["○の部分で線が曲がっています。","A line curves on circles."]}});
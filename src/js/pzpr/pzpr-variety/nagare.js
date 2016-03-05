/*! @license pzpr.js v0.3.2 (c) 2009-2016 sabo2, MIT license
 *   https://bitbucket.org/sabo2/pzprv3 */
!function(a,b){"object"==typeof module&&module.exports?module.exports=[a,b]:pzpr.classmgr.makeCustom(a,b)}(["nagare"],{MouseEvent:{redline:!0,mouseinput:function(){this.puzzle.playmode?"left"===this.btn?this.mousestart||this.mousemove?this.inputLine():this.mouseend&&this.notInputted()&&this.clickmark():"right"===this.btn&&(this.mousestart?this.inputmark_mousedown():2===this.inputData||3===this.inputData?this.inputpeke():this.mousemove&&this.inputmark_mousemove()):this.puzzle.editmode&&(this.mousestart||this.mousemove?this.inputarrow_cell():this.mouseend&&this.notInputted()&&this.inputShadeCell())},clickmark:function(){var a=this.getpos(.22);if(!this.prevPos.equals(a)){var b=a.getb();if(!b.isnull){var c={0:2,2:0},d=this.puzzle.getConfig("dirauxmark");d&&(c=b.isvert?"left"===this.btn?{0:2,2:13,13:14,14:0}:{0:14,14:13,13:2,2:0}:"left"===this.btn?{0:2,2:11,11:12,12:0}:{0:12,12:11,11:2,2:0}),b.setQsub(c[b.qsub]||0),d||b.setLineVal(0),b.draw()}}},inputmark_mousedown:function(){var a=this.getpos(.22),b=a.getb();this.puzzle.getConfig("dirauxmark")&&b.isnull||(this.inputData=b.isnull||2!==b.qsub?2:3,this.inputpeke())},inputmark_mousemove:function(){var a=this.getpos(0);if(!a.getc().isnull){var b=this.prevPos.getnb(a);if(!b.isnull){var c=null,d=this.prevPos.getdir(a,2);null===this.inputData&&(this.inputData=b.qsub!==10+d?11:0),11===this.inputData?c=10+d:0===this.inputData&&b.qsub===10+d&&(c=0),null!==c&&(b.setQsub(c),b.draw())}this.prevPos=a}},inputarrow_cell_main:function(a,b){a.setQdir(a.qdir!==b?b:0)},inputShadeCell:function(){var a=this.getcell();a.isnull||a===this.mouseCell||(a!==this.cursor.getc()&&this.puzzle.getConfig("cursor")?this.setcursor(a):(a.setQues(1===a.ques?0:1),a.drawaround()))}},KeyEvent:{enablemake:!0,moveTarget:function(a){return a.match(/shift/)?!1:this.moveTCell(a)},keyinput:function(a){this.key_inputarrow(a)||this.key_inputques_nagare(a)},key_inputques_nagare:function(a){if("q"===a||"w"===a){var b=this.cursor.getc();b.setQues(1!==b.ques?1:0),b.drawaround()}}},Cell:{windbase:0,wind:0,noLP:function(a){return 1===this.ques},posthook:{ques:function(a){this.setWindAround()},qdir:function(a){this.setWindAround()}},initWind:function(){if(this.wind=0,1!==this.ques){var a,b=this.board,c=new this.klass.ViewRange(this.bx,this.by,function(a){return 0!==a.ques});a=b.getc(c.x0,c.y2+2),1===a.ques&&a.qdir===a.UP&&(this.wind|=1),a=b.getc(c.x0,c.y1-2),1===a.ques&&a.qdir===a.DN&&(this.wind|=2),a=b.getc(c.x2+2,c.y0),1===a.ques&&a.qdir===a.LT&&(this.wind|=4),a=b.getc(c.x1-2,c.y0),1===a.ques&&a.qdir===a.RT&&(this.wind|=8)}},calcWindBase:function(){var a=this.windbase;return this.windbase=0,1===this.ques&&(this.windbase|=16|[0,1,2,4,8][this.qdir]),a^this.windbase},setWindAround:function(){if(0!==this.calcWindBase()){this.initWind();for(var a=new this.klass.ViewRange(this.bx,this.by,function(a){return 0!==a.ques}),b=0;4>b;b++){for(var c=b+1,d=a.getdirclist(c),e=a.getdirblist(c),f=1<<b,g=(this.windbase&(16|f))===(16|f)?f:0,h=0;h<d.length;h++)d[h].wind=d[h].wind&~f|g;for(var h=0;h<e.length;h++)e[h].wind=e[h].wind&~f|g}}}},Range:{x1:-1,y1:-1,x2:-1,y2:-1},"RectRange:Range":{cellinside:function(){return this.board.cellinside(this.x1,this.y1,this.x2,this.y2)},borderinside:function(){return this.board.borderinside(this.x1,this.y1,this.x2,this.y2)}},"ViewRange:Range":{initialize:function(a,b,c){this.x0=a,this.y0=b,c&&this.search(c)},search:function(a){var b,c,d=this.board.getc(this.x0,this.y0),e=d.adjacent;for(b=d,c=e.left;!c.isnull&&!a(c);)b=c,c=b.adjacent.left;for(this.x1=b.bx,b=d,c=e.right;!c.isnull&&!a(c);)b=c,c=b.adjacent.right;for(this.x2=b.bx,b=d,c=e.top;!c.isnull&&!a(c);)b=c,c=b.adjacent.top;for(this.y1=b.by,b=d,c=e.bottom;!c.isnull&&!a(c);)b=c,c=b.adjacent.bottom;this.y2=b.by},getdirclist:function(a){return this.getdirrange(a).cellinside()},getdirblist:function(a){return this.getdirrange(a).borderinside()},getdirrange:function(a){var b=new this.klass.RectRange;return 1===a?(b.x1=b.x2=this.x0,b.y1=this.y1,b.y2=this.y0-2):2===a?(b.x1=b.x2=this.x0,b.y1=this.y0+2,b.y2=this.y2):3===a?(b.x1=this.x1,b.x2=this.x0-2,b.y1=b.y2=this.y0):4===a&&(b.x1=this.x0+2,b.x2=this.x2,b.y1=b.y2=this.y0),b}},Border:{wind:0,enableLineNG:!0,setLine:function(a){this.setLineVal(1),2===this.qsub&&this.setQsub(0)},removeLine:function(a){this.setLineVal(0),2===this.qsub&&this.setQsub(0)}},Board:{hasborder:1,rebuildInfo:function(){this.initWind(),this.common.rebuildInfo.call(this)},initWind:function(){for(var a=0;a<this.border.length;a++)this.border[a].wind=0;for(var b=0;b<this.cell.length;b++){var c=this.cell[b];c.wind=0,c.windbase=0}for(var b=0;b<this.cell.length;b++){var c=this.cell[b];1===c.ques&&0!==c.qdir&&c.setWindAround()}}},LineGraph:{enabled:!0},BoardExec:{adjustBoardData:function(a,b){if(this.adjustCellArrow(a,b),a&this.TURNFLIP)for(var c=this.getTranslateDir(a),d=this.board.borderinside(b.x1,b.y1,b.x2,b.y2),e=0;e<d.length;e++){var f,g=d[e];f=c[g.qsub-10],f&&g.setQsub(f+10)}}},Graphic:{irowake:!0,cellcolor_func:"ques",gridcolor_type:"LIGHT",errbcolor1_type:"DARK",paint:function(){this.drawBGCells(),this.drawDashedGrid(),this.drawShadedCells(),this.drawCellArrows(),this.drawLines(),this.drawPekes(),this.drawBorderAuxDir(),this.drawChassis(),this.drawTarget()},getCellArrowColor:function(a){return 0===a.ques?this.quescolor:"white"},drawBorderAuxDir:function(){var a=this.vinc("border_dirsub","crispEdges"),b=.1*this.cw;a.lineWidth=.1*this.cw,a.strokeStyle=this.borderQsubcolor2;for(var c=this.range.borders,d=0;d<c.length;d++){var e=c[d],f=e.bx*this.bw,g=e.by*this.bh,h=e.qsub-10;if(a.vid="b_daux_"+e.id,h>=1&&8>=h){switch(a.beginPath(),h){case e.UP:a.setOffsetLinePath(f,g,2*-b,+b,0,-b,2*+b,+b,!1);break;case e.DN:a.setOffsetLinePath(f,g,2*-b,-b,0,+b,2*+b,-b,!1);break;case e.LT:a.setOffsetLinePath(f,g,+b,2*-b,-b,0,+b,2*+b,!1);break;case e.RT:a.setOffsetLinePath(f,g,-b,2*-b,+b,0,-b,2*+b,!1)}a.stroke()}else a.vhide()}}},Encode:{decodePzpr:function(a){this.decodeNagare()},encodePzpr:function(a){this.encodeNagare()},decodeNagare:function(){var a=0,b=0,c=this.outbstr,d=this.board;for(b=0;b<c.length;b++){var e=d.cell[a],f=c.charAt(b);if(this.include(f,"1","9")){var g=parseInt(f,10);e.ques=g/5|0,e.qdir=g%5}else this.include(f,"a","z")&&(a+=parseInt(f,36)-10);if(a++,!d.cell[a])break}this.outbstr=c.substr(b+1)},encodeNagare:function(){for(var a="",b=0,c=this.board,d=0;d<c.cell.length;d++){var e="",f=c.cell[d],g=f.ques,h=f.qdir;1===g||h>=1&&4>=h?e=(5*g+h).toString(10):b++,0===b?a+=e:(e||26===b)&&(a+=(9+b).toString(36)+e,b=0)}b>0&&(a+=(9+b).toString(36)),this.outbstr+=a}},FileIO:{decodeData:function(){this.decodeCell(function(a,b){if("."!==b){var c={u:1,d:2,l:3,r:4,N:5,U:6,D:7,L:8,R:9}[b];a.ques=c/5|0,a.qdir=c%5}}),this.decodeBorder(function(a,b){var c=b.charAt(b.length-1);c>="a"&&"z">=c&&("u"===c?a.qsub=11:"d"===c?a.qsub=12:"l"===c?a.qsub=13:"r"===c&&(a.qsub=14),b=b.substr(0,b.length-1)),""!==b&&"0"!==b&&("-"===b.charAt(0)?(a.line=-b-1,a.qsub=2):a.line=+b)})},encodeData:function(){this.encodeCell(function(a){if(1===a.ques||a.qdir>=1&&a.qdir<=4){var b=5*a.ques+a.qdir;return["u ","d ","l ","r ","N ","U ","D ","L ","R "][b-1]}return". "}),this.encodeBorder(function(a){var b="";return 2===a.qsub?b+=""+(-1-a.line):a.line>0&&(b+=""+a.line),a.qsub>=11&&(b+=["u","d","l","r"][a.qsub-11]),""!==b?b+" ":"0 "})}},AnsCheck:{checklist:["checkLineExist+","checkArrowAgainst","checkLineOnShadeCell","checkCrossLine+","checkBranchLine+","checkAcrossArrow","checkLineArrowDirection","checkLineWindDirection","checkAcrossWind","checkAllArrow","checkDeadendLine++","checkOneLoop"],checkArrowAgainst:function(){for(var a=this.board.cell,b=0;b<a.length;b++){var c=a[b],d=c.wind&(15^[0,1,2,4,8][c.qdir]);if(0!==c.qdir&&1!==c.ques&&d){if(this.failcode.add("arAgainstWind"),this.checkOnly)break;this.setCellErrorToWindBase(c,d)}}},checkAcrossWind:function(){for(var a=this.board.cell,b=0;b<a.length;b++){var c=a[b],d=0!==(3&c.wind)&&2===c.isLineStraight(),e=0!==(12&c.wind)&&1===c.isLineStraight();if(d||e){if(this.failcode.add("lrAcrossWind"),this.checkOnly)break;this.setCellErrorToWindBase(c,c.wind&((d?3:0)|(e?12:0)))}}},checkAcrossArrow:function(){this.checkAllCell(function(a){var b=a.adjborder;return(1===a.qdir||2===a.qdir)&&(b.left.isLine()||b.right.isLine())||(3===a.qdir||4===a.qdir)&&(b.top.isLine()||b.bottom.isLine())},"lrAcrossArrow")},checkAllArrow:function(){this.checkAllCell(function(a){return 0===a.ques&&a.qdir>0&&0===a.lcnt},"arNoLine")},checkLineWindDirection:function(){for(var a=this.getTraceInfo(),b=0;b<a.length;b++){var c=a[b].blist;if(0!==c.length){if(this.failcode.add("lrAgainstWind"),this.checkOnly)break;this.board.border.setnoerr();for(var d=0;d<c.length;d++)this.setBorderErrorToWindBase(c[d],c[d].wind)}}},checkLineArrowDirection:function(){for(var a=this.getTraceInfo(),b=0;b<a.length;b++){var c=a[b].clist;if(0!==c.length){if(this.failcode.add("lrAgainstArrow"),this.checkOnly)break;c.seterr(1)}}},setCellErrorToWindBase:function(a,b){var c;if(a.seterr(1),1&b)for(c=a;!c.isnull;){if(1===c.ques){c.seterr(1);break}c=c.adjacent.bottom}if(2&b)for(c=a;!c.isnull;){if(1===c.ques){c.seterr(1);break}c=c.adjacent.top}if(4&b)for(c=a;!c.isnull;){if(1===c.ques){c.seterr(1);break}c=c.adjacent.right}if(8&b)for(c=a;!c.isnull;){if(1===c.ques){c.seterr(1);break}c=c.adjacent.left}},setBorderErrorToWindBase:function(a,b){var c;if(a.seterr(1),1&b)for(c=a.sidecell[1];!c.isnull;){if(1===c.ques){c.seterr(1);break}c=c.adjacent.bottom}if(2&b)for(c=a.sidecell[0];!c.isnull;){if(1===c.ques){c.seterr(1);break}c=c.adjacent.top}if(4&b)for(c=a.sidecell[1];!c.isnull;){if(1===c.ques){c.seterr(1);break}c=c.adjacent.right}if(8&b)for(c=a.sidecell[0];!c.isnull;){if(1===c.ques){c.seterr(1);break}c=c.adjacent.left}},getTraceInfo:function(){if(this._info.trace)return this._info.trace;for(var a=[],b=0;b<this.board.linegraph.components.length;b++)a.push(this.searchTraceInfo(this.board.linegraph.components[b]));return this._info.trace=a},searchTraceInfo:function(a){for(var b=new this.klass.BorderList(a.getedgeobjs()),c=b.cellinside().filter(function(a){return 2!==a.lcnt}),d=0===c.length?b[0].sideobj[0]:c[0],e=d.getdir(d.pathnodes[0].nodes[0].obj,2),f=d.getaddr(),g=[],h=[],i=[],j=[],k={clist:new this.klass.CellList,blist:new this.klass.BorderList},l=0;;){if(f.oncell()){var m=f.getc();if(l>0&&m===d)break;m.qdir!==m.NDIR&&(m.qdir===e?g.push(m):h.push(m));var n=m.adjborder;if(l>0&&2!==m.lcnt)break;1!==e&&n.bottom.isLine()?e=2:2!==e&&n.top.isLine()?e=1:3!==e&&n.right.isLine()?e=4:4!==e&&n.left.isLine()&&(e=3)}else{var o=f.getb();if(!o.isLine())break;0!==o.wind&&(o.wind&[0,1,2,4,8][e]&&i.push(o),o.wind&[0,2,1,8,4][e]&&j.push(o))}f.movedir(e,1),l++}var p=1;return p=g.length<h.length?1:g.length>h.length?2:i.length<j.length?1:2,k.clist.extend(1===p?g:h),k.blist.extend(1===p?i:j),k}},FailCode:{arNoLine:["線が通っていない矢印があります。","A line doesn't go through some arrows."],arAgainstWind:["矢印の向きが風の指示と合っていません。","The direction of the arrow is against the wind."],lrAcrossWind:["線が風で流されずに横切っています。","The line passes across the wind."],lrAcrossArrow:["線が矢印を横切っています。","The line passes across an arrow."],lrAgainstWind:["線が風上に向かって進んでいます。","The line passes against the wind."],lrAgainstArrow:["線が矢印に反して進んでいます。","The line passes against an arrow."]}});
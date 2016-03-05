/*! @license pzpr.js v0.3.2 (c) 2009-2016 sabo2, MIT license
 *   https://bitbucket.org/sabo2/pzprv3 */
!function(){function a(a,b){if(a.length!==b.length)return!1;for(var c=0;c<b.length;c++)if(a[c]!==b[c])return!1;return!0}!function(a,b){"object"==typeof module&&module.exports?module.exports=[a,b]:pzpr.classmgr.makeCustom(a,b)}(["tapa"],{MouseEvent:{use:!0,redblk:!0,mouseinput:function(){this.puzzle.playmode?(this.mousestart||this.mousemove)&&this.inputcell_tapa():this.puzzle.editmode&&this.mousestart&&this.inputqnum_tapa()},inputcell_tapa:function(){var a=this.getcell();if(!a.isnull&&a!==this.mouseCell&&(null===this.inputData&&this.decIC(a),this.mouseCell=a,!a.numberRemainsUnshaded||0===a.qnums.length||1!==this.inputData&&(2!==this.inputData||"white"!==this.puzzle.painter.bcolor))){if(this.RBShadeCell&&1===this.inputData){this.firstCell.isnull&&(this.firstCell=a);var b=this.firstCell;if((2&b.bx^2&b.by)!==(2&a.bx^2&a.by))return}(1===this.inputData?a.setShade:a.clrShade).call(a),a.setQsub(2===this.inputData?1:0),a.draw()}},decIC:function(a){1===this.puzzle.getConfig("use")?"left"===this.btn?this.inputData=a.isUnshade()?1:0:"right"===this.btn&&(this.inputData=1!==a.qsub?2:0):2===this.puzzle.getConfig("use")&&(a.numberRemainsUnshaded&&0!==a.qnums.length?this.inputData=1!==a.qsub?2:0:"left"===this.btn?a.isShade()?this.inputData=2:1===a.qsub?this.inputData=0:this.inputData=1:"right"===this.btn&&(a.isShade()?this.inputData=0:1===a.qsub?this.inputData=1:this.inputData=2))},inputqnum_tapa:function(){var a=this.getcell();a.isnull||a===this.mouseCell||(a!==this.cursor.getc()?this.setcursor(a):this.inputqnum_tapa_main(a),this.mouseCell=a)},inputqnum_tapa_main:function(b){for(var c=b.qnum_states,d=0,e=0;e<c.length;e++)if(a(b.qnums,c[e])){d=e;break}"left"===this.btn?d<c.length-1?d++:d=0:"right"===this.btn&&(d>0?d--:d=c.length-1),b.setNums(c[d]),b.draw()}},KeyEvent:{enablemake:!0,keyinput:function(a){this.key_inputqnum_tapa(a)},key_inputqnum_tapa:function(a){var b=this.cursor.getc(),c=b.qnums,d=[];if(a>="0"&&"8">=a||"-"===a){var e="-"!==a?+a:-2;if(this.prev===b&&c.length<=3)for(var f=0;f<c.length;f++)d.push(c[f]);if(d.push(e),d.length>1){for(var g=0,f=0;f<d.length;f++)g+=d[f]>=0?d[f]:1;if(d.length+g>8)d=[e];else for(var f=0;f<d.length;f++)if(0===d[f]){d=[e];break}}}else if("BS"===a){if(c.length>1)for(var f=0;f<c.length-1;f++)d.push(c[f])}else{if(" "!==a)return;d=[]}b.setNums(d),this.prev=b,b.draw()}},Cell:{minnum:0,qnums:null,qnum_states:function(){for(var a=[[],[-2],[0],[1],[2],[3],[4],[5],[6],[7],[8]],b=0,c=0;5>=c;c++)for(var d=0;5>=d;d++)b=(c>0?c:1)+(d>0?d:1),6>=b&&a.push([c>0?c:-2,d>0?d:-2]);for(var c=0;3>=c;c++)for(var d=0;3>=d;d++)for(var e=0;3>=e;e++)b=(c>0?c:1)+(d>0?d:1)+(e>0?e:1),5>=b&&a.push([c>0?c:-2,d>0?d:-2,e>0?e:-2]);return a.push([1,1,1,1]),a}(),numberRemainsUnshaded:!0,initialize:function(){this.qnums=[]},setNums:function(a){this.setQnums(a),this.setQans(0),this.setQsub(0)},setQnums:function(b){a(this.qnums,b)||(this.addOpeQnums(this.qnums,b),this.qnums=b)},addOpeQnums:function(b,c){a(b,c)||this.puzzle.opemgr.add(new this.klass.ObjectOperation2(this,b,c))},getShadedLength:function(){var a=[],b=[],c="",d=this.bx,e=this.by,f=this.board;d>f.minbx+1&&d<f.maxbx-1&&e>f.minby+1&&e<f.maxby-1?a=[-2,-2,0,-2,2,-2,2,0,2,2,0,2,-2,2,-2,0]:d===f.minbx+1?a=[0,-2,2,-2,2,0,2,2,0,2]:e===f.minby+1?a=[2,0,2,2,0,2,-2,2,-2,0]:d===f.maxbx-1?a=[0,-2,-2,-2,-2,0,-2,2,0,2]:e===f.maxby-1&&(a=[2,0,2,-2,0,-2,-2,-2,-2,0]);for(var g=0;g<a.length;g+=2){var h=this.relcell(a[g],a[g+1]);h.isnull||(c+=""+(h.isShade()?1:0))}var i=c.split(/0+/);if(i.length>0){0===i[0].length&&i.shift(),0===i[i.length-1].length&&i.pop(),8===c.length&&i.length>1&&"1"===c.charAt(0)&&"1"===c.charAt(7)&&(i[0]+=i.pop());for(var j=0;j<i.length;j++)b.push(i[j].length)}return 0===b.length&&(b=[0]),b}},CellList:{allclear:function(a){this.common.allclear.call(this,a);for(var b=0;b<this.length;b++){var c=this[b];c.qnums.length>0&&(a&&c.addOpeQnums(c.qnums,[]),c.qnums=[])}}},"ObjectOperation2:Operation":{setData:function(a,b,c){this.bx=a.bx,this.by=a.by,this.old=b,this.val=c,this.property="qnums"},decode:function(a){if("CR"!==a.shift())return!1;this.bx=+a.shift(),this.by=+a.shift();var b=a.join(","),c=b.substr(1,b.length-2).split(/\],\[/);if(0===c[0].length)this.old=[];else{this.old=c[0].split(/,/);for(var d=0;d<this.old.length;d++)this.old[d]=+this.old[d]}if(0===c[1].length)this.val=[];else{this.val=c[1].split(/,/);for(var d=0;d<this.val.length;d++)this.val[d]=+this.val[d]}return!0},toString:function(){return["CR",this.bx,this.by,"["+this.old.join(",")+"]","["+this.val.join(",")+"]"].join(",")},isModify:function(b){return b.property===this.property&&b.bx===this.bx&&b.by===this.by&&a(b.val,this.old)?(b.val=this.val,!0):!1},undo:function(){this.exec(this.old)},redo:function(){this.exec(this.val)},exec:function(a){var b=this.puzzle,c=b.board.getc(this.bx,this.by);c.setQnums(a),c.draw(),b.checker.resetCache()}},OperationManager:{addExtraOperation:function(){this.operationlist.push(this.klass.ObjectOperation2)}},AreaShadeGraph:{enabled:!0},Graphic:{paint:function(){this.drawBGCells(),this.drawDotCells(!1),this.drawGrid(),this.drawShadedCells(),this.drawTapaNumbers(),this.drawChassis(),this.drawTarget()},drawTapaNumbers:function(){for(var a=this.vinc("cell_tapanum","auto"),b=this.bw,c=this.bh,d=this.fontsizeratio[0],e=[{option:{ratio:[d]},pos:[{x:0,y:0}]},{option:{ratio:[.7*d]},pos:[{x:-.4,y:-.4},{x:.4,y:.4}]},{option:{ratio:[.6*d]},pos:[{x:-.5,y:-.4},{x:0,y:.4},{x:.5,y:-.4}]},{option:{ratio:[.5*d]},pos:[{x:0,y:-.5},{x:.55,y:0},{x:0,y:.5},{x:-.55,y:0}]}],f=this.range.cells,g=0;g<f.length;g++){var h=f[g],i=h.bx,j=h.by,k=h.qnums,l=k.length;a.fillStyle=this.getNumberColor(h);for(var m=0;4>m;m++)if(a.vid="cell_text_"+h.id+"_"+m,l>m&&-1!==k[m]){var n=e[l-1],o=(i+n.pos[m].x)*b,p=(j+n.pos[m].y)*c,q=k[m]>=0?""+k[m]:"?";this.disptext(q,o,p,n.option)}else a.vhide()}}},Encode:{decodePzpr:function(a){this.decodeNumber_tapa()},encodePzpr:function(a){this.encodeNumber_tapa()},decodeNumber_tapa:function(){var a=0,b=0,c=this.outbstr,d=this.board;for(b=0;b<c.length;b++){var e=d.cell[a],f=c.charAt(b);if(this.include(f,"0","8"))e.qnums=[parseInt(f,10)];else if("9"===f)e.qnums=[1,1,1,1];else if("."===f)e.qnums=[-2];else if(this.include(f,"a","f")){var g=parseInt(c.substr(b,2),36),h=[];g>=360&&396>g?(g-=360,h=[0,0],h[0]=g/6|0,g-=6*h[0],h[1]=g):g>=396&&460>g?(g-=396,h=[0,0,0],h[0]=g/16|0,g-=16*h[0],h[1]=g/4|0,g-=4*h[1],h[2]=g):g>=460&&476>g&&(g-=460,h=[0,0,0,0],h[0]=g/8|0,g-=8*h[0],h[1]=g/4|0,g-=4*h[1],h[2]=g/2|0,g-=2*h[2],h[3]=g);for(var i=0;4>i;i++)0===h[i]&&(h[i]=-2);e.qnums=h,b++}else f>="g"&&"z">=f&&(a+=parseInt(f,36)-16);if(a++,!d.cell[a])break}this.outbstr=c.substr(b+1)},encodeNumber_tapa:function(){for(var b=0,c="",d=this.board,e=0;e<d.cell.length;e++){var f="",g=d.cell[e].qnums;1===g.length?f=-2===g[0]?".":g[0].toString(10):2===g.length?f=(6*(g[0]>0?g[0]:0)+(g[1]>0?g[1]:0)+360).toString(36):3===g.length?f=(16*(g[0]>0?g[0]:0)+4*(g[1]>0?g[1]:0)+(g[2]>0?g[2]:0)+396).toString(36):4===g.length?f=a(g,[1,1,1,1])?"9":(8*(g[0]>0?1:0)+4*(g[1]>0?1:0)+2*(g[2]>0?1:0)+(g[3]>0?1:0)+460).toString(36):b++,0===b?c+=f:(f||20===b)&&(c+=(15+b).toString(36)+f,b=0)}b>0&&(c+=(15+b).toString(36)),this.outbstr+=c}},FileIO:{decodeData:function(){this.decodeCellQnumAns_tapa()},encodeData:function(){this.encodeCellQnumAns_tapa()},decodeCellQnumAns_tapa:function(){this.decodeCell(function(a,b){if("#"===b)a.qans=1;else if("+"===b)a.qsub=1;else if("."!==b){a.qnums=[];for(var c=b.split(/,/),d=0;d<c.length;d++)a.qnums.push("-"!==c[d]?+c[d]:-2)}})},encodeCellQnumAns_tapa:function(){this.encodeCell(function(a){if(a.qnums.length>0){for(var b=[],c=0;c<a.qnums.length;c++)b.push(a.qnums[c]>=0?""+a.qnums[c]:"-");return b.join(",")+" "}return 1===a.qans?"# ":1===a.qsub?"+ ":". "})}},AnsCheck:{checklist:["checkShadeCellExist+","check2x2ShadeCell","checkCountOfClueCell","checkConnectShade+"],checkCountOfClueCell:function(){this.checkAllCell(function(a){if(0===a.qnums.length)return!1;var b=a.getShadedLength();if(a.qnums.length!==b.length)return!0;for(var c=!0,d=0,e=a.qnums.length;e>d;d++){for(var f=d,g=d+b.length;g>f&&!(a.qnums[f%e]>=0&&a.qnums[f%e]!==b[f-d]);f++);if(f===g){c=!1;break}}return c},"ceTapaNe")}},FailCode:{ceTapaNe:["数字と周囲の黒マスの長さが異なっています。","The number is not equal to the length of surrounding shaded cells."]}})}();
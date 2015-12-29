/*! @license pzpr.js v3.5.2 (c) 2009-2015 sabo2, MIT license
 *   https://bitbucket.org/sabo2/pzprv3 */
pzpr.classmgr.makeCustom(["hanare"],{MouseEvent:{mouseinput:function(){this.owner.playmode?this.btn.Left?this.mousestart?this.inputqnum_hanare():this.mousemove&&this.inputDot():this.btn.Right&&(this.mousestart||this.mousemove)&&this.inputDot():this.owner.editmode&&(this.mousestart||this.mousemove?this.inputborder():this.mouseend&&this.notInputted()&&this.inputqnum_hanare())},inputqnum_hanare:function(){var a=this.getcell();if(!a.isnull&&a!==this.mouseCell){var b=a.setNum_hanare(1);null!==b&&(this.inputData=-1===b?0:1,this.mouseCell=a,a.draw())}},inputDot:function(){var a=this.getcell();a.isnull||a===this.mouseCell||-1!==a.qnum||(null===this.inputData&&(this.inputData=1===a.qsub?0:1),a.setAnum(-1),a.setQsub(1===this.inputData?1:0),this.mouseCell=a,a.draw())}},Cell:{setNum_hanare:function(a){if(a>=0){var b=this.owner,c=b.board.rooms;if(a=c.getCntOfRoomByCell(this),a>this.getmaxnum())return null;for(var d=c.getClistByCell(this),e=null,f=0;f<d.length;f++)if(d[f].isNum()){e=d[f];break}if(this===e)a=b.playmode?-2:-1;else if(null!==e){if(b.playmode&&-1!==e.qnum)return null;e.setNum(b.playmode?-2:-1),e.draw()}else 1===this.qsub&&(a=-1)}return this.setNum(a),a}},Board:{qcols:8,qrows:8,hasborder:1},AreaRoomManager:{enabled:!0},Graphic:{gridcolor_type:"DLIGHT",dotcolor_type:"PINK",paint:function(){this.drawBGCells(),this.drawGrid(),this.drawDotCells(!0),this.drawNumbers(),this.drawBorders(),this.drawChassis()}},Encode:{decodePzpr:function(){this.decodeBorder(),this.decodeNumber16()},encodePzpr:function(){this.encodeBorder(),this.encodeNumber16()}},FileIO:{decodeData:function(){this.decodeBorderQues(),this.decodeCellQnum(),this.decodeCellAnumsub()},encodeData:function(){this.encodeBorderQues(),this.encodeCellQnum(),this.encodeCellAnumsub()}},AnsCheck:{checklist:["checkDoubleNumber","checkAnsNumberAndSize","checkDiffNumber","checkNoNumber"],checkDiffNumber:function(){function a(a){d++,a.isNum()&&(a.isValidNum(a)?(null!==b&&Math.abs(c-a.getNum())!==d&&(this.failcode.add("nmDiffDistNe"),e=!1,b.seterr(1),a.seterr(1)),b=a,c=a.getNum(),d=-1):b=null)}for(var b,c,d,e=!0,f=this.owner.board,g=f.minbx+1;g<=f.maxbx-1;g+=2){b=null;for(var h=f.minby+1;h<=f.maxby-1;h+=2)if(a.call(this,f.getc(g,h)),!e&&this.checkOnly)return}for(var h=f.minby+1;h<=f.maxby-1;h+=2){b=null;for(var g=f.minbx+1;g<=f.maxbx-1;g+=2)if(a.call(this,f.getc(g,h)),!e&&this.checkOnly)return}},checkAnsNumberAndSize:function(){for(var a=this.getRoomInfo(),b=1;b<=a.max;b++){for(var c=a.area[b].clist,d=-1,e=0;e<c.length;e++)if(c[e].isNum()){d=c[e].getNum();break}if(-1!==d&&d!==c.length){if(this.failcode.add("bkSizeNe"),this.checkOnly)break;c.seterr(1)}}}},FailCode:{bkNoNum:["数字の入っていない部屋があります。","A room has no numbers."],bkNumGe2:["1つの部屋に2つ以上の数字が入っています。","A room has plural numbers."],bkSizeNe:["数字と部屋の大きさが違います。","The size of the room is not equal to the number."],nmDiffDistNe:["２つの数字の差とその間隔が正しくありません。","The distance of the paired numbers is not equal to the diff of them."]}});
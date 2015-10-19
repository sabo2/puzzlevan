
var translation = {
	'&File'                    : 'ファイル',
	'&New Board'               : '新規盤面作成',
	'&Open File'               : 'ファイルを開く',
	'&Save File As...'         : 'ファイルを保存...',
	'&PUZ-PRE format'          : 'ぱずぷれ形式',
	'pencilbox format (&text)' : 'Pencilbox形式',
	'pencilbox format (&XML)'  : 'Pencilbox(XML)形式',
	'&Import URL'              : 'URL入力',
	'&Export URL'              : 'URL出力',
	'Save Ima&ge'              : '画像保存',
	'&PNG Format (png)'        : 'PNG形式',
	'&Vector Format (SVG)'     : 'SVG形式',
	'Edit Puzzle &Properties'  : 'パズルのプロパティ',
	'Open Puzzle &List'        : 'パズル一覧を開く',
	'&Close Window'            : 'ウィンドウを閉じる',
	'&Quit Puzzlevan'          : 'Puzzlevanを終了',
	
	'&Edit'                : '編集',
	'Undo'                 : '取り消し',
	'Redo'                 : 'やり直し',
	'Editor Mode'          : '問題入力モード',
	'Answer Mode'          : '回答入力モード',
	'&Check Answer'        : '正答判定',
	'Erase Answer'         : '回答消去',
	'Erase Aux.Mark'       : '補助記号消去',
	'&Adjust the Board'    : '盤面の調整・回転・反転',
	'&Duplicate the Board' : '盤面の複製',
	
	'&View'                        : '表示',
	'Cell &Size'                   : 'セルのサイズ',
	'&Color Setting'               : '色の設定',
	'Color coding of line'         : '線の色分け',
	'Color coding of shaded block' : '黒マスの色分け　',
	'Paint as moving'              : '動かしたように描画',
	'Draw snake border'            : 'へびの境界線を描画',
	'Show cursor'                  : 'カーソルの表示',
	'Board font'                   : '盤面のフォント',
	'sens-serif'                   : 'ゴシック',
	'serif'                        : '明朝',
	
	'&Setting'                     : '設定',
	'Input type'                   : '入力方法',
	'LR button'                    : 'LRボタン',
	'One button'                   : '1ボタン',
	'Corner-side'                  : 'クリックした位置',
	'Pull-to-Input'                : '引っ張り入力',
	'Display'                      : '盤面の表示形式',
	'Circle'                       : '○',
	'Icebarn'                      : '■',
	'Original Type'                : 'ニコリ紙面形式',
	'Sokoban Type'                 : '倉庫番形式',
	'Waritai Type'                 : 'ワリタイ形式',
	'Line continueous check'       : '線の繋がりをチェック',
	'Block continueous check'      : '黒マスのつながりをチェック',
	'Check road'                   : '通り道のチェック',
	'Input background color'       : '背景色を入力可能にする',
	'Set Gray color automatically' : '正しい数字や文字をグレーにする',
	'Show overlapped number'       : '重複した数字を表示',
	'Slash with color'             : 'ループした斜線の色分け',
	'Allow enpty cell'             : '空白セルありでの正答判定を許可',
	'Enable direction aux. mark'   : '方向の補助記号を入力する',
	'Set line only between points' : '記号の間のみ線を入力可能にする',
	'Check lattice point'          : '格子点に記号がある場合は線を入力しない',
	'Ura-mashu'                    : '裏ましゅモード',
	'URL with padding'             : '空隙つきURLを出力する',
	'Disble set color'             : '色分けを無効化する',
	'Auto answer check'            : '自動正答判定',
	'Check multiple errors'        : '複数エラー検出有効',
	'Mouse button inversion'       : '左右のマウスボタンを逆にする',
	'&Language'                    : '言語',
	
	'&Window'            : 'ウィンドウ',
	'&Minimize'          : '最小化',
	'&Reload'            : '再読み込み',
	'Bring All to Front' : '全てのウィンドウを前面へ',
	
	'Help'             : 'ヘルプ',
	'How to Input'     : '入力方法',
	'Toggle DevTools'  : 'DevTool表示',
	'Toggle &DevTools' : 'DevTool表示',
};

module.exports = function(text){
	return translation[text] || text;
};
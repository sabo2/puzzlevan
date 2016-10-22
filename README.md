# Puzzlevan

## About Puzzlevan

Puzzlevan is a puzzle editor powered by [Electron](http://electron.atom.io).

This script is developed against HTML5 features and JavaScript.

Released files are [here](https://github.com/sabo2/puzzlevan/releases).

## Features

* Support >100 genres of puzzles (list is [here](https://github.com/sabo2/pzprv3/blob/master/docs/SupportedPuzzles.md))
* Automatically check the puzzle is correct or not
* Undo/Redo the board
* Open and save files (Pencilbox/PUZ-PRE v3) in local environment
 * Drag and Drop to open files (Windows/OS X)
 * Pass files to open via command line option
* Export and Import URL (Kanpen/PUZ-PRE v3)
* Save images of the board (png/svg)

## How to Build Puzzlevan

Puzzlevan depends on `pzpr` and includes `electron` and `electron-packager` as devDependency.

For v0.4.0, Puzzlevan is built against Electron v1.4.4. To build executable files for Window, Mac and Linux, use commands below.

```
$ npm install
$ npm start
```

If you run `npm run debug`, opening DevTools menu will appear.


## Releases

* 2016-10-22  v0.4.0  Add Uso-one, Arukone, Yin-yang, Nondango, Moon or Sun, Stostone, Onsen-meguri support and introduce trial mode
* 2016-03-13  v0.3.0  Introduce MDI interface
* 2015-12-30  v0.2.0  Add Dosun-Fuwari support
* 2015-10-25  v0.1.0  Initial release

## License

MIT

## Links

* [pzpr.js project - github](https://github.com/sabo2/pzprjs)
* [sabo2/pzprv3 - github](https://github.com/sabo2/pzprv3)
* [sabo2/puzzlevan - github](https://github.com/sabo2/puzzlevan)

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

In addition to cloning the source code, you should install `electron-packager`.
Also if you want to debug, you should use `electron-prebuilt`.

Currently, I have used electron-prebuilt v0.33.8.

```
$ npm install -g electron-prebuilt@0.33.8
$ npm install -g electron-packager
$ npm run pack
```

After that, you are able to run Puzzlevan on your local environment by using the following command.

```
$ electron .
```

## Releases

* 2015-10-25  v0.1.0  Initial release

## License

MIT

## Links

* [sabo2/pzprv3 - bitbucket](https://bitbucket.org/sabo2/pzprv3)
* [sabo2/puzzlevan - github](https://github.com/sabo2/puzzlevan)

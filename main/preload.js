
global.electron = require('electron');

global.__dirname = __dirname;
global.getBasename = (filename)=>require('path').basename(filename);

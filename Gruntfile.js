/* jshint node: true, browser: false */
module.exports = function(grunt){
  var pkg = grunt.file.readJSON('package.json'), deps = pkg.devDependencies;
  for(var plugin in deps){ if(plugin.match(/^grunt\-/)){ grunt.loadNpmTasks(plugin);}}
  
  var fs = require('fs');
  var banner_min  = fs.readFileSync('./src/js/common/banner_min.js',  'utf-8');
  var banner_full = fs.readFileSync('./src/js/common/banner_full.js', 'utf-8');

  grunt.initConfig({
    pkg: pkg,

    clean: ['dist/*'],

    concat: {
      release: {
        options: {
          banner: banner_full,
          process: true
        },
        files: [
          { src: require('./src/js/pzpr-ui.js').files, dest: 'dist/js/pzpr-ui.concat.js' }
        ]
      }
    },

    copy: {
      options: {
        process: function(content, srcpath){ return grunt.template.process(content);},
        noProcess: ['**/*.{png,gif,ico}'],
        mode: true
      },
      debug: {
        files : [
          { expand: true, cwd: 'src/js',  src: ['**/*.js'], dest: 'dist/js'  },
          { expand: true, cwd: 'src/css', src: ['*.css'],   dest: 'dist/css' },
          { expand: true, cwd: 'src/img', src: ['*'],       dest: 'dist/img' },
          { expand: true, cwd: 'src',     src: ['*'],       dest: 'dist' },
          { src: 'LICENSE.txt',          dest: 'dist/LICENSE.txt'      },
          { src: 'src/js/pzpr-ui.js',    dest: 'dist/js/pzpr-ui.js'     }
        ]
      },
      release: {
        files : [
          { expand: true, cwd: 'src/js/lib', src: ['**/*.js'], dest: 'dist/js/lib' },
          { expand: true, cwd: 'src/css',    src: ['*.css'],   dest: 'dist/css' },
          { expand: true, cwd: 'src/img',    src: ['*'],       dest: 'dist/img' },
          { expand: true, cwd: 'src',        src: ['*'],       dest: 'dist' },
          { src: 'LICENSE.txt',          dest: 'dist/LICENSE.txt'      }
        ]
      }
    },

    uglify: {
      release: {
        options: {
          banner: banner_min,
          report: 'min',
        },
        files: [
          { src: 'dist/js/pzpr-ui.concat.js', dest: 'dist/js/pzpr-ui.js' },
          { src: 'src/js/v3index.js',         dest: 'dist/js/v3index.js' },
        ]
      }
    },

    jshint: {
      options: {
        jshintrc: true
      },
      all: {
        src: [
          '*.js',
          'src/js/*.js',
          'src/js/ui/*.js'
        ]
      }
    }
  });
  
  grunt.registerTask('lint', ['newer:jshint:all']);
  grunt.registerTask('default', [        'clean',                   'copy:debug'                    ]);
  grunt.registerTask('release', ['lint', 'clean', 'concat:release', 'copy:release', 'uglify:release']);
};

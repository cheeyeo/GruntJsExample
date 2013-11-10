'use strict';
var path = require('path');
var LIVERELOAD_PORT = 35729;
var lrSnippet = require('connect-livereload')({port: LIVERELOAD_PORT});

var internalIp, lrSnippet;

lrSnippet = require('connect-livereload')({ port: LIVERELOAD_PORT });

var mountFolder;

mountFolder = function(connect, dir) {
  return connect.static(require('path').resolve(dir));
};

module.exports = function(grunt){
	"use strict";
	
	require("matchdep").filterDev("grunt-*").forEach(grunt.loadNpmTasks);
	
    grunt.initConfig({
			pkg: grunt.file.readJSON('package.json'),
			connect: {
				options: {
					port: 9000,
	        hostname: 'localhost',
				},
				livereload: {
	      	options: {
		        middleware: function(connect) {
		          return [
									lrSnippet, 
									mountFolder(connect, './'), 
									mountFolder(connect, 'build'),
									mountFolder(connect, 'tmp')
							];
		        }
		      }
				}
	    },
			htmlhint: {
			    build: {
			        options: {
			            'tag-pair': true,
			            'tagname-lowercase': true,
			            'attr-lowercase': true,
			            'attr-value-double-quotes': true,
			            'doctype-first': true,
			            'spec-char-escape': true,
			            'id-unique': true,
			            'head-script-disabled': true,
			            'style-disabled': true
			        },
			        src: ['index.html']
			    }
			},
			coffee: {
			   dist: {
			       files: [{
			           expand: true,
			           cwd: 'assets/js',
			           src: '{,*/}*.coffee',
			           dest: 'tmp/js',
			           ext: '.js'
			       }]
			   }
			},
			uglify: {
			    build: {
			        files: {
			            'tmp/assets/js/base.min.js': ['assets/**/*.js','tmp/js/**/*.js']
			        }
			    }
			},
			cssc: {
			    build: {
			        options: {
			            consolidateViaDeclarations: true,
			            consolidateViaSelectors:    true,
			            consolidateMediaQueries:    true
			        },
			        files: {
			            'tmp/assets/css/master.css': 'tmp/assets/css/master.css'
			        }
			    }
			},
			cssmin: {
			    build: {
			        src: 'tmp/assets/css/master.css',
			        dest: 'tmp/assets/css/master.css'
			    }
			},
			sass: {
			    build: {
			        files: {
			            'tmp/assets/css/master.css': 'assets/**/*.scss'
			        }
			    }
			},
			watch: {
			    html: {
			        files: ['index.html'],
			        tasks: ['htmlhint'],
							options: { livereload: true }
			    },
					scripts: {
			        files: [
			          'assets/js/**/*.coffee',
								'assets/js/**/*.js'
			        ],
			        tasks: ['build'],
							options: { livereload: true }
			    },
					sass: {
			        files: ['assets/sass/**/*.scss'],
			        tasks: ['build'],
							options: { livereload: true }
			    },
				  bower: {
							files: 'bower.json',
							tasks: ['build'],
							options: { livereload: true }
				  }
			},
	    bower: {
				install: {
		      options: {
		        targetDir: './assets',
						layout: 'byType',
		        install: true,
		        verbose: true,
		        cleanTargetDir: false,
		        cleanBowerDir: false,
		        bowerOptions: {}
		      }
		    }
			},
			//Clean tmp/dist Folders
	    clean:{
		    dev: 'tmp',
				dist: 'dist'
	    },
	    // copy
	    copy:{
		    main:{
			    files:[
						{expand: true, cwd: 'tmp/assets', src: ['**'], dest: 'dist/assets'}
					]
		    }
			}
    });

		grunt.registerTask('build', ['clean','sass','cssc','cssmin','bower','coffee','uglify','copy']);
		
		grunt.registerTask('server', ['build', 'connect:livereload','watch']);
		
		grunt.registerTask('default', ['server']);
};
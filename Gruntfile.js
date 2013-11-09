var internalIp, lrSnippet;

lrSnippet = require('connect-livereload')({
  port: 35729
});

internalIp = 'localhost';

var mountFolder;

mountFolder = function(connect, dir) {
  return connect["static"](require('path').resolve(dir));
};

module.exports = function(grunt){
	"use strict";
	
	require("matchdep").filterDev("grunt-*").forEach(grunt.loadNpmTasks);
	
    grunt.initConfig({
			pkg: grunt.file.readJSON('package.json'),
			connect: {
				livereload: {
	      	options: {
		        port: 9000,
		        hostname: internalIp,
		        middleware: function(connect) {
		          return [lrSnippet, mountFolder(connect, './'), mountFolder(connect, 'build')];
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
			uglify: {
			    build: {
			        files: {
			            'build/js/base.min.js': ['assets/js/base.js']
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
			            'build/css/master.css': 'build/css/master.css'
			        }
			    }
			},
			cssmin: {
			    build: {
			        src: 'build/css/master.css',
			        dest: 'build/css/master.css'
			    }
			},

			sass: {
			    build: {
			        files: {
			            'build/css/master.css': 'assets/sass/master.scss'
			        }
			    }
			},
			watch: {
			    html: {
			        files: ['index.html'],
			        tasks: ['htmlhint'],
							options: { livereload: true }
			    },
					js: {
			        files: ['assets/js/base.js'],
			        tasks: ['uglify'],
							options: { livereload: true }
			    },
					css: {
			        files: ['assets/sass/**/*.scss'],
			        tasks: ['buildcss'],
							options: { livereload: true }
			    },
				  bower: {
							files: 'bower.json',
							tasks: ['bower-install']
				  }
			},
			'bower-install': {
	      target: {
	        html: 'index.html' // point to your HTML file.
	      }
	    }
    });

		grunt.registerTask('build', ['uglify','sass','cssc','cssmin','bower-install']);
		
		grunt.registerTask('server', ['build', 'connect:livereload','watch']);
		
		grunt.registerTask('default', ['server']);
};
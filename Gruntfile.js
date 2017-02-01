/*global module*/
(function() {
	'use strict';

	module.exports = function(grunt) {
		var pkg = grunt.file.readJSON('bower.json');
		var pathConfig = {
			src: "src",
			tmp: ".tmp",
            tmptest: ".tmptest",
			componentName:"apiservice",
            dist: "dist",
            deploy: "deploy"            
		};
		grunt.initConfig({
			pathConfig: pathConfig,
			pkg: pkg,
			clean: {
				demo: {
					files: [{
						dot: true,
						src: [
							'<%= pathConfig.tmp %>/*'
						]
					}]
				},
                dist: {
                    files: [{
                        dot: true,
                        src: [
                            '<%= pathConfig.dist %>/*'
                        ]
                    }]
                },
                deploy: {
                    files: [{
                        dot: true,
                        src: [
                            '<%= pathConfig.deploy %>/*'
                        ]
                    }]
                }
			},
            uglify: {
                degug: {
                    options: {
                        beautify: true,
                        compress: false,
                        mangle: false,
                        preserveComments: 'all',
                        banner: '/*! <%= pkg.name %> <%= pkg.version %> <%= grunt.template.today("yyyy-mm-dd") %> */\n/*! <%= pkg.description %>*/\n'
                    },
                    files: {
                        '<%= pathConfig.dist %>/<%= pathConfig.componentName %>.js': [
                            '<%= pathConfig.src %>/**/module.js',
                            '<%= pathConfig.src %>/**/*.js',
                            '!<%= pathConfig.src %>/**/*.mock.js'
                        ]
                    }
                },
                dist: {
                    options: {
                        banner: '/*! <%= pkg.name %>. Version <%= pkg.version %>*/\n'
                    },
                    files: {
                        '<%= pathConfig.dist %>/<%= pathConfig.componentName %>.min.js': [
                            '<%= pathConfig.src %>/**/module.js',
                            '<%= pathConfig.src %>/**/*.js',
                            '!<%= pathConfig.src %>/**/*.mock.js'
                        ]
                    }
                }
            },            
			jshint: {
				all: [
					'!Gruntfile.js',
					'<%= pathConfig.src %>/{,*/}*.js'
				]
			}
		});

		grunt.loadNpmTasks('grunt-contrib-jshint');
		grunt.loadNpmTasks('grunt-contrib-clean');
        grunt.loadNpmTasks('grunt-contrib-uglify');        

        grunt.registerTask('build', [            
            'clean:dist',
            'uglify',
        ]);

	};
})();
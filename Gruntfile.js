"use strict";


var paths = {
        js: ['*.js', '!bower_components/**', 'models/*.js', 'routes/*.js'],
        jade: ['views/*'],
        css: ['!bower_components/**', 'public/*.css']
    };

module.exports = function (grunt) {

    // Module load
    grunt.loadNpmTasks('grunt-jslint');
    // Project Configuration
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        'jslint' : {
            server: {
                src: grunt.file.expand(paths.js),
                options: {
                    edition: 'latest'
                },
                directives: {
                    node: true,
                    todo: true,
                    nomen: true
                }
            }
        }
    });
/**
    grunt.registerTask('jslint', 'Apply JSLint check on js files', function() {
        var next = this.async();
        grunt.log.write('Loggin something...').ok();
        grunt.log.write('Loggin something...').error();
        var fileList = grunt.file.expand(paths.js);
        grunt.log.ok(fileList);
    });
**/
    grunt.registerTask('default', 'jslint');
};

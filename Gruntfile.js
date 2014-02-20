module.exports = function (grunt) {
    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        kmc: {
            concat: {
                options: {
                    depFilePath: 'modules.js',
                    packages: [
                        {
                            name: 'my',
                            charset: 'utf-8',
                            path: 'statics/src/'
                        }
                    ]
                },
                files: [
                    {
                        src: "statics/src/my/index.js",
                        dest: "statics/build-concat/my/index.js"
                    }
                ]
            },
            
            combo:{
                options: {
                    depFilePath: 'statics/build-combo/my/modules.js',
                    comboOnly: true,
                    fixModuleName:true,
                    comboMap: true,
                    packages: [
                        {
                            name: 'my',
                            charset: 'utf-8',
                            path: 'statics/build-combo/'
                        }
                    ]
                },
                files: [
                    {
                        expand: true,
                        cwd: 'statics/build-combo/',
                        src: [ '**/*.js' ]
                    }
                ]
            }
        },
        uglify: {
            options: {
                beautify: {
                    ascii_only: true
                }
            },
            concat: {
                files: [{
                    expand: true,
                    cwd: 'statics/build-concat/',
                    src: ['**/*.js', '!**/*-min.js'],
                    dest: 'statics/build-concat/',
                    ext:'-min.js'
                }]
            },
            combo:{
                files: [{
                    expand: true,
                    cwd: 'statics/build-combo/',
                    src: ['**/*.js', '!**/*-min.js'],
                    dest: 'statics/build-combo/',
                    ext:'-min.js'
                }]
            }
        },
        copy: {
            concat: {
                files: [
                    {
                        expand: true,
                        cwd: 'statics/src/',
                        src: ['**/*.css'],
                        dest: 'statics/build-concat/'
                    }
                ]
            },
            combo: {
                files: [
                    {
                        expand: true,
                        cwd: 'statics/src/',
                        src: ['**/*'],
                        dest: 'statics/build-combo/'
                    }
                ]
            }
        },
        cssmin: {
            concat: {
                expand: true,
                cwd: 'statics/src/',
                src: ['**/*.css'],
                dest: 'statics/build-concat/',
                ext: '-min.css'
            },
            combo: {
                expand: true,
                cwd: 'statics/src/',
                src: ['**/*.css'],
                dest: 'statics/build-combo/',
                ext: '-min.css'
            }
        },
        clean: ["build-concat/","build-combo/"]
    });

    return grunt.registerTask('default', ['copy','kmc', 'uglify',  'cssmin']);
};
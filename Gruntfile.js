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
                            path: 'src/'
                        }
                    ]
                },
                files: [
                    {
                        src: "src/my/index.js",
                        dest: "build-concat/my/index.js"
                    }
                ]
            },
            
            combo:{
                options: {
                    depFilePath: 'build-combo/my/modules.js',
                    comboOnly: true,
                    fixModuleName:true,
                    comboMap: true,
                    packages: [
                        {
                            name: 'my',
                            charset: 'utf-8',
                            path: 'build-combo/'
                        }
                    ]
                },
                files: [
                    {
                        expand: true,
                        cwd: 'build-combo/',
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
                    cwd: 'build-concat/',
                    src: ['**/*.js', '!*-min.js'],
                    dest: 'build-concat/',
                    ext:'-min.js'
                }]
            },
            combo:{
                files: [{
                    expand: true,
                    cwd: 'build-combo/',
                    src: ['**/*.js', '!*-min.js'],
                    dest: 'build-combo/',
                    ext:'-min.js'
                }]
            }
        },
        copy: {
            concat: {
                files: [
                    {
                        expand: true,
                        cwd: 'src/',
                        src: ['**/*.css'],
                        dest: 'build-concat/'
                    }
                ]
            },
            combo: {
                files: [
                    {
                        expand: true,
                        cwd: 'src/',
                        src: ['**/*'],
                        dest: 'build-combo/'
                    }
                ]
            }
        },
        cssmin: {
            concat: {
                expand: true,
                cwd: 'src/',
                src: ['**/*.css'],
                dest: 'build-concat/',
                ext: '-min.css'
            },
            combo: {
                expand: true,
                cwd: 'src/',
                src: ['**/*.css'],
                dest: 'build-combo/',
                ext: '-min.css'
            }
        },
        clean: ["build-concat/","build-combo/"]
    });

    return grunt.registerTask('default', ['copy','kmc', 'uglify',  'cssmin']);
};
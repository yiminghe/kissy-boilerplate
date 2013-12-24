module.exports = function(grunt) {
		require('load-grunt-tasks')(grunt);
	
    grunt.initConfig({
        kmc: {
            my: {
                options:{
	            		depFilePath: 'modules.js',
	            		packages: [
	                    {
	                        name: 'my',
	                        charset:'utf-8',
	                        path: 'src/'
	                    }
	                ],
                },
                files: [
                    {
                        src: "src/my/index.js",
                        dest: "build/my/index.js"
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
            my: {
                files: {
                    'build/my/index-min.js': ['build/my/index.js']
                }
            }
        },
        copy:{
            my:{
                files:[
                    {
                        expand:true,
				                cwd:'src/',
				                src:['**/*.css'],
				                dest:'build/'
                    }
                ]
            }
        },
        cssmin:{
            my:{
                expand:true,
                cwd:'src/',
                src:['**/*.css'],
                dest:'build/',
                ext:'-min.css'
            }
        },
        clean: ["build/"]
    });
    
    return grunt.registerTask('default', ['kmc', 'uglify','copy','cssmin']);
};
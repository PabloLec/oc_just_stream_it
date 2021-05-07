module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        concat: {
            js: {
                src: [
                    'src/js/topbar.js',
                    'src/js/fetcher.js',
                    'src/js/carousel.js',
                    'src/js/modal.js',
                ],
                dest: 'src/js/production.js',
            },
            css: {
                src: [
                    'src/css/carousel.css',
                    'src/css/main.css',
                    'src/css/modal.css',
                ],
                dest: 'src/css/production.css',
            },
        },
        uglify: {
            build: {
                src: 'src/js/production.js',
                dest: 'src/js/production.min.js',
            },
        },
        cssmin: {
            css: {
                src: 'src/css/production.css',
                dest: 'src/css/production.min.css',
            },
        },
        watch: {
            scripts: {
                files: ['src/js/*.js', 'src/css/*.css'],
                tasks: ['concat', 'uglify', 'cssmin'],
                options: {
                    spawn: false,
                },
            },
        },
    })

    grunt.loadNpmTasks('grunt-contrib-concat')
    grunt.loadNpmTasks('grunt-contrib-uglify')
    grunt.loadNpmTasks('grunt-contrib-cssmin')
    grunt.loadNpmTasks('grunt-contrib-watch')

    grunt.registerTask('default', ['concat', 'uglify', 'cssmin', 'watch'])
}

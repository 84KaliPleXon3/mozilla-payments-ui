module.exports = function(grunt) {

  grunt.initConfig({

    jshint: {
      options: {
        jshintrc: true,
      },
      all: ['public/**/*.js', 'test/**/*.js'],
    },

    devserver: {
      options: {
        base: 'styleguide/build',
        type: 'http',
        port: grunt.option('port') || 4000,
      },
      server: {}
    },

    'gh-pages': {
      options: {
        base: 'styleguide/build',
        message: 'Updating docs',
        repo: 'git@github.com:mozilla/payments-ui.git'
      },
      src: ['**']
    },

    sass: {
      options: {
        sourceMap: true
      },
      dist: {
        files: {
          'public/css/main.css': 'public/scss/main.scss'
        }
      }
    },

    // Styleguide builder task.
    cog: {
      styleguide: {
        src: 'styleguide',
        options: {
          sourcecodeSelector: 'main',
          templateGlobals: {
            'projectName': 'Payments UI Styleguide',
            // This is the path from the iframe folder to
            // the static dir.
            'appMedia': '../static'
          },
          templateConfig: {
            templatePaths: ['templates'],
          },
          copy: [
            // src is relative to the styleguide project example.
            {src: '../public/css/', target: 'static/css/'},
          ],
        }
      }
    },

    copy: {
      normalize: {
        cwd: 'node_modules/normalize.css/',
        src: 'normalize.css',
        dest: 'public/scss/lib/',
        ext: '.scss',
        expand: true,
      },
      braintree: {
        cwd: 'node_modules/braintree-web/dist',
        src: 'braintree.js',
        dest: 'public/lib/js/',
        expand: true,
      }
    }

  });

  grunt.loadNpmTasks('cog');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-devserver');
  grunt.loadNpmTasks('grunt-gh-pages');
  grunt.loadNpmTasks('grunt-sass');

  grunt.registerTask('default', ['jshint']);
  grunt.registerTask('build-docs', ['sass', 'cog']);
  grunt.registerTask('publish-docs', ['build-docs', 'gh-pages']);
};

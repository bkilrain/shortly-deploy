module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      options: {
        separator: ';',
      },
      deps: {
        src: [
          'public/lib/jquery.js',
          'public/lib/underscore.js',
          'public/lib/backbone.js',
          'public/lib/handlebars.js'
        ],
        dest: 'public/dist/deps.js'
      },
      client: {
        src: [
          'public/client/app.js',
          'public/client/link.js',
          'public/client/links.js',
          'public/client/linkView.js',
          'public/client/linksView.js',
          'public/client/createLinkView.js',
          'public/client/router.js'
        ],
        dest: 'public/dist/client.js'
      },  
    },

    mochaTest: {
      test: {
        options: {
          reporter: 'spec'
        },
        src: ['test/**/*.js']
      }
    },

    nodemon: {
      dev: {
        script: 'server.js'
      }
    },

    uglify: {
      client: {
        files: {
          'public/dist/client.min.js': ['public/dist/client.js']
        }
      },
      deps: {
        files: {
          'public/dist/deps.min.js': ['public/dist/deps.js']
        }
      }
    },

    eslint: {
      target: [
        'public/client/**/*.js',
        'app/**/*.js',
        './server-config.js',
        './server.js'
      ]
    },

    cssmin: {
      target: {
        files: {
          'public/dist/style.min.css': ['public/style.css']
        }
      }
    },

    watch: {
      scripts: {
        files: [
          'public/client/**/*.js',
          'public/lib/**/*.js',
        ],
        tasks: [
          'concat',
          'uglify'
        ]
      },
      css: {
        files: 'public/*.css',
        tasks: ['cssmin']
      }
    },

    shell: {
      prodServer: {
        command: 'git push live master'
      },
      mongo: {
        command: 'mongod'
      }
    },
    env: {
      server: {
        NODE_ENV: 'production'
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-eslint');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-nodemon');
  grunt.loadNpmTasks('grunt-env');

  grunt.registerTask('server-dev', function (target) {
    grunt.task.run([ 'nodemon', 'watch' ]);
  });

  ////////////////////////////////////////////////////
  // Main grunt tasksdasdsadasdasdasd
  ////////////////////////////////////////////////////

  grunt.registerTask('test', [
    'mochaTest'
  ]);

  grunt.registerTask('build', [
    'eslint',
    'concat:deps',
    'concat:client',
    'uglify:deps',
    'uglify:client',
    'cssmin'
  ]);

  grunt.registerTask('upload', function(n) {
    if (grunt.option('prod')) {
      console.log('prod');
      // add your production server task here
      grunt.task.run(['shell:prodServer']);
    } else if (grunt.option('server')) {
      console.log('start prod server');
      grunt.task.run(['env:server', 'server-dev']);
    } else {
      console.log(' no prod');
      grunt.task.run([ 'server-dev' ]);
    }
  });

  grunt.registerTask('deploy', [
    // add your deploy tasks here
    'test',
    'build',
    'upload'
  ]);


};

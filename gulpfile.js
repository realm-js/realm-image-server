var gulp = require("gulp");
var sourcemaps = require("gulp-sourcemaps");
var concat = require("gulp-concat");
var concatUtil = require('gulp-concat-util');

var _ = require('lodash')
var realm = require('realm-js');
var runSequence = require('run-sequence');
var spawn = require('child_process').spawn;
var uglify = require('gulp-uglify');
var rename = require("gulp-rename");
var prettify = require('gulp-jsbeautifier');
var node;

gulp.task('server', function() {
   if (node) node.kill()
   node = spawn('node', ['app.js'], {
      stdio: 'inherit'
   })
   node.on('close', function(code) {
      if (code === 8) {
         gulp.log('Error detected, waiting for changes...');
      }
   });
});

gulp.task("build", function(done) {
   return realm.transpiler2.universal("src/", "build/");
});

gulp.task('dist-backend', ['build'], function() {
   return gulp.src(["build/universal.js", "build/backend.js"])
      .pipe(concat("app.js"))
      .pipe(prettify({
         js: {
            max_preserve_newlines: 1
         }
      }))
      .pipe(gulp.dest("./dist/backend/"))
});

gulp.task('dist', ['dist-backend'], function() {

})

gulp.task('start', function() {
   return runSequence('build', function() {
      runSequence('server');
      gulp.watch(['src/**/*.js'], function() {

         return realm.transpiler2.universal("src/", "build/").then(function(changes) {
            runSequence('server')
         });
      });
   });
});


var gulp = require('gulp');
var typescript = require('gulp-tsc');
var runseq = require('run-sequence');
var spawn = require('child_process').spawn;
var mocha = require('gulp-mocha');

var paths = {
  tsPath: 'src/**/*.ts',
  jsPath: '',
  testPath: 'tests/**/*.ts'
};

var node;
gulp.task('execute', function() {
  if (node) node.kill();
  node = spawn('node', ['examples/01_simple_pubsub.js'], {stdio: 'inherit'});
  node.on('close', function(code) {
    if (code === 8) {
      gulp.log('Error detected, waiting for changes...');
    }
  });
});

gulp.task('build', function(cb) {
  return gulp.src(paths.tsPath)
    .pipe(typescript({
      emitError: false,
      target: 'es2017',
      sourceMap: true 
    }))
    .pipe(gulp.dest(paths.jsPath));
});

gulp.task('test', function(cb) {
  gulp.src(paths.testPath)
    .pipe(mocha({
      reporter: 'nyan'
    }));
});
 
gulp.task('default', function () {
  runseq('build', 'execute');
  gulp.watch('src/**/*.ts', function() {
    runseq('build', 'execute');
  });
});
 
var gulp = require('gulp');
var source = require('vinyl-source-stream'); // Used to stream bundle for further handling
var browserify = require('browserify');
var watchify = require('watchify');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');

var handleError = function(name, e){
    console.log('Error: ' + name + '\n' + e);
}

var bundle = function(watch){
    var bundler, rebundle;
    bundler = browserify('bin-front/main.js', {
        basedir: __dirname,
        debug: watch,
        cache: {}, packageCache: {}, fullPaths: watch // required to be true only for watchify
    });

    rebundle = function() {
        console.log('Rebuild');
        var stream = bundler.bundle();
        if (!watch) stream.pipe(uglify());
        stream.on('error', function(e){
            handleError('Browserify', e);
        });
        stream = stream.pipe(source('bundle.js'));
        return stream.pipe(gulp.dest('./public/js'));
    };

    if (watch) {
        bundler = watchify(bundler)
        bundler.on('update', rebundle);
    }
    return rebundle();
}

// I added this so that you see how to run two watch tasks
// gulp.task('css', function () {
//     gulp.watch('styles/**/*.css', function () {
//         return gulp.src('styles/**/*.css')
//         .pipe(concat('main.css'))
//         .pipe(gulp.dest('build/'));
//     });
// });

// clean file
gulp.task('clean', function() {
  return del([
      'public/js/bundle.js'
    ]);
});

// develope
gulp.task('dev', function(){
    bundle(true);
});

// production
gulp.task('prod', function(){
    bundle(false);
});

// gulp.task('default', ['product']);

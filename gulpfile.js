var gulp = require('gulp');
var source = require('vinyl-source-stream'); // Used to stream bundle for further handling
var browserify = require('browserify');
var watchify = require('watchify');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var rename = require('gulp-rename');

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

var concatJS = function(watch){
    console.log("concat");
    var tmp = gulp.src([
        './public/js/jquery.min.js',
        './public/js/plivo.min.js',
        './public/js/bootstrap.min.js',
        './node_modules/socket.io-client/socket.io.js',
        './node_modules/jquery/dist/jquery.min.js',
        './public/js/threejs/three.min.js',
        './public/js/threejs/StereoEffect.js',
        './public/js/threejs/DeviceOrientationControls.js',
        './public/js/threejs/OrbitControls.js',
        './public/js/threejs/ColladaLoader.js',
        './public/js/script.js',
        './public/js/bundle.js']
    )
    .pipe(concat('resultBundle.js'))
    .pipe(gulp.dest('./public/js'));

    if (!watch){
        tmp = tmp.pipe(rename('resultBundle.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./public/js'));
    }

    return tmp;
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
    bundle(true), concatJS(true);
});

// production
gulp.task('prod', function(){
    bundle(false), concatJS(false);
});

// gulp.task('default', ['product']);

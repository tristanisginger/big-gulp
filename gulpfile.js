// VARIABLEs \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
var gulp = require('gulp'),	
	sourcemaps = require('gulp-sourcemaps'),			// source map
	includer = require('gulp-html-ssi'),				// bundle html
	sass = require('gulp-sass'),						// scss to csss
	autoprefixer = require('gulp-autoprefixer'),		// cross browser css (-webkit, ms-, etc)
	cssnano = require('gulp-cssnano'),					// minify css
	concat = require('gulp-concat'),					// bundle files
	imagemin = require('gulp-imagemin'),				// minify images
	plumber = require('gulp-plumber'),					// error checking
	browserSync = require('browser-sync').create(),		// browsersync	
	runSequence = require('gulp-run-sequence');			// run tasks in sequence

// HTML \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
gulp.task('markup', function(){
	gulp.src('src/markup/**/*.html')
	.pipe(includer())									// compile includes and componenet
	.pipe(gulp.dest('build/'))
});

// SASS \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\ 
gulp.task('styles', function() {
    return gulp.src('src/styles/**/*.scss')
    	.pipe(plumber())								// stop gulp exiting on error
    	.pipe(sourcemaps.init())						// initialise sourcemap
        .pipe(sass())									// compile
        .pipe(autoprefixer('last 2 versions'))			// compatibilities
        .pipe(concat('build.css'))						// bundle   	
    	.pipe(cssnano())								// minify
        .pipe(sourcemaps.write('./'))						
        .pipe(gulp.dest('build/assets/styles/'))
        .pipe(browserSync.reload({
			stream: true
		}))
});

// IMAGES \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
gulp.task('imagemin', function(){
	return gulp.src('build/assets/images/**/*.+(png|jpg|jpeg|gif|svg)')
	.pipe(imagemin({									// minify
		interlaced: true
	}))
	.pipe(gulp.dest('build/assets/images/min'))
});

// BROWSERSYNC \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
gulp.task('browserSync', function() {
	browserSync.init({
		server: {
			baseDir: 'build'
		},
	})
})

// WATCH \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
gulp.task('watch', function(){
	gulp.watch('src/markup/**/*.html',['markup']);
	gulp.watch('src/styles/**/*.scss',['styles']);
	gulp.watch('build/*.html', browserSync.reload);
	gulp.watch('build/assets/styles/**/*.css', browserSync.reload);
});

// BIG GULP \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
gulp.task('default', function (callback) {
	runSequence(['markup', 'styles', 'browserSync', 'watch'],
		callback
	)
})
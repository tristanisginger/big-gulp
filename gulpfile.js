// VARIABLEs \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
var gulp = require("gulp"),
  sourcemaps = require("gulp-sourcemaps"),          // source map
  inject = require("gulp-inject"),                  // bundle html
  htmlPartial = require("gulp-html-partial"),       // partials wooo
  uglify = require("gulp-uglify"),                  // min js
  sass = require("gulp-sass"),                      // scss to css
  autoprefixer = require("gulp-autoprefixer"),      // cross browser css (-webkit, ms-, etc)
//  cssnano = require("gulp-cssnano"),                // minify css
  concat = require("gulp-concat"),                  // bundle files
//  imagemin = require("gulp-imagemin"),              // minify images
  plumber = require("gulp-plumber"),                // error checking
  browserSync = require("browser-sync").create(),   // browsersync
  runSequence = require("run-sequence"),            // run tasks in sequence
  browserify = require('gulp-browserify'),          // pull in js packages like require
  babel = require("gulp-babel");

var jsSrc = [
    // Vendor JS
    "node_modules/jquery/dist/jquery.min.js",
    "node_modules/bootstrap/dist/js/bootstrap.min.js",
    "node_modules/popper.js/dist/umd/popper.min.js",

    // Dev JS
    "src/scripts/app.js"
]

// HTML \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
gulp.task("fileinclude", function() {
  var injectFiles = gulp.src([
    "build/Assets/styles/build.css",
    "build/Assets/scripts/build.js"
  ]);

  var injectOptions = {
    addRootSlash: false,
    ignorePath: ["build"]
  };

  var partialOptions = {
    basePath: "src/components/",
    variablePrefix: "£$£"
  };

  gulp
    .src(jsSrc)
    .pipe(htmlPartial(partialOptions))
    .pipe(inject(injectFiles, injectOptions))
    
    .pipe(gulp.dest("build"));
});

// JS \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
gulp.task("scripts", function() {
  return gulp
    .src(["src/scripts/*.js",
])
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(concat("build.js"))
    .pipe(babel({ presets: ['@babel/env'] }))
    .pipe(browserify({
        insertGlobals : true
      }))
    //.pipe(uglify())
    .pipe(sourcemaps.write("./"))
    .pipe(gulp.dest("build/assets/scripts/"));

});

// SASS \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
gulp.task("styles", function() {
  return gulp
    .src("src/styles/main.scss")
    .pipe(plumber()) // stop gulp exiting on error
    .pipe(sourcemaps.init()) // initialise sourcemap
    .pipe(sass()) // compile
    .pipe(autoprefixer("last 2 versions")) // compatibilities
    .pipe(concat("build.css")) // bundle
    // .pipe(cssnano()) // minify
    .pipe(sourcemaps.write("./"))
    .pipe(gulp.dest("build/assets/styles/"))
    .pipe(
      browserSync.reload({
        stream: true
      })
    );
});

// IMAGES \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
// gulp.task('imagemin', function(){
// 	return gulp.src('build/assets/images/**/*.+(png|jpg|jpeg|gif|svg)')
// 	.pipe(imagemin({									// minify
// 		interlaced: true
// 	}))
// 	.pipe(gulp.dest('build/assets/images/min'))
// });

// BROWSERSYNC \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
gulp.task("browserSync", function() {
  browserSync.init({
    server: {
      baseDir: "build"
    }
  });
});

// WATCH \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
gulp.task("watch", function() {
  gulp.watch("src/*.html", ["fileinclude"]);
  gulp.watch("src/components/**/*.html", ["fileinclude"]);
  gulp.watch("src/components/**/*.js", ["scripts"]);
  gulp.watch("src/scripts/*.js", ["scripts"]);
  gulp.watch("src/styles/**/*.scss", ["styles"]);
  gulp.watch("src/styles/vendor/**/*.scss", ["styles"]);
  gulp.watch("src/styles/dev/**/*.scss", ["styles"]);
  gulp.watch("src/components/**/*.scss", ["styles"]);
  gulp.watch("build/*.html", browserSync.reload);
  gulp.watch("build/assets/scripts/**/*.js", browserSync.reload);
  gulp.watch("build/assets/styles/**/*.css", browserSync.reload);
});

// BIG GULP \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
gulp.task("default", function(callback) {
  runSequence(
    ["fileinclude", "styles", "scripts", "browserSync", "watch"],
    callback
  );
});

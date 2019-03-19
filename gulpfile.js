// VARIABLEs \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
var gulp = require("gulp"),
  sourcemaps = require("gulp-sourcemaps"),          // source map
  inject = require("gulp-inject"),                  // bundle html
  htmlPartial = require("gulp-html-partial"),       // partials wooo
  fileinclude = require("gulp-file-include"),       // bundle html
  uglify = require("gulp-uglify"),                  // min js
  sass = require("gulp-sass"),                      // scss to css
  autoprefixer = require("gulp-autoprefixer"),      // cross browser css (-webkit, ms-, etc)
  cssnano = require("gulp-cssnano"),                // minify css
  concat = require("gulp-concat"),                  // bundle files
  //imagemin = require("gulp-imagemin"),              // minify images
  plumber = require("gulp-plumber"),                // error checking
  browserSync = require("browser-sync").create(),   // browsersync
  runSequence = require("gulp-run-sequence"),       // run tasks in sequence
  babel = require("gulp-babel");

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
    .src(["src/*.html"])
    .pipe(
      fileinclude({
        prefix: "@@",
        basepath: "@file"
      })
    )
    .pipe(htmlPartial(partialOptions))
    .pipe(inject(injectFiles, injectOptions))
    
    .pipe(gulp.dest("build"));
});

// JS \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
gulp.task("scripts", function() {
  return gulp
    .src([

      
      "src/scripts/*.js",

    ])
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(concat("build.js"))
    .pipe(babel({ presets: ['@babel/env'] })) // #3. transpile ES2015 to ES5 using ES2015 preset
    .pipe(uglify())
    .pipe(sourcemaps.write("./"))
    .pipe(gulp.dest("build/assets/scripts/"));
  // .pipe(browserSync.reload({
  // 	stream: true
  // }))
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
    .pipe(cssnano()) // minify
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
  gulp.watch("src/scripts/**/*.js", ["scripts"]);
  gulp.watch("src/styles/**/*.scss", ["styles"]);
  gulp.watch("src/styles/2-plugins/**/*.scss", ["styles"]);
  gulp.watch("src/styles/3-base/**/*.scss", ["styles"]);
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

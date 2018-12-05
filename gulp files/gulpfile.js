/* GLOBAL VARIABLES START */
// Import the necessary gulp modules with the require function and supply the module name  a parameter
var gulp = require('gulp');
var cleanCSS = require('gulp-clean-css');
var gulpStylelint = require('gulp-stylelint');
var eslint = require('gulp-eslint');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var pump = require('pump');
var order = require('gulp-order');
var themeNameObj = require('config.json')('.gulp_theme_name.json');
var themeName = themeNameObj.theme_name;
var themeDirectory = '../wp-content/themes/';
var fullThemePath = themeDirectory + themeName + '/';
if(themeNameObj.theme_name !== ""){
  var config = require('config.json')(fullThemePath +'.gulpconfig.json');
  if(config.css){
  }else{
    console.log("Please check theme name in .gulp_theme_name.json");
    process.exit();
  }
    console.log("Tasks running for: " + themeName);
}else{
  console.log("Please provide a valid theme name in .gulp_theme_name.json!");
  process.exit();
}
var css = 'css';
var js = 'js';

/* GLOBAL VARIABLES END */

/** ___________________________VARIABLES START_____________________________ */

// MINIFY SOURCE VARS START

  // css
var minify_css_source_1 = fullThemePath + config.css.src_minify_lint[0];

  // js
var minify_js_source_1 = fullThemePath + config.js.src_minify_lint[0];

// MINIFY SOURCE VARS END

// MINIFY DEST VARS START

  // css
  var minified_css_dest = fullThemePath + config.css.dest_minify[0];

  // js
  var minified_js_dest = fullThemePath + config.js.dest_minify[0];

// MINIFY DEST VARS END


// CONCAT ORDER VARS START

  // css
  var concat_css_src = fullThemePath + config.css.src_concat;
  var concat_css_order_1 = config.css.src_concat_array;
  var concat_order_array_css = [];
  for(var i = 0; i < concat_css_order_1.length; i +=1 ){
    concat_css_order_1[i] = fullThemePath+concat_css_order_1[i];
  }

    // js
    var concat_js_order_1 = config.js.src_concat;
    var concat_order_array_js = [];
    for(var i = 0; i < concat_js_order_1.length; i +=1 ){
      concat_order_array_js.push(fullThemePath + concat_js_order_1[i]);
    }
// CONCAT ORDER VARS END
  

// CONCAT DEST VARS START

  // css
  var concat_dest_css = fullThemePath + config.css.dest_concat;
  // js
  var concat_dest_js = fullThemePath + config.js.dest_concat;

// CONCAT DEST VARS END

// LINT JS VARS START
  // css
  var lint_css_source_1 = fullThemePath + config.css.src_minify_lint[0];  
  // js
  var lint_js_source_1 = fullThemePath + config.js.src_minify_lint[0];
// LINT JS VARS END

/** ____________________________VARIABLES END______________________________ */


/*_______________________________CSS START___________________________________*/
/* CSS FUNCTIONS */
// Minify the CSS here
var css_minify_source_string = "Your minify CSS source: ";
var css_minify_dest_string = "Your minify CSS destination: ";
gulp.task('minify-css', function() {
  console.log(css_minify_source_string + minify_css_source_1);
  console.log(css_minify_dest_string + minified_css_dest);
  // Provide multipe sources to minify all in the array
    return gulp.src([minify_css_source_1])
    .pipe(cleanCSS({compatibility: 'ie8'}))
    // Give the destination folder path
    .pipe(gulp.dest(minified_css_dest));
});
//Concatinate the CSS here
var css_concat_source_string = "Your concatenate CSS source: ";
var css_concat_dest_string = "Your concatenate CSS destination: ";
gulp.task('concat-css', function() {
    console.log(css_concat_source_string + concat_css_order_1);
    console.log(css_concat_dest_string + concat_dest_css);
    // Provide multiple files paths in order to concatinate in order
    return gulp.src(concat_css_order_1)
    //.pipe(order(concat_css_order_1,{base:'./'}))
    // Provide the files name as a parameter
    .pipe(concat(config.css.combined_filename))
    // Give the destination folder path
    .pipe(gulp.dest(concat_dest_css));
});


//Linting the CSS here 
var css_lint_source_string = "Your lint CSS source: ";
gulp.task('lint-css', function lintCssTask() {
  console.log(css_lint_source_string + lint_css_source_1);  
  return gulp.src(lint_css_source_1)
    .pipe(gulpStylelint({
      failAfterError: true,
      reporters: [
        {formatter: 'string', console: true}
      ]
    }));
});


/* _______________________________ CSS END _______________________________ */




/* _______________________________ JAVASCRIPT START _______________________________ */
/* JAVASCRIPT FUNCTIONS */
//Minify the JS here
var js_minify_source_string = "Your minify JS source: ";
var js_minify_dest_string = "Your minify JS destination: ";
gulp.task('minify-js', function (cb) {
  console.log(js_minify_source_string + minify_js_source_1);
  console.log(js_minify_dest_string + minified_js_dest);
  pump([
        // provide a source where to pick the files to minify 
        gulp.src([minify_js_source_1]),
        uglify(),
        // provide the destination where it will put minified files
        gulp.dest(minified_js_dest)
    ],
    cb
  );
});

//Concatinate the JS here
var js_concat_source_string = "Your concatenation JS sources: ";
var js_concat_dest_string = "Your concatenation JS destination: ";
gulp.task('concat-js', function() {
  console.log(js_concat_source_string + concat_order_array_js);
  console.log(js_concat_dest_string + concat_dest_js);
  // provide a source where to pick the files to concat and will concatinate the files in order in which the are supplied in the array 
  return gulp.src(concat_order_array_js)
    .pipe(concat(config.js.combined_filename))
    .pipe(gulp.dest(concat_dest_js));
});

//Linting the JS here


var js_lint_source_string = "Your lint JS sources: ";
gulp.task('lint-js', () => {
    console.log(js_lint_source_string + lint_js_source_1);
  // ESLint ignores files with "node_modules" paths. 
  // So, it's best to have gulp ignore the directory as well. 
  // Also, Be sure to return the stream from the task; 
  // Otherwise, the task may end before the stream has finished. 
  return gulp.src(lint_js_source_1)
      // eslint() attaches the lint output to the "eslint" property 
      // of the file object so it can be used by other modules. 
      .pipe(eslint())
      // eslint.format() outputs the lint results to the console. 
      // Alternatively use eslint.formatEach() (see Docs). 
      .pipe(eslint.format())
      // To have the process exit with an error code (1) on 
      // lint error, return the stream and pipe to failAfterError last. 
      .pipe(eslint.failAfterError());
});


/* _______________________________ JAVASCRIPT END _______________________________ */

// Watch everything
gulp.task('watch', function() {
	gulp.watch([minify_css_source_1], ['minify-css']);
	gulp.watch(minify_js_source_1, ['minify-js']);
  gulp.watch(lint_css_source_1, ['lint-css']);
  gulp.watch(lint_js_source_1, ['lint-js']);
  gulp.watch(concat_css_src, ['concat-css']);
	gulp.watch(concat_order_array_js, ['concat-js']);
});

// Default task (runs at initiation: gulp --verbose)
gulp.task(themeName, ['watch','minify-css','minify-js','lint-css','lint-js','concat-css','concat-js']);
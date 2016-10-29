// Import all gulp dependencies
var gulp = require('gulp');
var concat = require('gulp-concat')
var uglify = require('gulp-uglify')
var plumber = require('gulp-plumber')
var csso = require('gulp-csso')
var sass = require('gulp-ruby-sass')
var connect = require('gulp-connect')

// Production check flag
// Can be used when build is triggered for Production mode
global.isProd = false;

/**
 * Compile sass files into css
 * =============================================================================
 * This task will collect all the scss files and convert them into css files
 * after minification.
 *
 * @param  {[type]} 'scss'    [description]
 * @param  {[type]} function( [description]
 * @return {[type]}           [description]
 */
gulp.task('scss', function () {
  // Grabs the layout.scss file
  return sass('./assets/scss/index.scss', {
    style: global.isProd ? 'compressed' : '',
    // Grabs the dependencies for the file
    loadPath: [
      './assets/scss',
      './bower_components/bootstrap-sass/assets/stylesheets',
      './bower_components/font-awesome/scss',
      './bower_components/awesome-bootstrap-checkbox',
      // Add extra vendor libraries pulled by bower here

    ]
  })
  .pipe(plumber())
  // minify them
  .pipe(concat('main-styles.min.css'))
  .pipe(gulp.dest("build/public/css"));
});

/**
 * Minify all the vendor styles into one file
 * =============================================================================
 *
 * @param  {[type]} 'css'     [description]
 * @param  {[type]} function( [description]
 * @return {[type]}           [description]
 */
gulp.task('css', function() {
  // place code for your default task here
  gulp.src(
      ['./assets/css/*.css', './assets/css/**/*.css']
  )
  .pipe(plumber())
  // un-minified version
  .pipe(concat('vendor-styles.css'))
  .pipe(gulp.dest("build/public/css"))
  // minify them
  .pipe(concat('vendor-styles.min.css')).pipe(csso())
  .pipe(gulp.dest("build/public/css"));
});

/**
 * Copy the icons or fonts from the bower components folder to build folder
 * =============================================================================
 * @param  {[type]} 'icons'   [description]
 * @param  {[type]} function( [description]
 * @return {[type]}           [description]
 */
gulp.task('icons', function() { 
    return gulp.src([
      './bower_components/bootstrap-sass/assets/fonts/bootstrap/**.*',
      './bower_components/font-awesome/fonts/**.*'
    ]) 
    .pipe(gulp.dest('build/public/fonts')); 
});

/**
 * Copy the images or fonts from the bower components folder to build folder
 * =============================================================================
 * @param  {[type]} 'images'  [description]
 * @param  {[type]} function( [description]
 * @return {[type]}           [description]
 */
gulp.task('images', function() { 
    return gulp.src([
      './assets/images/**.*'
    ]) 
    .pipe(gulp.dest('build/public/images')); 
});


/**
 * Minify all javascript files
 * =============================================================================
 * This task will collect all the javascript files and minify them
 *
 * @param  {[type]} 'js'      [description]
 * @param  {[type]} function( [description]
 * @return {[type]}           [description]
 */
gulp.task('js', function() {
  // place code for your default task here
  gulp.src([
    // vendor library files
    './bower_components/jquery/dist/jquery.js',
    './bower_components/bootstrap-sass/assets/javascripts/bootstrap.js',
    // Add more based on the order of execution

    // custom application files
    './assets/js/*.js',
    './assets/js/**/*.js'])
    // un-minified version
    .pipe(concat('main-script.js'))
    .pipe(gulp.dest('build/public/js'))
    // minified version
    .pipe(concat('main-script.min.js')).pipe(uglify())
    .pipe(gulp.dest('build/public/js'));
});

/**
 * Watch for tasks that are liable to changes
 * =============================================================================
 * This task will trigger every time a file changes specified in the
 * configurations below.
 *
 * @param  {[type]} 'watch'   [description]
 * @param  {[type]} function( [description]
 * @return {[type]}           [description]
 */
gulp.task('watch', function() {
  // Watches for changes in js files and runs the browserify task
  gulp.watch([
    // Watch for changes under the js folder
    './assets/js/*.js',
    // Watch for changes under the js sub folders
    './assets/js/**/*.js'],
    ['js']);

  // Watches for changes in style.scss and runs the scss task
  gulp.watch([
    // Watch for changes of sccs files under the styles folder
    './assets/scss/*.scss',
    // Watch for changes of sccs files under the styles sub folder
    './assets/scss/**/*.scss'],
    ['scss']);
});

/**
 * Running the server
 * =============================================================================
 * This will run a temporary node server for testing
 *
 * @param  {[type]} 'deploy-dev' [description]
 * @param  {[type]} function     (             [description]
 * @return {[type]}              [description]
 */
gulp.task('deploy-dev', function () {
  connect.server({
    root: 'build',
    port: 4000,
  })
});

/**
 * Default task for gulp
 * =============================================================================
 * This task will run default when gulp command is issued on the command line.
 *
 * @param  {[type]} 'default' [description]
 * @param  {[type]} ['deploy-dev'   [description]
 * @param  {[type]} ['scss'   [description]
 * @param  {[type]} 'css'     [description]
 * @param  {[type]} 'icons'   [description]
 * @param  {[type]} 'images'  [description]
 * @param  {[type]} 'js'      [description]
 * @param  {[type]} 'watch']  [description]
 * @return {[type]}           [description]
 */
 gulp.task('default', ['deploy-dev', 'scss', 'css', 'icons', 'images', 'js',
 'watch']);

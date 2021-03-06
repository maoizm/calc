/**
 * Created by mao on 10.08.2016.
 */

// Gulp and autoloaded plugins
import gulp from 'gulp';
import plugins from 'gulp-load-plugins';

// Other build tools
import browser  from 'browser-sync';
import rimraf from 'rimraf';
import merge from 'merge-stream';

const PRODUCTION = false;

const $ = plugins({
  rename: {
    'gulp-clean-css': 'cleanCSS'
  }
});

/*  production folder structure

    dist/
      assets/
        css/      (flat)
        fonts/
        images/
        js/       (flat)
      app/
        .../
      app.(php|html)
*/

const config = {
  srcDir: 'src',
  destDir: 'dist',
  bowerRootDir: "bower_components"
};

const paths = {
  src: config.srcDir + '/**/*.html',
  dest: config.destDir,
  styles: {
    src: [
      config.srcDir + '/assets/scss/app.scss'
    ],
    include: [
      config.bowerRootDir + '/bootstrap-sass/assets/stylesheets'
    ],
    dest: config.destDir + '/assets/css/',
    destFile: 'app.css'
  },
  fonts: {
    src: [
      config.srcDir + '/assets/fonts/**/*',
      config.bowerRootDir + '/bootstrap-sass/assets/fonts/**/*'
    ],
    dest: config.destDir + '/assets/fonts/'
  },
  images: {
    src: [
      config.srcDir + '/assets/images/**/*'
    ],
    dest: config.destDir + '/assets/images/',
    faviconSrc: config.srcDir + '/assets/favicon.ico',
    faviconDest: config.destDir
  },
  scripts: {
    src: [
      config.srcDir + '/assets/js/**/*.js'
    ],
    lib: [
      config.bowerRootDir + '/jquery/dist/jquery.js',
      config.bowerRootDir + '/bootstrap-sass/assets/javascripts/bootstrap.js'
    ],
    dest: config.destDir + '/assets/js/',
    destFile: 'main.js'
  }
};


function sass() {
  return gulp.src(paths.styles.src)
      .pipe(
          $.if(!PRODUCTION, $.sourcemaps.init()))
      .pipe(
          $.sass({
            includePaths: paths.styles.include
          })
          .on('error', $.sass.logError))
      .pipe(
          $.if(PRODUCTION, $.cleanCSS({
            keepSpecialComments: false
          })))
      .pipe($.rename(function (path) {
            path.basename += ".min";
          }))
      .pipe(
          $.if(!PRODUCTION, $.sourcemaps.write()))
      .pipe(gulp.dest(paths.styles.dest));
}

function fonts() {
  return gulp.src(paths.fonts.src)
      .pipe(gulp.dest(paths.fonts.dest));
}

function images() {
  var imagesStream =  gulp.src(paths.images.src)
    .pipe(gulp.dest(paths.images.dest));
  var faviconStream =  gulp.src(paths.images.faviconSrc)
    .pipe(gulp.dest(paths.images.faviconDest));
  return merge(imagesStream, faviconStream);
}

function html() {
  return gulp.src(paths.src)
      .pipe(gulp.dest(paths.dest));
}

export function clean(done) {
  rimraf(paths.dest, done);
}

function scripts() {
  console.log([].concat(paths.scripts.src, paths.scripts.lib));
  return gulp.src([].concat(paths.scripts.lib,paths.scripts.src), { sourcemaps: true })
      .pipe(
          $.if(!PRODUCTION, $.sourcemaps.init()))
      .pipe(
          $.if(!PRODUCTION, gulp.dest(paths.scripts.dest)))
      .pipe($.concat(paths.scripts.destFile))
      .pipe(gulp.dest(paths.scripts.dest))              // main.js
      .pipe(
          $.if(PRODUCTION, $.uglify()))
      .pipe(
          $.rename(function (path) {
            path.basename += ".min";
          }))
      .pipe(
          $.if(!PRODUCTION, $.sourcemaps.write()))
      .pipe(gulp.dest(paths.scripts.dest));             // main.min.js
}

// Start a server with LiveReload to preview the site in

function server(done) {
  browser.init({
      server: {
        baseDir: 'dist'
      }
  });
  done();
}

function watch() {
  gulp.watch(paths.scripts.src, scripts).on('change', gulp.series(scripts, browser.reload));
  gulp.watch(paths.styles.src, sass).on('change', gulp.series(sass, browser.reload));
  gulp.watch(paths.src).on('change', gulp.series(html, browser.reload));
}

export function bump(aType = 'patch') {
  return gulp.src('./package.json')
      .pipe($.bump({
          type: aType
        }))
      .pipe(gulp.dest('./'));
}

const build = gulp.series(clean, gulp.parallel(fonts, sass, images, scripts, html), server, watch);
export {build};

/*
 *   Export a default task
 */

// export default styles_html_scripts;
export default build;


gulp.task('debugBowerNormalize', function() {
  var bower = require('main-bower-files');
  return gulp.src(bower(), { base: './bower_components' })
    .pipe($.bowerNormalize({ bowerJson: './bower.json' }))
    .pipe(gulp.dest('./dist/bower/'))
});

gulp.task('debugSrc', function() {
  var bower = require('main-bower-files');
  return gulp.src(
        bower({
          overrides: {
            "bootstrap-sass": {
              main: [
                './assets/stylesheets/_bootstrap.scss',
                './assets/stylesheets/bootstrap/**/*.scss',
                './javascripts/bootstrap.js'
              ]
            }
          }
        }),
        {
          base: './bower_components'
        })
      //.pipe($.debugStreams('1st'))
      .pipe($.bowerNormalize())
      .pipe($.debugStreams('2nd'))
      // .pipe($.sass({
      //     includePaths: ['bootstrap-sass/scss']
      //   }))
});
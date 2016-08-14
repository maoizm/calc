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
    concatName: 'app.min.css'
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
    dest: config.destDir + '/assets/js/'
  }
};


function sass() {
  //console.log(paths.styles.include);
  return gulp.src(paths.styles.src)
      .pipe($.sass({
            includePaths: paths.styles.include
          })
          .on('error', $.sass.logError))
      .pipe($.concat(paths.styles.concatName))
      .pipe($.cleanCSS({
            keepSpecialComments: false //, keepBreaks: true
          }))
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

const styles_html = gulp.series(clean, gulp.parallel(sass, fonts, html));

export function clean(done) {
  rimraf(paths.dest, done);
}

function scripts() {
  console.log([].concat(paths.scripts.src, paths.scripts.lib));
  return gulp.src([].concat(paths.scripts.src, paths.scripts.lib), { sourcemaps: true })
      .pipe($.uglify())
      .pipe($.concat('main.min.js'))
      .pipe(gulp.dest(paths.scripts.dest));
}

const styles_html_scripts = gulp.series(clean, gulp.parallel(sass, fonts, html, scripts));

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
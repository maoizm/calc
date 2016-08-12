/**
 * Created by mao on 10.08.2016.
 */

import gulp from 'gulp';
import plugins from 'gulp-load-plugins';
// import babel from 'gulp-babel';
// import sass from 'gulp-sass';
// import uglify from 'gulp-uglify';
// import concat from 'gulp-concat';
// import cleanCSS from 'gulp-clean-css';
import mainBowerFiles from 'main-bower-files';
import browser  from 'browser-sync';
import rimraf from 'rimraf';

const $ = plugins();   // loading all gulp plugins

const paths = {
    src:              'src/**/*.html',
    dest:             'dist/',
    dest_assets:      'dist/assets/',
    styles: {
        main:         'src/assets/scss/app.scss',
        includePaths:['bower_components/bootstrap-sass/assets/stylesheets'],
        src:          'src/assets/scss/**/*.scss',
        dest:         'dist/assets/css/',
        fonts_src:    'bower_components/bootstrap-sass/assets/fonts/**/*',
        fonts_dest:   'dist/assets/fonts/'
    },
    scripts: {
        src:          'src/assets/js/**/*.js',
        dest:         'dist/assets/js/'
    }
};

function clean(done) {
    rimraf(paths.dest, done);
}

function prepareBowerFiles() {
  return gulp.src(mainBowerFiles())
      .pipe(gulp.dest(paths.dest_assets));
}

export function styles() {
    var files=mainBowerFiles(/.*\.scss/);
    files.push(paths.styles.src);
    return gulp.src(paths.styles.main)
        .pipe($.sass({
            includePaths: paths.styles.includePaths
        }))
        //.pipe(cleanCSS({keepSpecialComments: 0}))
        .pipe(gulp.dest(paths.styles.dest));
}

export function fonts() {
    return gulp.src(paths.styles.fonts_src)
        .pipe(gulp.dest(paths.styles.fonts_dest));
}

export function scripts() {
    var files=mainBowerFiles(/.*\.js/);
    files.push(paths.scripts.src);
    return gulp.src(files, { sourcemaps: true })
        .pipe($.uglify())
        .pipe($.concat('main.min.js'))
        .pipe(gulp.dest(paths.scripts.dest));
}

export function html(){
    return gulp.src(paths.src)
        .pipe(gulp.dest(paths.dest));
}

// Start a server with LiveReload to preview the site in
export function server(done) {
    browser.init({
        server: {
            baseDir: 'dist'
        }
    });
    done();
}

export function watch() {
  gulp.watch(paths.scripts.src, scripts).on('change', gulp.series(scripts, browser.reload));
  gulp.watch(paths.styles.main, styles).on('change', gulp.series(styles, browser.reload));
  gulp.watch(paths.styles.src, styles).on('change', gulp.series(styles, browser.reload));
  gulp.watch(paths.src).on('change', gulp.series(html, browser.reload));
}

const build = gulp.series(clean, gulp.parallel(fonts, styles, scripts, html), server, watch);
export { build };

/*
 * Export a default task
 */
// export default build;
const build_bower = gulp.series(prepareBowerFiles);
export default build_bower;
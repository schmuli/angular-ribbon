var gulp = require('gulp');
var plugins = require('gulp-load-plugins')({
    rename: {
        'gulp-angular-templatecache': 'templateCache'
    }
});

var config = {
    destination: 'dist'
};

gulp.task('build', ['build/javascript']);

var debug = require('gulp-debug');
gulp.task('build/javascript', ['build/templates'], function () {
    return gulp.src(['ngRibbon.prefix', 'dist/templates.js', 'src/js/**/*.js', 'ngRibbon.suffix'])
        .pipe(plugins.sourcemaps.init())
        .pipe(plugins.angularOrder({ base: './src' }))
        .pipe(plugins.concat('ngRibbon.js'))
        .pipe(plugins.babel())
        .pipe(plugins.sourcemaps.write('.', { sourceRoot: '../' }))
        .pipe(gulp.dest(config.destination));
});

gulp.task('build/templates', function () {
    // TODO: Check https://github.com/kangax/html-minifier for additional options
    return gulp
        .src('src/**/*-template.html')
        .pipe(plugins.htmlmin({
            collapseWhitespace: true,
            removeComments: true
        }))
        .pipe(plugins.templateCache({
            root: 'ngRibbon/',
            standalone: true,
            module: 'ngRibbon.templates'
        }))
        .pipe(gulp.dest(config.destination));
});

gulp.task('build/styles', function () {
    return gulp.src('src/styles/**/*.css')
        .pipe(plugins.concat('styles.css'))
        .pipe(gulp.dest(config.destination));
});

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

gulp.task('debug', function (cb) {
    var esperanto = require('esperanto');
    var file = require('gulp-file');
    var header = require('gulp-header');
    var footer = require('gulp-footer');

    return esperanto
        .bundle({
            base: 'src/js/',
            entry: 'module.js'
        })
        .then(function (result) {
            var res = result.concat({
                intro: '',
                outro: ''
            });
            return file('result.js', res.code, {src: true})
                .pipe(plugins.babel())
                .pipe(header('(function () {\n'))
                .pipe(footer('\n}());\n'))
                .pipe(gulp.dest('research'));
        });
});

var debug = require('gulp-debug');
gulp.task('build/javascript', ['build/templates'], function () {
    return gulp.src(['ngRibbon.prefix', 'dist/templates.js', 'src/js/**/*.js', 'ngRibbon.suffix'])
        .pipe(plugins.sourcemaps.init())
        .pipe(plugins.angularOrder({base: './src'}))
        .pipe(plugins.concat('ngRibbon.js'))
        .pipe(plugins.babel())
        .pipe(plugins.sourcemaps.write('.', {sourceRoot: '../'}))
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

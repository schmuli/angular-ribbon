var gulp = require('gulp');
var esperanto = require('esperanto');
var debug = require('gulp-debug');
var plugins = require('gulp-load-plugins')({
    rename: {
        'gulp-angular-templatecache': 'templateCache',
        'gulp-add-src': 'src'
    }
});

var config = {
    destination: 'dist'
};

gulp.task('build', ['build/javascript']);

gulp.task('build/javascript', ['build/templates'], function (cb) {
    // TODO: SourceMaps
    // See https://github.com/babel/babel-library-boilerplate/blob/master/gulpfile.js#L69

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
            return plugins.file('ribbon.js', res.code, {src: true})
                .pipe(plugins.babel())
                .pipe(header())
                .pipe(footer())
                .pipe(gulp.dest(config.destination))
                .pipe(plugins.src.append('dist/templates.js'))
                .pipe(debug())
                .pipe(plugins.concat('ribbon.tml.js'))
                .pipe(gulp.dest(config.destination));
        });
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
        .pipe(header())
        .pipe(footer())
        .pipe(gulp.dest(config.destination));
});

gulp.task('build/styles', function () {
    return gulp.src('src/styles/**/*.css')
        .pipe(plugins.concat('styles.css'))
        .pipe(gulp.dest(config.destination));
});

function header() {
    return plugins.header('(function () {\n');
}

function footer() {
    return plugins.footer('\n}());\n');
}

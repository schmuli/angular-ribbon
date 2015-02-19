var gulp = require('gulp');
var esperanto = require('esperanto');
var plugins = require('gulp-load-plugins')({
    rename: {
        'gulp-angular-templatecache': 'templateCache',
        'gulp-add-src': 'src'
    }
});

var config = {
    destination: 'dist',
    baseDir: 'src/js',
    entryFile: 'module.js',
    templateFile: 'ribbon-templates.js',
    outputFile: 'ribbon.js',
    templateOutputFile: 'ribbon.tmpl.js',
    path: function (file) {
        return config.destination + '/' + file;
    }
};

gulp.task('dev', ['build'], function () {
    gulp.watch('src/js/**/*.js', ['build/javascript']);
    gulp.watch('src/templates/*-template.html', ['build/javascript']);
    gulp.watch('src/styles/*.css', ['build/styles']);
});

gulp.task('build', ['build/javascript', 'build/styles']);

gulp.task('build/javascript', ['build/templates'], function (cb) {
    return esperanto
        .bundle({
            base: config.baseDir,
            entry: config.entryFile
        })
        .then(function (result) {
            var res = result.concat({
                intro: '',
                outro: ''
            });

            return plugins.file(config.outputFile, res.code, {src: true})
                .pipe(plugins.babel())
                .pipe(header())
                .pipe(footer())
                .pipe(gulp.dest(config.destination))
                .pipe(plugins.src.append(config.path(config.templateFile)))
                .pipe(plugins.concat(config.templateOutputFile))
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
            filename: config.templateFile,
            root: 'ribbon/',
            standalone: true,
            module: 'ribbon.templates'
        }))
        .pipe(header())
        .pipe(footer())
        .pipe(gulp.dest(config.destination));
});

gulp.task('build/styles', function () {
    return gulp.src('src/styles/**/*.css')
        .pipe(plugins.concat('ribbon.css'))
        .pipe(gulp.dest(config.destination));
});

gulp.task('minify', ['build'], function () {
    gulp.src([config.path(config.outputFile), config.path(config.templateOutputFile)])
        .pipe(plugins.uglify())
        .pipe(plugins.rename(function (path) {
            path.extname = '.min.js';
        }))
        .pipe(gulp.dest(config.destination));
});

function header() {
    return plugins.header('(function (angular) {\n');
}

function footer() {
    return plugins.footer('\n}(angular));\n');
}

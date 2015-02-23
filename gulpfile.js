var elixir = require('laravel-elixir');
var gulp = require('gulp');
var bower = require('bower');
var gulpConcat = require('gulp-concat');
var gulpLess = require('gulp-less');
var gulpMinifyCSS = require('gulp-minify-css');
var gulpFilter = require('gulp-filter');
var gulpUglfy = require('gulp-uglify');
var mainBowerFiles = require('main-bower-files');
require('laravel-elixir-browser-sync');

/*
 |--------------------------------------------------------------------------
 | Elixir Asset Management
 |--------------------------------------------------------------------------
 |
 | Elixir provides a clean, fluent API for defining some basic Gulp tasks
 | for your Laravel application. By default, we are compiling the Less
 | file for our application, as well as publishing vendor resources.
 |
 */

/**
 * Install Bower
 */
elixir.extend('bowerInstall', function(){
    gulp.task('bower-install', function () {
        return bower.commands.install([], {save: true}, {})
            .on('end', function (data) {
                console.log(data);
            });
    });
    return this.queueTask('bower-install');
});

/**
 * Compile Bower Components
 */
elixir.extend('compileBowerComponents', function(){

    gulp.task('compile-bower-components', function () {
        var cssFilter  = gulpFilter('**/*.less');
        var jsFilter   = gulpFilter('**/*.js');
        var fontFilter = gulpFilter([
            "**/glyphicons-*",
            "**/Material-*"
        ]);
        gulp.src(
            mainBowerFiles()
        )
            .pipe(cssFilter)
            .pipe(gulpLess())
            .pipe(gulpConcat('core.css'))
            .pipe(gulpMinifyCSS())
            .pipe(gulp.dest('public/css'))
            .pipe(cssFilter.restore())
            .pipe(jsFilter)
            .pipe(gulpConcat('core.js'))
            .pipe(gulpUglfy())
            .pipe(gulp.dest('public/js'))
            .pipe(jsFilter.restore())
            .pipe(fontFilter)
            .pipe(gulp.dest('public/fonts'))
            .pipe(fontFilter.restore());
    });
    return this.queueTask('compile-bower-components');
});

elixir(function(mix) {
    mix.bowerInstall()
        .compileBowerComponents()
        .less()
        .browserSync([
            'app/**/*',
            'public/**/*',
            'resources/views/**/*'
        ], {
            proxy: "localhost:8080",
            reloadDelay: 2000
        });
});

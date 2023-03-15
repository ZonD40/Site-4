const gulp        = require('gulp');
const browserSync = require('browser-sync');
const sass = require('gulp-sass')(require('sass'));
const rename = require("gulp-rename");
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const imagemin = require('gulp-imagemin');
const htmlmin = require('gulp-htmlmin');
const { parallel } = require('gulp');

// Static server
gulp.task('server', function() {
    browserSync.init({
        server: {
            baseDir: "dist"
        }
    });
});

gulp.task('styles', function() {
	return gulp.src('./src/sass/**/*.+(scss|sass|css)')
		.pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
		.pipe(rename({
			prefix: "",
			suffix: ".min"
		}))
		.pipe(autoprefixer())
		.pipe(cleanCSS({compatibility: 'ie8'}))
		.pipe(gulp.dest('./dist/css'))
		.pipe(browserSync.stream());

});

gulp.task('html', function() {
	return gulp.src('./src/*.html')
		.pipe(htmlmin({collapseWhitespace: true}))
		.pipe(gulp.dest('./dist'));
});

gulp.task('scripts', function() {
	return gulp.src('./src/js/**/*.js')
		.pipe(gulp.dest('./dist/js'));
});

gulp.task('fonts', function() {
	return gulp.src('./src/fonts/**/*')
		.pipe(gulp.dest('./dist/fonts'));
});

gulp.task('img', function() {
	return gulp.src('./src/img/**/*')
		.pipe(imagemin())
		.pipe(gulp.dest('./dist/img'));
});

gulp.task('video', function() {
	return gulp.src('./src/video/**/*')
		.pipe(gulp.dest('./dist/video'));
});

gulp.task('icon', function() {
	return gulp.src('./src/icon/**/*')
		.pipe(gulp.dest('./dist/icon'));
});

gulp.task('watch', function() {
	gulp.watch('./src/sass/**/*.+(scss|sass|css)', gulp.parallel('styles'));
	gulp.watch('./src/*.html').on('change', gulp.parallel('html'));
	gulp.watch('./src/js/*.js').on('change', gulp.parallel('scripts'));
	gulp.watch('./src/icon/**/*').on('all', gulp.parallel('icon'));
	gulp.watch('./src/img/**/*').on('all', gulp.parallel('img'));
	gulp.watch('./src/*.html').on('change', browserSync.reload);
	gulp.watch('./src/js/*.js').on('change', browserSync.reload);
});

gulp.task('default', gulp.parallel('watch', 'server', 'styles', 'scripts', 'fonts', 'img', 'video', 'icon', 'html'));

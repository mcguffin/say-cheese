var gulp = require('gulp');
var gulputil = require('gulp-util');
var concat = require('gulp-concat');  
var uglify = require('gulp-uglify');  
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var rename = require('gulp-rename');


var styles = [
	'./src/scss/cheese.scss'
];
var vendor_scripts = [
		'./src/vendor/webrtc/adapter/release/adapter.js',
		'./src/vendor/layerssss/paste.js/paste.js',
	],
	scripts = [
		'./src/js/jquery-webcam-recorder.js',
		'./src/js/cheese-base.js',
		'./src/js/cheese.js',
		'./src/js/media-view.js'
	];


gulp.task('styles-admin',function(){
    return gulp.src( styles )
		.pipe(sourcemaps.init())
        .pipe( sass( { 
        	outputStyle: 'compressed' 
        } ).on('error', sass.logError) )
        .pipe( sourcemaps.write() )
        .pipe( gulp.dest( './css/' ) );
});

gulp.task('scripts-admin', function() {

    return [ gulp.src( vendor_scripts.concat( scripts ) )
			.pipe(sourcemaps.init())
			.pipe( uglify().on('error', gulputil.log ) )
			.pipe( concat('cheese.min.js') )
			.pipe( gulp.dest( './js/' ) )
			.pipe( rename('cheese-with-sourcemap.min.js') )
			.pipe( sourcemaps.write() )
			.pipe( gulp.dest( './js/' ) ),
    ]; 	
});


gulp.task( 'watch', function() {
	gulp.watch('./src/scss/**/*.scss', ['styles-admin'] );
	gulp.watch('./src/js/**/*.js', ['scripts-admin'] );
} );

gulp.task( 'build', ['styles-admin','scripts-admin'] );

gulp.task( 'default', ['build','watch'] );


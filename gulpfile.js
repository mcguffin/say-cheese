var gulp = require('gulp');
var gulputil = require('gulp-util');
var concat = require('gulp-concat');  
var uglify = require('gulp-uglify');  
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var rename = require('gulp-rename');


var styles = {
		'./css/admin/' : [ './src/scss/admin/cheese.scss' ],
		'./css/admin/mce' : [
			'./src/scss/admin/mce/cheese-toolbar.scss',
			'./src/scss/admin/mce/cheese-editor.scss'
		],
	};
var vendor_scripts = [
		'./src/vendor/webrtc/adapter/release/adapter.js',
	],
	scripts = [
		'./src/js/admin/jquery-webcam-recorder.js',
		'./src/js/admin/cheese-base.js',
		'./src/js/admin/cheese.js',
		'./src/js/admin/media-view.js'
	];


gulp.task('styles-admin',function(){
    var src = [];
    for ( var dest in styles ) {
		src.push(gulp.src( styles[dest] )
			.pipe(sourcemaps.init())
			.pipe( sass( { 
				outputStyle: 'compressed' 
			} ).on('error', sass.logError) )
			.pipe( sourcemaps.write() )
			.pipe( gulp.dest( dest ) )
		);
    }
});

gulp.task('scripts-admin', function() {

    var scr = [ gulp.src( vendor_scripts.concat( scripts ) )
			.pipe( sourcemaps.init() )
			.pipe( concat('cheese.js') )
			.pipe( sourcemaps.write() )
			.pipe( gulp.dest('./js/admin/') )
			.pipe( uglify().on('error', gulputil.log )  )
			.pipe( rename('cheese.min.js') )
			.pipe( sourcemaps.write() )
			.pipe( gulp.dest('./js/admin/') ),
    ];

    return scr;
});


gulp.task( 'watch', function() {
	gulp.watch('./src/scss/**/*.scss', ['styles-admin'] );
	gulp.watch('./src/js/**/*.js', ['scripts-admin'] );
	gulp.watch('./src/vendor/**/*.js', ['scripts-admin'] );
} );

gulp.task( 'build', ['styles-admin','scripts-admin'] );

gulp.task( 'default', ['build','watch'] );


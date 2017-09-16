(function($,exports){

	var is_chrome	= navigator.userAgent.indexOf('Chrome') > -1
		
	exports.cheese = $.extend( {
		supports : {
			webcam_recording: $.recorder.supported && ( ! is_chrome || ( is_chrome && location.protocol === 'https:') ),//!!(navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia)
		},
		view:{},
		wpUloader : false,
		getWpUploader: function( ){ 
			return cheese.wpUploader; 
		}

	}, cheese );

//	cheese = cheese;

})( jQuery, wp.media );

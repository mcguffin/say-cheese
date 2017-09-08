(function($,exports){

	var is_chrome	= navigator.userAgent.indexOf('Chrome') > -1
		
	exports.cheese = $.extend( {
		supports : {
			paste: cheese.options.enable_pasteboard && // enabled
					( ('paste' in document) || ('onpaste' in document) || typeof(window.onpaste) === 'object' || ( 'onpaste' in document.createElement('DIV') ) ), // browser
			webcam_recording: cheese.options.enable_snapshot && $.recorder.supported && 
				( ! is_chrome || ( is_chrome && location.protocol === 'https:') ),//!!(navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia)
		},
		view:{},
		wpUloader : false,
		getWpUploader: function( ){ 
			return cheese.wpUploader; 
		}

	}, cheese );

//	cheese = cheese;

})( jQuery, wp.media );

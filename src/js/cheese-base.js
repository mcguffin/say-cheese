(function($,exports){

	var counter		= 0,
		l10n 		= wp.media.view.l10n = typeof _wpMediaViewsL10n === 'undefined' ? {} : _wpMediaViewsL10n,
		is_chrome	= navigator.userAgent.indexOf('Chrome') > -1;

	l10n = _.extend(l10n,cheese_options.l10n);
	var cheese = {
		supports : {
			paste: cheese_options.enable_pasteboard && // enabled
					( ('paste' in document) || ('onpaste' in document) || typeof(window.onpaste) === 'object' || ( 'onpaste' in document.createElement('DIV') ) ), // browser
			webcam_recording: cheese_options.enable_snapshot && $.recorder.supported && 
				( ! is_chrome || ( is_chrome && location.protocol === 'https:') ),//!!(navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia)
		},
		view:{},
		wpUloader : false,
		getWpUploader: function( ){ 
			return cheese.wpUploader; 
		}

	};

	exports.cheese = cheese;

})( jQuery, wp.media );

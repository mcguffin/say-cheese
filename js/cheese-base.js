(function($,exports){

	var counter      = 0,
		l10n = wp.media.view.l10n = typeof _wpMediaViewsL10n === 'undefined' ? {} : _wpMediaViewsL10n,
		is_chrome = navigator.userAgent.indexOf('Chrome') > -1,
		is_safari = !is_chrome && navigator.userAgent.indexOf("Safari") > -1;

	l10n = _.extend(l10n,cheese_l10n);

	var cheese = {
		supports : {
			paste: ! is_safari && cheese_l10n.enable_pasteboard && (('paste' in document) || ('onpaste' in document) || typeof(window.onpaste) === 'object'),
			webcam_recording: cheese_l10n.enable_snapshot && $.recorder.supported && ( ! is_chrome || ( is_chrome && location.protocol === 'https:') ),//!!(navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia)
		},
		view:{},
		wpUloader : false,
		getWpUploader: function( ){ 
			return cheese.wpUploader; 
		}
// 		
// 		create_webcam_recorder : function( parent , options ) {
// 			$.extend( true , options || {} , {
// 					constraints : {
// 						video : {
// 							width:1280, 
// 							height:720 
// 						}
// 					}
// 				});
// 			return $(parent)
// 				.recorder(options);
// 		}
		// upload_data_url: 
	};

	exports.cheese = cheese;

})( jQuery, wp.media );
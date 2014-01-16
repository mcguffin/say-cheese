(function($){
	var userMediaObject, $image, 
		element = stream = recorder = null;
	
	window.URL = window.URL || window.webkitURL || window.mozURL || window.msURL;
	navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
	
	$.fn.recorder = function( options ) {
		var settings = $.extend({
			camera:true,
			microphone:false
		},options );

		videoElement = this.get(0);

		var setUserMediaObject = function() {
			userMediaObject = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
		}
		
		if ( ! navigator.getUserMedia ) {
			console.log('Your browser doesn\'t support ScreenCast.');
			return this;
		}
		var width,height;
		
		this.start = function() {
			navigator.getUserMedia({
				video: settings.camera,
				audio: settings.microphone
			}, function( localMediaStream ) { // success
				if (videoElement.mozSrcObject !== undefined) {
					videoElement.mozSrcObject = localMediaStream;
				} else {
					videoElement.src = (window.URL && window.URL.createObjectURL(localMediaStream)) || localMediaStream;
				};
//				video.play();
				stream = localMediaStream;
				// should be separated from this class?
				
				// Note: onloadedmetadata doesn't fire in Chrome when using it with getUserMedia.
				// See crbug.com/110938.
				videoElement.addEventListener('playing', function(e) {
					width = width || videoElement.videoWidth;
					height = height || videoElement.videoHeight;
//					console.log(videoElement,'Video dimensions: ' + videoElement.videoWidth + ' x ' + videoElement.videoHeight);
				});
			}.bind(this), function(e) { 
				if (e.code === 1) {
				  console.log('User declined permissions.');
				}
			});
		}
		this.stop = function() {
			stream.stop();
			videoElement.src = null;
		}
		this.snapshot = function( blobCallback ) {
			// replaces video with img
			width = width || videoElement.videoWidth;
			height = height || videoElement.videoHeight;
			if ( stream ) {
				var blob;
				var $canvas = $('<canvas style="display:block"></canvas>')
					.insertAfter(videoElement).attr('width',width).attr('height',height);
				var canvasContext = $canvas.get(0).getContext('2d');
				$image = $('<img />')
					.insertAfter(videoElement).attr('width',width).attr('height',height);

				canvasContext.drawImage( videoElement, 0, 0, width, height );
				$canvas.get(0).toBlob(blobCallback,'image/png');
				$canvas.remove();
				$image.get(0).src = $canvas.get(0).toDataURL('image/png');
//					console.log($canvas.get(0).toBlob('image/png'));
				this.stop();
				this.css('display','none');
				
				return blob;
			}
		}
		this.reset = function( ) {
			// replaces video with img
			$image.remove();
			this.css('display','block');
			this.start();
		}
		
		
		setUserMediaObject();
		return this;
	}

})(jQuery);

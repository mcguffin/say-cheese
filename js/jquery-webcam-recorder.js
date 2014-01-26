(function($){
	var stream = null;
	
	// iOS6 support: http://www.purplesquirrels.com.au/2013/08/webcam-to-canvas-or-data-uri-with-html5-and-javascript/
	
	window.URL = window.URL || window.webkitURL || window.mozURL || window.msURL;
	navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
	$.create_recorder_element = function( ){
		// calc generic element id
		// use <input id="webcam-recorder" type="file" accept="image/*" capture="camera" /> on iOS
		var html = '<video class="webcam-recorder" width="640" height="480" id="webcam-recorder" autoplay="autoplay"></video>';
		return $(html);
	}
	$.fn.recorder = function( options ) {
		var settings = $.extend({
			camera:true,
			microphone:false
		},options ) , self = this;

		videoElement = this.get(0);

		if ( ! navigator.getUserMedia ) {
			console.log('Your browser doesn\'t support ScreenCast.');
			return this;
		}
		var width,height;
		this.state = 'waiting';
		
		this.start = function() {
			self.trigger('statechange');
				
			navigator.getUserMedia({
				video: settings.camera,
				audio: settings.microphone
			}, function( localMediaStream ) { // success
				if (videoElement.mozSrcObject !== undefined) {
					videoElement.mozSrcObject = localMediaStream;
				} else {
					videoElement.src = (window.URL && window.URL.createObjectURL(localMediaStream)) || localMediaStream;
				};
				stream = localMediaStream;
				// should be separated from this class?
				
				// Note: onloadedmetadata doesn't fire in Chrome when using it with getUserMedia.
				// See crbug.com/110938.
				videoElement.addEventListener('playing', function(e) {
					width = width || videoElement.videoWidth;
					height = height || videoElement.videoHeight;
					self.state = 'recording';
					self.trigger('statechange');
				});
			}.bind(this), function(e) { 
				self.state = 'error';
				self.trigger('statechange');
				if (e.code === 1) {
					console.log('User declined permissions.');
				}
			});
		}
		this.stop = function() {
			if ( !! stream )
				stream.stop();
			videoElement.src = null;
			self.state = 'stopped';
			self.trigger('statechange');
		}
		this.snapshot = function() {
			// replaces video with img
			width = width || videoElement.videoWidth;
			height = height || videoElement.videoHeight;
			if ( stream ) {
				var blob;
				var $canvas = $('<canvas style="display:block"></canvas>')
					.insertAfter(this).attr('width',width).attr('height',height);
				var canvasContext = $canvas.get(0).getContext('2d');
				canvasContext.drawImage( this.get(0), 0, 0, width, height );

				dataSrc = $canvas.get(0).toDataURL('image/png');
				$canvas.remove();
				return dataSrc;
			}
		}
		
		
		return this;
	}

})(jQuery);

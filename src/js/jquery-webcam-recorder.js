(function($,exports){
	// extend jquery
	if ( ! $.fn.outerHTML ) {
		$.extend( $.fn , {outerHTML : function(){
			return $('<div>').append(this.clone()).html();
		}});
	}
	if ( ! $.fn.inDOM ) {
		$.extend( $.fn , {inDOM : function(){
			return jQuery.contains(document, this[0]);
		}});
	}
	
	var stream = null, s, 
		counter=0;

	exports.guid = function() {
		var guid = new Date().getTime().toString(32), i;

		for (i = 0; i < 5; i++) {
			guid += Math.floor(Math.random() * 65535).toString(32);
		}

		return 'p' + guid + (counter++).toString(32);
	}
	
	// extract data from data URL
	function file_data_from_datasrc( src ) {
		return src.split('\r').join('').split('\n').join('');
	}
	
	window.URL = window.URL || window.webkitURL || window.mozURL || window.msURL;
	// check canvas, canvas context 2d, canvas toDataUrl support


	$.extend( $ , { recorder : {
		 supported : false 
	}});
	$.fn.recorder = function( options ) {
		// this: jquery object || dom element
		
		var $self = this;
		$.extend( this , $.fn.recorder.prototype );
		
		this.options = $.extend( true , {
			constraints : {
				video: { width: 1280, height: 720 },
				audio: false
			},
			html5 : {},
			autostart:false
		},options);

		this.on('recorder:create',function( e , element ){
			// e.ref -> html element ... objct, embed, video, ...
			// append to self.append
			if ( ! $self.element ) {
				$self.element = element;
				$(element).appendTo($self).get(0);
			}
		});
		this.create();
		return this;
	}
	
	$.extend($.fn.recorder.prototype,{
		element : null,
		state : false,
		create : function(){},
		start : function() {},
		stop : function(){},
		snapshot : function(){}
	});
	/*
	events
	- recorder:create
	- recorder:state:ready
	- recorder:state:waiting
	- recorder:state:started
	- recorder:state:error
	- recorder:state:stopped

	function callback( event , recorderElement [, state] ){
	}
	*/
	// recorder state 
	var recorder_modules = {
		html5 : {
			supported : !!(window.URL && window.URL.createObjectURL) &&  // url supported
						(function(){ // canvas supported
							var elem = document.createElement('canvas');
							return !!(elem.getContext && elem.getContext('2d'));
						})() &&
						!!navigator.mediaDevices &&
						!!navigator.mediaDevices.getUserMedia,
			
			create : function() {

				var $self = this,
					id = "html5-webcam-recorder-"+window.guid(),
					whstring =  ( !! $self.options.height && !! $self.options.width ) ? 'width="'+$self.options.width+'" height="'+$self.options.height+'"' : '',
					html = '<video class="webcam-recorder" ' + whstring + ' id="'+id+'" autoplay="autoplay"></video>';
				
				this.trigger( $.Event('recorder:create') , $(html).get(0) );
				setTimeout(function(){$self.trigger(  $.Event('recorder:state:ready') , $self.element , 'ready' );},20);
			},
			start : function(){
				var $self = this;
				
				navigator.mediaDevices.getUserMedia( this.options.constraints )
				.then(
					function( localMediaStream ) { // success
						if (this.element.mozSrcObject !== undefined) {
							this.element.mozSrcObject = localMediaStream;
						} else {
							this.element.src = (window.URL && window.URL.createObjectURL(localMediaStream)) || localMediaStream;
						};
						stream = localMediaStream;
						// should be separated from this class?

						// Note: onloadedmetadata doesn't fire in Chrome when using it with getUserMedia.
						// See crbug.com/110938.
						$(this.element).on('playing', function(e) {
							self.state = 'started';
							$self.trigger( $.Event('recorder:state:started') , $self.element );
						});
				}.bind(this) )
				.catch( function(e) { 
					$self.state = 'error';
					if ( e.code === 1 || e.name == "PermissionDeniedError" ) {
						$self.trigger( $.Event('recorder:state:permissionerror') , [$self.element, e] );
					} else {
						$self.trigger( $.Event('recorder:state:error') , [$self.element, e] );
					}
				});
				this.state = 'waiting';
				this.trigger( $.Event('recorder:state:waiting') , this.element );
				
			},
			stop : function(){
				var tracks, s;
console.trace('stop recorder');
				if ( !! stream ) {
					if ( !! stream.stop ) {
						stream.stop();
					} else if ( !! stream.getVideoTracks ) {
						tracks = stream.getVideoTracks();
						for ( s in tracks ) {
							if ( tracks[s].stop ) {
								tracks[s].stop();
							}
						}
					}
				}
				$(this.element).off('playing');
//				this.element.src = null;
				this.state = 'stopped';
				this.trigger( $.Event('recorder:state:stopped') , this.element );
			},
			snapshot : function(){
				var width,height;
				
				width = this.element.videoWidth || this.width();
				height = this.element.videoHeight || this.height();
				if ( stream ) {
					var $canvas = $('<canvas style="display:block"></canvas>')
						.insertAfter(this).attr('width',width).attr('height',height);
					var canvasContext = $canvas.get(0).getContext('2d');
					canvasContext.drawImage( this.element , 0, 0, width, height );

					dataSrc = $canvas.get(0).toDataURL('image/png');
					$canvas.remove();
					return dataSrc;
				}
			}
		}
	}
	for (s in recorder_modules) {
		if ( recorder_modules[s].supported ) {
			$.extend( $.fn.recorder.prototype , recorder_modules[s] );
			$.recorder.supported = true;
			break;
		}
	}

	
	// iOS6 support see: http://www.purplesquirrels.com.au/2013/08/webcam-to-canvas-or-data-uri-with-html5-and-javascript/

})(jQuery,window);

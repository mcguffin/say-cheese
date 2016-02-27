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
	
	var stream = null, s,minFlashVersion = "11.2.0", 
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
	if ( !!navigator.mediaDevices && !! navigator.mediaDevices.getUserMedia ) {
		navigator.getUserMedia = function( constraints, successCallback, errorCallback ) {
			var p = navigator.mediaDevices.getUserMedia(constraints);
			p.then( successCallback );
			p.catch( errorCallback );
		}
	} else {
		console.log('hier!');
		navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
	}
	// check canvas, canvas context 2d, canvas toDataUrl support
	//
	//
	$.extend( $ , { recorder : {
		 supported : false 
	}});
	$.fn.recorder = function( options ) {
		// this: jquery object || dom element
		
		var $self = this;
		$.extend( this , $.fn.recorder.prototype );
		
		this.options = $.extend( true , {
			camera : true,
			microphone : false,
			width : 640,
			height : 480,
			flash : {
				swf_url : 'WebcamRecorder.swf'
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
						!!navigator.getUserMedia,
			
			create : function() {
				var $self = this;
				var id = "html5-webcam-recorder-"+window.guid();
				var html = '<video class="webcam-recorder" width="'+$self.options.width+'" height="'+$self.options.height+'" id="'+id+'" autoplay="autoplay"></video>';
				
				this.trigger( $.Event('recorder:create') , $(html).get(0) );
				setTimeout(function(){$self.trigger(  $.Event('recorder:state:ready') , $self.element , 'ready' );},20);
			},
			start : function(){
				var $self = this;
				
				
				
				var p = navigator.getUserMedia({
					video: this.options.camera,
					audio: this.options.microphone
				}, function( localMediaStream ) { // success
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
				}.bind(this), function(e) { 
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
				console.log(stream);
				var tracks, s;
				if ( !! stream && !! stream.stop ) {
					stream.stop();
				} else if ( !! stream.getVideoTracks ) {
					tracks = stream.getVideoTracks();
					for ( s in tracks ) {
						if ( tracks[s].stop ) {
							tracks[s].stop();
						}
					}
				}
				$(this.element).off('playing');
				this.element.src = null;
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
		},
		flash : {
			supported : swfobject && swfobject.hasFlashPlayerVersion(minFlashVersion),

			id : null,
			create : function(){
				var $self = this,
					$detached = null,el;
				
				this.id = "flash-webcam-recorder-"+window.guid()
				
				window.statechange = function(arg) {
					$self.state = arg;
					console.log('statechange',arg);
					$self.trigger( $.Event('recorder:state:'+arg) , $self.element );
				}
				
				var $elem = $('<div><div id="'+this.id+'" /></div>');
				$self.trigger( $.Event('recorder:create') , $elem );
				
				// we need to wait until the palceholder div get attached to the DOM before we can embedSWF() it.
				var create_swf_interval = setInterval(function() {
					if ( $('#'+$self.id).inDOM() ) {
						var width=640,height=480,
							xiURL=false,
							flashvars = {},
							param = {
								'allowscriptaccess'	: 'always',
								'wmode'				: 'opaque',
							},
							attr = {},
							callback = function(e) {
								if ( e.success ) {
									$self.element = e.ref;
								}
							};
						swfobject.embedSWF( $self.options.flash.swf_url , $self.id , width , height , minFlashVersion , xiURL , flashvars , param , attr , callback );
						clearInterval(create_swf_interval);
					}
				},100);
				console.log('create',this);
			},
			start : function() {
				var self = this;
				if ( this.state == 'ready' || this.state == 'error' || this.state == 'permissionerror' ) {
					ret = this.element.startcam( );
					return ret;
				} else {
					this.one('recorder:state:ready',function(e){ 
						e.stopPropagation();
						self.start(); 
					});
				}
			},
			stop : function() {
				try {
					return this.element.stopcam( );
				} catch(err){}
			},
			snapshot : function(){
				return file_data_from_datasrc( this.element.snapshot() );
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

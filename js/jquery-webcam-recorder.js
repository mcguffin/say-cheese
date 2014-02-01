(function($,exports){
	var stream = null, s,minFlashVersion = "12.0.0", counter=0;

	exports.guid = function() {
		var guid = new Date().getTime().toString(32), i;

		for (i = 0; i < 5; i++) {
			guid += Math.floor(Math.random() * 65535).toString(32);
		}

		return 'p' + guid + (counter++).toString(32);
	}
	
	window.URL = window.URL || window.webkitURL || window.mozURL || window.msURL;
	navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
	// check canvas, canvas context 2d, canvas toDataUrl support
	
	//
	// create event
	//
	CreateEvent = function ( id , ref ) {
		this.ref = ref;
		this.id = id;
		this.type = 'recorder:create';
	}
	$.extend(CreateEvent.prototype,$.Event('recorder:create'),{
		id : null,
		ref : undefined,
		type : 'recorder:create'
	});
	//
	// create event
	//
	$.fn.recorder = function( options ) {
		// this: jquery object || dom element
		
		var $self = this;
		$.extend( this , $.fn.recorder.prototype );
		
		this.options = $.extend({
			camera : true,
			microphone : false
		},options);
		
		
		this.on('recorder:create',function( e ){
			// e.ref -> html element ... objct, embed, video, ...
			// append to self.append
			if ( ! $self.element )
				$self.element = $(e.ref).appendTo($self).get(0);
		});
		this.create();
		return this;
	}
	
	$.extend($.fn.recorder.prototype,{
		element : null,
		state : null,
		create : function(){},
		start : function() {},
		stop : function(){},
		snapshot : function(){}
	});
	
	var recorder_modules = {
		html5 : {
			create : function() {
				var id = "html5-webcam-recorder-"+window.guid();
				var html = '<video class="webcam-recorder" width="640" height="480" id="'+id+'" autoplay="autoplay"></video>';
				var event = new CreateEvent( id , $(html).get(0) );
				this.trigger( event );
			},
			start : function(){
				var $self = this;
				
				navigator.getUserMedia({
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
						width = width || this.element.videoWidth;
						height = height || this.element.videoHeight;
						self.state = 'recording';
						self.trigger('recorder:statechange');
					});
				}.bind(this), function(e) { 
					self.state = 'error';
					self.trigger('recorder:statechange');
					if (e.code === 1) {
						console.log('User declined permissions.');
					}
				});
				this.state = 'started';
				this.trigger('recorder:statechange');
			},
			stop : function(){
				if ( !! stream )
					stream.stop();
				$(this.element).off('playing');
				this.element.src = null;
				this.state = 'stopped';
				this.trigger('recorder:statechange');
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
			},
			supported : !!(window.URL && window.URL.createObjectURL) &&  // url supported
						(function(){ // canvas supported
							var elem = document.createElement('canvas');
							return !!(elem.getContext && elem.getContext('2d'));
						})() &&
						!!navigator.getUserMedia
		},
	
		flash : {
			create : function(){
				var $self = this,
					id = $self.attr('id') || "flash-webcam-recorder-"+window.guid();
				
				if ( ! $self.attr('id') )
					$self.attr( 'id' , id );
				
				window.statechange = function(arg) {
					console.log(arg);
					this.state = arg;
				}
				
				var width=640,height=480,swfurl,
					xiURL=false,
					flashvars = {},
					param = {
						allowscriptaccess : 'always'
					},
					attr = {},
					callback = function(e){
						console.log('flash trigger create ',e,e.ref);
						if ( e.success ) {
							$self.element = e.ref;
							$self.trigger( new CreateEvent( e.id , e.ref ) );
						}
					};
				swfurl = '../js/WebcamRecorder.swf';

				swfobject.embedSWF( swfurl , id , width , height , minFlashVersion , xiURL , flashvars , param , attr , callback );
				// attach events?
			},
			start : function(){
				if ( this.element )
					this.element.startcam();
			},
			stop : function(){
				if ( this.element )
					this.element.stopcam();
			},
			snapshot : function(){
				if ( this.element )
					return this.element.snapshot();
			},
			supported : swfobject && swfobject.hasFlashPlayerVersion(minFlashVersion)
		}
	}
	recorder_modules.html5.supported=false;
	for (s in recorder_modules) {
		if ( recorder_modules[s].supported ) {
			$.extend( $.fn.recorder.prototype , recorder_modules[s] );
			$.fn.recorder.supported = true;
			break;
		}
	}
	/*
	
	var recorder = {
		create_element : function(){
			
		},
		supported : false ,
		
		html5 : $.extend({
		
		},default_recorder),
		
		
		flash : $.extend({
			create_element : function() {
				swfobject.embedSWF( swfSrc , id , width , height , version , xiURL , vars , param , attr , callback );
			},
			supported : swfobject && swfobject.hasFlashPlayerVersion('10.0.0')
		},default_recorder)
	};
	
	
	*/
	
	// iOS6 support see: http://www.purplesquirrels.com.au/2013/08/webcam-to-canvas-or-data-uri-with-html5-and-javascript/
	
	
	
	
	// check canvas, canvas context 2d, canvas toDataUrl support
	// check navigator.getusermedia support
	// 
	
	/*
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
		self.trigger('statechange');
		
		this.start = function() {
			
		}
		this.stop = function() {
		}
		this.snapshot = function() {
			// replaces video with img
		}
		
		
		return this;
	}
	*/
})(jQuery,window);

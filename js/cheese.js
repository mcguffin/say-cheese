(function($,exports){

	var counter      = 0,
		media        = wp.media,
		bindHandlers = media.view.MediaFrame.Select.prototype.bindHandlers,
		browseRouter = media.view.MediaFrame.Select.prototype.browseRouter,
		l10n = media.view.l10n = typeof _wpMediaViewsL10n === 'undefined' ? {} : _wpMediaViewsL10n;

	l10n = _.extend(l10n,cheese_l10n);

	$.extend( wp.Uploader.prototype, {
		success : function( file_attachment ){
		}
	});

	var cheese = {
		
		supports : {
			paste: cheese_l10n.enable_pasteboard && (('paste' in document) || ('onpaste' in document) || typeof(window.onpaste) === 'object'),
			webcam_recording: cheese_l10n.enable_snapshot && $.recorder.supported,//!!(navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia)
		},
		
		create_webcam_recorder : function( parent , options ) {
			$.extend( true , options || {} , {
					camera:{mandatory:{
						minWidth: 640,
						minHeight: 480
					}},
					microphone:false
				});
			return $(parent)
				.recorder(options);
		}
		
		// upload_data_url: 
	};
	
	// extend media input methods.
	
	/**
	 *	Integrate into media library modal
	 */
	media.view.MediaFrame.Select.prototype.browseRouter = function( view ) {
		browseRouter.apply(this,arguments);
		if (cheese.supports.webcam_recording ) 
			view.set({record:{
				text:     l10n.webcam_record,
				priority: 30
			}});
		
		if ( cheese.supports.paste )
			view.set({pasteboard:{
				text:     l10n.copy_paste,
				priority: 35
			}});
	};
	
	media.view.MediaFrame.Select.prototype.bindHandlers = function() {
		var previousContent = false;
		// parent handlers
		bindHandlers.apply( this, arguments );
		// add recorder create handler.
		
		this.on( 'content:render close' , function(content){
			if ( previousContent && 'function' === typeof previousContent.dismiss ) {
				previousContent.dismiss();
			}
			if ( 'undefined' !== typeof content )
				previousContent = content;
		} , this );
		
		this.on( 'content:create:pasteboard', this.contentCreatePasteboard, this );
		this.on( 'content:create:record', this.contentCreateRecord, this );
		this.on( 'content:render:pasteboard content:render:record', this.contentRenderGrabber, this );
		
		frame = this;
	};
	media.view.MediaFrame.Select.prototype.contentCreateRecord = function( content ){
		var state = this.state();
		this.$el.removeClass('hide-toolbar');
		content.view = new media.view.DataSourceImageGrabber({ controller:this , grabber: media.view.WebcamRecorder });
	}
	media.view.MediaFrame.Select.prototype.contentCreatePasteboard = function( content ){
		var state = this.state();
		this.$el.removeClass('hide-toolbar');
		content.view = new media.view.DataSourceImageGrabber({ controller:this , grabber: media.view.Pasteboard });
	}
	media.view.MediaFrame.Select.prototype.contentRenderGrabber = function( content ){
		content.startGrabbing();
	}
	
	
	/**
	 *	Add paste button to toolbar on upload.php
	 */
	var oldInitialize = media.view.AttachmentsBrowser.prototype.initialize;
	media.view.AttachmentsBrowser.prototype.initialize = function() {
		oldInitialize.apply(this,arguments);
		if ( ! (this.controller instanceof media.view.MediaFrame.Select) ) {
			this.toolbar.set( 'pasteModeButton', new wp.media.view.GrabberButton({
				text: 'Paste Image',
				controller: this.controller,
				priority: -65,
				grabber: media.view.Pasteboard
			}).render() );

			this.toolbar.set( 'recordModeButton', new wp.media.view.GrabberButton({
				text: 'Take Snapshot',
				controller: this.controller,
				priority: -64,
				grabber: media.view.WebcamRecorder
			}).render() );
		}
		
	}
	
	
	
	exports.cheese = cheese;
})(jQuery,window);

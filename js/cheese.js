(function($,exports){

	var counter      = 0,
		l10n = wp.media.view.l10n = typeof _wpMediaViewsL10n === 'undefined' ? {} : _wpMediaViewsL10n,
		is_chrome = navigator.userAgent.indexOf('Chrome') > -1;
		is_safari = !is_chrome && navigator.userAgent.indexOf("Safari") > -1;


	$.extend( wp.Uploader.prototype, {
		success : function( file_attachment ){
		}
	});




	/**
	 *	Integrate into media library modal
	 */
	// add states to browse router
	_.extend( wp.media.view.MediaFrame.Select.prototype, {
		_parentInitialize: wp.media.view.MediaFrame.Select.prototype.initialize,
		initialize: function() {
			this._parentInitialize.apply( this, arguments );
			this.bindCheeseHandlers();
		},
		_parentBrowseRouter: wp.media.view.MediaFrame.Select.prototype.browseRouter,
		browseRouter : function( view ) {
			this._parentBrowseRouter.apply(this,arguments);
			if ( wp.media.cheese.supports.webcam_recording ) 
				view.set({record:{
					text:     l10n.webcam_record,
					priority: 30
				}});
		
			if ( wp.media.cheese.supports.paste )
				view.set({pasteboard:{
					text:     l10n.copy_paste,
					priority: 35
				}});
		},

		bindCheeseHandlers: function() {
			var previousContent = false;
		
			// dismiss content on close
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
		
			this.on( 'action:uploaded:dataimage', this.uploadedDataImage, this )
		
			frame = this;
		},
		// add handlers
		contentCreateRecord: function( content ) {
			var state = this.state();
			content.view = new wp.media.cheese.view.DataSourceImageGrabber({ controller:this , grabber: wp.media.cheese.view.WebcamRecorder });
		},
		contentCreatePasteboard: function( content ) {
			var state = this.state();
			content.view = new wp.media.cheese.view.DataSourceImageGrabber({ controller:this , grabber: wp.media.cheese.view.Pasteboard });
		},
		contentRenderGrabber: function( content ) {
			content.startGrabbing();
		},
		uploadedDataImage: function( content ) {
			var obj = {view:null};
			this.browseContent(obj);
			this.content.set( obj.view );
			this.router.get().select('browse')
		}
	});
	


	/**
	 *	Add paste button to toolbar on upload.php
	 */
	_.extend( wp.media.view.AttachmentsBrowser.prototype, {
		_parentInitialize:	wp.media.view.AttachmentsBrowser.prototype.initialize,
		initialize:	function() {
			this._parentInitialize.apply(this,arguments);

			if ( ! (this.controller instanceof wp.media.view.MediaFrame.Select) ) {

				wp.media.cheese.supports.paste && this.toolbar.set( 'pasteModeButton', new wp.media.cheese.view.GrabberButton({
					text		: l10n.copy_paste,
					controller	: this.controller,
					priority	: -65,
					grabber		: wp.media.cheese.view.Pasteboard
				}).render() );

				wp.media.cheese.supports.webcam_recording && this.toolbar.set( 'recordModeButton', new wp.media.cheese.view.GrabberButton({
					text		: l10n.take_snapshot,
					controller	: this.controller,
					priority	: -64,
					grabber		: wp.media.cheese.view.WebcamRecorder
				}).render() );
			}
		}
	});
	
})(jQuery,window);

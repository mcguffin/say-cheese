(function($,exports){

	var counter      = 0,
		l10n = wp.media.view.l10n = typeof _wpMediaViewsL10n === 'undefined' ? {} : _wpMediaViewsL10n,
		is_chrome = navigator.userAgent.indexOf('Chrome') > -1;

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
			if ( wp.media.cheese.supports.webcam_recording ) {
				view.set({record:{
					text:     l10n.webcam_record,
					priority: 30
				}});
			}

			if ( wp.media.cheese.supports.paste ) {
				view.set({pasteboard:{
					text:     l10n.copy_paste,
					priority: 35
				}});
			}
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
		
			frame = this;
		},
		// add handlers
		contentCreateRecord: function( content ) {
			var state = this.state();
			this.currentCheeseView = content.view = new wp.media.cheese.view.DataSourceImageGrabber( { 
				controller	: this, 
				grabber		: wp.media.cheese.view.WebcamRecorder
			});
			this.listenTo( this.currentCheeseView.uploader, 'action:uploaded:dataimage', this.uploadedDataImage )
		},
		contentCreatePasteboard: function( content ) {
			var state = this.state();

			this.currentCheeseView = content.view = new wp.media.cheese.view.DataSourceImageGrabber( { 
				controller	: this, 
				grabber		: wp.media.cheese.view.Pasteboard
			});
			this.listenTo( this.currentCheeseView.uploader, 'action:uploaded:dataimage', this.uploadedDataImage )
		},
		contentRenderGrabber: function( content ) {
			content.startGrabbing();
		},
		uploadedDataImage: function( content ) {
			console.log('uploaded!');
			this.stopListening( this.currentCheeseView.uploader, 'action:uploaded:dataimage' );
			var obj = { view: null };
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
			var self = this,
				pasteBtn, recordBtn;

			this._parentInitialize.apply(this,arguments);
			
			this.cheese = {
				paste	: {
//					button	: false,
					grabber	: false,
					modal	: false,
					mode	: 'paste',
				},
				record	: {
//					button	: false,
					grabber	: false,
					modal	: false,
					mode	: 'record',
				},
				current		: false
			}

			if ( ! ( this.controller instanceof wp.media.view.MediaFrame.Select ) ) {

				if ( wp.media.cheese.supports.paste ) {

					pasteBtn = new wp.media.view.Button( {
						text		: l10n.copy_paste,
						className:  'grabber-button',
						priority	: -64,
						click: function() {
							self.cheese.active = self.cheese.paste;
							self.cheeseOpen( l10n.copy_paste );
						}
					} );
					this.cheese.paste.grabber = new wp.media.cheese.view.DataSourceImageGrabber( {
						controller	: this.controller,
						grabber		: wp.media.cheese.view.Pasteboard,
						wpuploader	: this.controller.uploader.uploader.uploader
					} );

					this.toolbar.set( 'pasteModeButton', pasteBtn.render() );
				}
				if ( wp.media.cheese.supports.webcam_recording ) {

					recordBtn = new wp.media.view.Button( {
						text		: l10n.take_snapshot,
						className:  'grabber-button',
						priority	: -65,
						click: function() {
							self.cheese.active = self.cheese.record;
							self.cheeseOpen( l10n.take_snapshot );
						}
					} );
					this.cheese.record.grabber = new wp.media.cheese.view.DataSourceImageGrabber( {
						controller	: this.controller,
						grabber		: wp.media.cheese.view.WebcamRecorder,
						wpuploader	: this.controller.uploader.uploader.uploader
					} );

					this.toolbar.set( 'recordModeButton', recordBtn.render() );
				}
			}
		},
		cheeseUploaded: function( e ) {
			this.cheese.active.grabber.dismiss();
			this.cheese.modal.close();
			this.cheeseClose();
		},
		cheeseError: function( e ) {
			console.log( 'error', e );
		},
		cheeseOpen: function( title ) {
			var self = this;

			this.cheese.modal  =  new wp.media.view.Modal( {
				controller : this,
				title      : title
			} );
			this.cheese.modal.content( this.cheese.active.grabber );
			this.cheese.modal.open();

			this.cheese.modal.on( 'close', function() {
				self.cheeseClose.apply(self);
				self.cheese.active.grabber.stopGrabbing();
			});

			this.cheese.active.grabber.startGrabbing();

			this.listenTo( this.cheese.active.grabber.uploader, 'action:uploaded:dataimage', this.cheeseUploaded );
			this.listenTo( this.cheese.active.grabber.uploader, 'error:uploaded:dataimage', this.cheeseError );
		},
		cheeseClose: function() {

			this.controller.deactivateMode( this.cheese.active.mode ).activateMode( 'edit' );

			this.stopListening( this.cheese.active.grabber.uploader, 'action:uploaded:dataimage' );
			this.stopListening( this.cheese.active.grabber.uploader, 'error:uploaded:dataimage' );
		}
	});
	
})(jQuery,window);

(function($){
var media       = wp.media,
//	Attachment  = media.model.Attachment,
//	Attachments = media.model.Attachments,
//	Query       = media.model.Query,
	l10n;

	l10n = media.view.l10n = typeof _wpMediaViewsL10n === 'undefined' ? {} : _wpMediaViewsL10n;

	// override this method completely.
	media.view.MediaFrame.Post.prototype.browseRouter = function( view ) {
		view.set({
			upload: {
				text:     l10n.uploadFilesTitle,
				priority: 20
			},
			record: {
				text:     'Record', // localize this!
				priority: 30
			},
			browse: {
				text:     l10n.mediaLibraryTitle,
				priority: 40
			}
		});
	};
	
	var bindHandlers = media.view.MediaFrame.Post.prototype.bindHandlers;
	var webcamRecorder;
	media.view.MediaFrame.Post.prototype.bindHandlers = function() {
		// parent handlers
		bindHandlers.apply( this, arguments );
		// add recorder create handler.
		this.on( 'content:create:record', this.recordContent, this );
//		this.on( 'content:render:record', this.recordContent, this );
		this.on( 'close', this.dismissRecorder, this );
	};
	media.view.MediaFrame.Post.prototype.recordContent = function( content ){
		var state = this.state();
		this.$el.removeClass('hide-toolbar');
		if ( ! webcamRecorder )
			webcamRecorder = new media.view.WebcamRecorder({});
		content.view = webcamRecorder.start();
	}
	media.view.MediaFrame.Post.prototype.dismissRecorder = function( content ) {
		if ( webcamRecorder.stop )
			webcamRecorder.stop();
	}
	
	
	media.view.WebcamRecorder = media.View.extend({
		tagName:   'div',
		className: 'webcam-recorder',
		_video : null,
		initialize: function() {
			_.defaults( this.options, {
			
			});
			var self = this;
			this._video = $('<video width="640" height="480" id="webcam-recorder" autoplay="autoplay"></video>')
				.appendTo(this.$el)
				.recorder({
					camera:true,
					microphone:false
				});
			var blob;
			$('<a href="#" class="recorder-reset">Reset</a>')
				.insertAfter(this._video).on('click',null,function(){
					$('.recorder-reset').css('display','none');
					$('.recorder-snapshot').css('display','inline');
					$('.recorder-okay').css('display','none');
					self._video.reset();
				}).css('display','none');
			$('<a href="#" class="recorder-snapshot">Record</a>')
				.insertAfter(this._video).on('click',null,function(){
					$('.recorder-reset').css('display','inline');
					$('.recorder-snapshot').css('display','none');
					$('.recorder-okay').css('display','inline');
					self._video.snapshot(function(b){blob=b;});
				}).css('display','inline');
			$('<a href="#" class="recorder-okay">Okay</a>')
				.insertAfter(this._video).on('click',null,function(){
					$('.recorder-reset').css('display','none');
					$('.recorder-snapshot').css('display','inline');
					$('.recorder-okay').css('display','none');
					var file = blob;
					// make file like object from
					// he might help: https://github.com/blueimp/JavaScript-Canvas-to-Blob
					if ( file )
						do_upload( file )
					
				}).css('display','none');
			
			
			function do_upload( file ) {
				var attributes = _.extend({
					file:      file,
					uploading: true,
					date:      new Date(),
					filename:  file.name,
					menuOrder: 0,
					uploadedTo: wp.media.model.settings.post.id
				}, _.pick( file, 'loaded', 'size', 'percent' ) );

				// Handle early mime type scanning for images.
				image = /(?:jpe?g|png|gif)$/i.exec( file.name );

				// Did we find an image?
				if ( image ) {
					attributes.type = 'image';

					// `jpeg`, `png` and `gif` are valid subtypes.
					// `jpg` is not, so map it to `jpeg`.
					attributes.subtype = ( 'jpg' === image[0] ) ? 'jpeg' : image[0];
				}

				// Create the `Attachment`.
				file.attachment = wp.media.model.Attachment.create( attributes );

				wp.Uploader.queue.add( file.attachment );
				console.log(media,media.view.MediaFrame);
				// don't care!
//				wp.Uploader.added( file.attachment );
			}
//			console.log(wp.Uploader); // ( file, fileName )
			// add record button
			// add
			
			
		},
		start : function(){
			if ( this._video )
				this._video.start();
			return this;
		},
		stop : function(){
			if ( this._video )
				this._video.stop();
			return this;
		}
	});
	
	return;




})(jQuery);

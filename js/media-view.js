(function($){
var media       = wp.media,
//	Attachment  = media.model.Attachment,
//	Attachments = media.model.Attachments,
//	Query       = media.model.Query,
	l10n;

	l10n = media.view.l10n = typeof _wpMediaViewsL10n === 'undefined' ? {} : _wpMediaViewsL10n;

	// override media input methods.
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
	
	var bindHandlers = media.view.MediaFrame.Post.prototype.bindHandlers,
		webcamRecorder,frame;
	
	media.view.MediaFrame.Post.prototype.bindHandlers = function() {
		// parent handlers
		bindHandlers.apply( this, arguments );
		// add recorder create handler.
		this.on( 'content:create:record', this.recordContent, this );
		this.on( 'close', this.dismissRecorder, this );
		frame = this;
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
			var self = this, 
				blob;



			var b64Data = 'R0lGODdhUAA8AIABAAAAAP///ywAAAAAUAA8AAACS4SPqcvtD6' +
					'OctNqLs968+w+G4kiW5omm6sq27gvH8kzX9o3n+s73/g8MCofE' +
					'ovGITCqXzKbzCY1Kp9Sq9YrNarfcrvcLDovH5PKsAAA7',
				imageUrl = 'data:image/gif;base64,' + b64Data;

			var $img = $('<img src="'+imageUrl+'" />')
				.appendTo(this.$el)
			$('<a href="#" class="recorder-okay">Okay</a>')
				.insertAfter($img).on('click',null,function(){

					file = window.dataURLtoBlob && window.dataURLtoBlob($img.get(0).src)
					file.loaded = file.size;
					file.percent = 100;
					file.id = 'id'+(new Date()).getTime();
					file.status = 1;

					var attributes = _.extend({
						file:      file,
						uploading: true,
						date:      new Date(),
						filename:  'Snapshot.gif',
						menuOrder: 0,
						uploadedTo: wp.media.model.settings.post.id,
						type : 'image',
						type : 'gif'
					}, _.pick( file, 'loaded', 'size', 'percent' ) );

					file.attachment = wp.media.model.Attachment.create( attributes );
					wp.Uploader.queue.add(file.attachment);
					wp.Uploader.refresh();
			});

			/*
			this._video = $('<video width="640" height="480" id="webcam-recorder" autoplay="autoplay"></video>')
				.appendTo(this.$el)
				.recorder({
					camera:true,
					microphone:false
				});
			$('<a href="#" class="recorder-reset">Reset</a>')
				.insertAfter(this._video).on('click',null,function(){
					$('.recorder-reset').css('display','none');
					$('.recorder-snapshot').css('display','inline');
					$('.recorder-okay').css('display','none');
					self._video.reset();
					return false;
				}).css('display','none');
			$('<a href="#" class="recorder-snapshot">Record</a>')
				.insertAfter(this._video).on('click',null,function(){
					$('.recorder-reset').css('display','inline');
					$('.recorder-snapshot').css('display','none');
					$('.recorder-okay').css('display','inline');
					self._video.snapshot(function(b){blob=b;});
					return false;
				}).css('display','inline');
			$('<a href="#" class="recorder-okay">Okay</a>')
				.insertAfter(this._video).on('click',null,function(){
					$('.recorder-reset').css('display','inline');
					$('.recorder-snapshot').css('display','none');
					$('.recorder-okay').css('display','none');
					// he did help: https://github.com/blueimp/JavaScript-Canvas-to-Blob
					if ( blob )
						do_upload( blob );
					return false;
					
				}).css('display','none');
			
			
			function do_upload( file ) {
				file.loaded = file.size;
				file.percent = 100;
				file.id = 'id'+(new Date()).getTime();
				
				var attributes = _.extend({
					file:      file,
					uploading: true,
					date:      new Date(),
					filename:  'Snapshot.png',
					menuOrder: 0,
					uploadedTo: wp.media.model.settings.post.id
				}, _.pick( file, 'loaded', 'size', 'percent' ) );

				// Handle early mime type scanning for images.
				image = /(?:jpe?g|png|gif)$/i.exec( file.name || file.type );

				// Did we find an image?
				if ( image ) {
					attributes.type = 'image';

					// `jpeg`, `png` and `gif` are valid subtypes.
					// `jpg` is not, so map it to `jpeg`.
					attributes.subtype = ( 'jpg' === image[0] ) ? 'jpeg' : image[0];
				}
				
				// Create the `Attachment`.
				file.attachment = wp.media.model.Attachment.create( attributes );
console.log(file);
				wp.Uploader.queue.add( file.attachment );
				frame.uploader.uploader.added(file.attachment);
				frame.uploader.uploader.refresh(file.attachment);
//				frame.uploader.uploader.uploader.refresh();
//				frame.uploader.uploader.uploader.start();
			}
			
			*/
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

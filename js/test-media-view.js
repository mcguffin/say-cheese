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
			dataurltest: {
				text:     'DataUrl Test', 
				priority: 30
			},
			browse: {
				text:     l10n.mediaLibraryTitle,
				priority: 40
			}
		});
	};
	
	var bindHandlers = media.view.MediaFrame.Post.prototype.bindHandlers,
		dataUrlTest, frame;
	
	media.view.MediaFrame.Post.prototype.bindHandlers = function() {
		// parent handlers
		bindHandlers.apply( this, arguments );
		// add create handler.
		this.on( 'content:create:dataurltest', this.dataurltestContent, this );
		frame = this;
	};
	media.view.MediaFrame.Post.prototype.dataurltestContent = function( content ){
		var state = this.state();
		this.$el.removeClass('hide-toolbar');
		dataUrlTest = new media.view.dataUrlTest({});
		content.view = dataUrlTest;
	}
	
	
	media.view.dataUrlTest = media.View.extend({
		tagName:   'div',
		className: 'data-url-test',
		
		initialize: function() {
			_.defaults( this.options, {
			
			});
			var self = this, 
				blob;



			var b64Data = 'R0lGODdhUAA8AIABAAAAAP///ywAAAAAUAA8AAACS4SPqcvtD6' +
					'OctNqLs968+w+G4kiW5omm6sq27gvH8kzX9o3n+s73/g8MCofE' +
					'ovGITCqXzKbzCY1Kp9Sq9YrNarfcrvcLDovH5PKsAAA7',
				imageUrl = 'data:image/gif;base64,' + b64Data,
				$img = $('<img src="'+imageUrl+'" />')
					.appendTo(this.$el);
			
			$('<a href="#" class="test-send">Okay</a>')
				.insertAfter($img)
				.on('click',null,function(){
					// creating a blob:
					//blob = window.dataURLtoBlob && window.dataURLtoBlob($img.get(0).src)
					
					var file = new plupload.File(null,b64Data);
					file.name = 'test.gif';
					file.id = 'id'+(new Date()).getTime(); 
					
					var attributes = _.extend({
						file:      file,
						uploading: true,
						date:      new Date(),
						filename:  'test.gif',
						menuOrder: 0,
						uploadedTo: wp.media.model.settings.post.id,
						type : 'image',
						subtype : 'gif'
					}, _.pick( file, 'loaded', 'size', 'percent' ) );

					file.attachment = wp.media.model.Attachment.create( attributes );
					wp.Uploader.queue.add(file.attachment);
					frame.uploader.uploader.uploader.refresh();
					frame.uploader.uploader.uploader.start();
//					wp.Uploader.refresh();
				});
			
		},
	});
	
	return;




})(jQuery);

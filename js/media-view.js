(function($,window){
	var media       = wp.media,
		bindHandlers = media.view.MediaFrame.Post.prototype.bindHandlers,
		cheese = window.cheese,
		l10n, recorderContent , pasteContent;

	var webcamRecorder,frame,$video,is_video;

	l10n = media.view.l10n = typeof _wpMediaViewsL10n === 'undefined' ? {} : _wpMediaViewsL10n;
	l10n = _.extend(l10n,cheese_l10n);
	// override media input methods.
	media.view.MediaFrame.Post.prototype.browseRouter = function( view ) {
		var set_data = {};
		set_data.upload = {
			text:     l10n.uploadFilesTitle,
			priority: 20
		};
		if (cheese.supports.upload_data_url) {
			// if webcam recording supported
			if ( cheese.supports.webcam_recording ) {
				set_data.record = {
					text:     l10n.webcam_record,
					priority: 30
				};
			}
			// if paste recording supported
			if ( cheese.supports.paste ) {
				set_data.pasteboard = {
					text:     l10n.copy_paste,
					priority: 35
				};
			}
		}
		set_data.browse = {
			text:     l10n.mediaLibraryTitle,
			priority: 40
		};
		view.set(set_data);
	};
	
	
	media.view.MediaFrame.Post.prototype.bindHandlers = function() {
		// parent handlers
		bindHandlers.apply( this, arguments );
		// add recorder create handler.
		this.on( 'content:render', this.contentRender, this );
		this.on( 'content:render:record', this.contentRenderRecord, this );
		this.on( 'content:render:pasteboard', this.contentRenderPasteboard, this );
		this.on( 'content:create:record', this.contentCreateRecord, this );
		this.on( 'content:create:pasteboard', this.contentCreatePasteboard, this );
		
		this.on( 'action:create:dataimage' , this.createDataImage , this );
		this.on( 'action:discard:dataimage' , this.discardDataImage , this );
		this.on( 'action:upload:dataimage' , this.uploadDataImage , this );
		// upload triggered: upload to server ... 
		
//		this.on( 'content:render:record', this.recordRender, this );
		this.on( 'close', this.dismissContent, this );
		console.log('set events '+(new Date().getTime()));
		frame = this;
	};
	media.view.MediaFrame.Post.prototype.contentRender = function( content ){
		if ( !! recorderContent && this.content.mode() != 'record' )
			recorderContent.stop();
		if ( !! pasteContent && this.content.mode() != 'pasteboard' )
			pasteContent.stop();
	}
	media.view.MediaFrame.Post.prototype.contentRenderPasteboard = function( content ){
		pasteContent.start();
		this._current = pasteContent;
	}
	media.view.MediaFrame.Post.prototype.contentRenderRecord = function( content ){
		if (recorderContent.get_state() in {waiting:1,error:1})
			recorderContent.start();
		this._current = recorderContent;
	}
	media.view.MediaFrame.Post.prototype.contentCreateRecord = function( content ){
		var state = this.state();
		this.$el.removeClass('hide-toolbar');
		recorderContent = content.view = new media.view.WebcamRecorder({controller:this});
	}
	
	
	media.view.MediaFrame.Post.prototype.createDataImage = function( view , imagedata ) {
		this.dismissContent(); // || paste stop
		var img = new media.view.DataSourceImage({ imagedata:imagedata , controller:this });
		view.$el.append(img.$el);
	}
	media.view.MediaFrame.Post.prototype.discardDataImage = function( img ) {
		img.$el.remove();

		if ( this.content.mode() == 'record' && !! recorderContent )
			recorderContent.start();
		else if ( this.content.mode() == 'pasteboard' && !! pasteContent )
			pasteContent.start();
	}
	media.view.MediaFrame.Post.prototype.uploadDataImage = function( img ) {
		cheese.send_img(img.get_img(),img.get_title(),frame);
		img.done_upload();
	}
	
	media.view.MediaFrame.Post.prototype.dismissContent = function( content ) {
		this._current && this._current.stop && this._current.stop();
	}
	
	
	
	media.view.MediaFrame.Post.prototype.contentCreatePasteboard = function( content ){
		var state = this.state();
		this.$el.removeClass('hide-toolbar');
		pasteContent = content.view = new media.view.Pasteboard({controller:this});
	}
	
	
	
	
	
	media.view.Pasteboard = media.View.extend({
		tagName:   'div',
		className: 'pasteboard',
		controller:null,
		_content : null,
		_pasteboard : null,
		
		initialize: function() {
			_.defaults( this.options, {
			});
			var self = this;
			
			this._content = $('<div class="pasteboard-inline-content"><h3>'+l10n.paste_instructions+'</h3></div>')
				.appendTo(this.$el);
			this._pasteboard = $('<div id="pasteboard-injector"></div>')
				.appendTo(this._content);
			
		},
		start : function(){
			var self = this;
			this._pasteboard
				.imagepastebox({
					messages : {
						no_image_pasted : l10n.paste_error_no_image,
						no_processible_image_pasted : l10n.paste_error_webkit_fake_image,
					}
				})
				.on('pasteimage' , '' , function( e , data ){
					console.log(data);
					self.controller.trigger('action:create:dataimage', self , data );
					return false;
				} )
				.focus();
		},
		stop : function(){
			this._pasteboard
				.imagepastebox('off')
				.off('pasteimage');
		}
	});

	
	
	media.view.WebcamRecorder = media.View.extend({
		tagName:   'div',
		className: 'webcam-recorder',
		controller:null,
		_webcam : null,
		_recorder : null,
		
		initialize: function() {
			_.defaults( this.options, {
			});
			var self = this;


			this._recorder = $('<div class="recorder"><div class="instruments">\
					<a href="#" class="recorder-record button-primary"><span class="dashicons dashicons-video-alt2"></span>'+l10n.record+'</a>\
				</div></div>')
				.appendTo( this.$el )
				.on('click','.recorder-record',function(event){
					event.preventDefault( );
					self.controller.trigger('action:create:dataimage', self , self._webcam.snapshot() );
					return false;
				});
			if ( ! this._webcam )
				this._webcam = cheese.create_webcam_recorder( this._recorder );
			
			this._recorder.hide();
		},
		get_state : function() {
			return this._webcam.state;
			// states: ds-image existing
			// camera running
			// camera error
			// camera waiting
		},
		start : function() {
			this._recorder.show();
			this._webcam.start();
			return this;
		},
		stop : function(){
			this._webcam.stop();
			this._recorder.hide();
			return this;
		}
	});
	

	media.view.DataSourceImage = function( options ) {
		_.defaults( options , {
			title: l10n.image,
			imagedata: null,
			controller: null,
			_image:null,
		} );
		_.defaults( this , options );
		var self = this;

		this.$el = $('<div class="data-source-image">\
			<img src="'+this.imagedata+'" />\
			<div class="instruments">\
				<a href="#" class="image-discard button-secondary"><span class="dashicons dashicons-arrow-left"></span>'+l10n.try_again+'</a>\
				<label class="setting"><span>'+l10n.title+'</span><input class="alignment" type="text" data-setting="title" value="'+this.title+'" /></label>\
				<a href="#" class="image-upload button-primary"><span class="dashicons dashicons-yes"></span>'+l10n.upload+'</a>\
			</div></div>');
		
		this.$el.on( 'click' , '.image-discard' , function(event){
			self.controller.trigger( 'action:discard:dataimage' , self );
		} );
		this.$el.on( 'click' , '.image-upload' , function(event){
			self.controller.trigger( 'action:upload:dataimage' , self );
		} );
		
		this.get_img = function(){
			return this.$el.find('img')[0];
		}
		this.get_title = function(){
			return this.$el.find('input').val();
		}
		this.done_upload = function(){
			this.$el.find('.setting,.image-upload').hide();
		}
	};

})(jQuery,window);

(function($,window,o){
	var cheese = window.cheese,
		Button = wp.media.view.Button,
		Modal  = wp.media.view.Modal,
		l10n   = cheese_options.l10n;

// 	_.extend( wp.media.view.MediaFrame.prototype, {
// 		_parentInitialize: wp.media.view.MediaFrame.prototype.initialize,
// 		initialize: function() {
// 			mediaFrame = this;
// 			console.log("setMediaFrame");
// 			this._parentInitialize.apply(this,arguments);
// 		}
// 	} );
	
	wp.media.cheese.view.NameInput = wp.media.View.extend({
		tagName:   'label',
		className: 'setting',
		_input : null,
		
		initialize:function() {
			_.defaults( this.options, {
				defaultValue : 'untitled',
				title:l10n.title,
			});
			this._input = $('<input class="alignment" type="text" data-setting="title" />');
			this.$el
				.append('<span>'+this.options.title+'</span>')
				.append(this._input);
		},
		render : function() {
			if ( ! this._input.val() )
				this._input.val( this.options.defaultValue );
		},
		val : function(){
			var v = this._input.val();
			return v || this.options.defaultValue;
		}
	});
	
	
	wp.media.cheese.view.ActionButton = Button.extend({
		dashicon : 'yes',
		render : function(){
			_.defaults( this.options, {
				dashicon : 'yes',
			});
			var ret = wp.media.view.Button.prototype.render.apply(this,arguments);
			this.$el.addClass('button-action');
			this.$el.prepend('<span class="dashicons dashicons-'+this.options.dashicon+'"></span>');
			if ( this.model.disabled )
				this.$el.addClass('disabled');
			else
				this.$el.removeClass('disabled');
			return ret;
		}
	});
	

	wp.media.cheese.view.DataSourceImageUploader = wp.media.View.extend({
		tagName:   'div',
		className: 'data-source-image',
		controller:null,
		image : null,
		discardBtn : null,
		nameInput : null,
		uploadBtn : null,
		
		uploader : null,
		
		_model : {},
		
		initialize : function() {

			wp.media.View.prototype.initialize.apply( this, arguments );

			_.defaults( this.options, {
				defaultFileName : l10n.image
			});
			var self = this,
				instr = new wp.media.View({
				tagName    : 'div',
				className  : 'instruments',
				controller : this.controller
			});

			this.uploader = this.options.uploder;

			this.discardBtn = new wp.media.cheese.view.ActionButton({
				className : 'image-discard',
				model: this.disabledModel,
				controller:this.controller,
				style:'secondary',
				text : l10n.try_again,
				dashicon : 'arrow-left',
				click: function(){
					self.discardImage.apply( self, arguments );
				}
			});
			this.nameInput = new wp.media.cheese.view.NameInput({
				defaultValue : this.options.defaultFileName
			});
			this.uploadBtn = new wp.media.cheese.view.ActionButton({
				className : 'image-upload',
				model: this.disabledModel,
				controller:this.controller,
				style:'primary',
				text : l10n.upload,
				click: function() {
					self.uploadImage.apply( self, arguments ); 
				}
			});
			
			
			this.views.add(instr);

			instr.views.add( this.discardBtn );
			instr.views.add( this.nameInput );
			instr.views.add( this.uploadBtn );
			
			this.$imageContainer = false;

		//	this.bindUploaderEvents();
		},
		setImageData : function( data ) {
			var container = this.$el.find('.image-container').html('').get(0),
				self = this;
			if ( this.image ) 
				this.image.destroy();

			this.image = new o.Image();
			this.image.onload = function() {
				var opts = self.getUploader().getOption('resize'),
					scale = Math.max( opts.width / this.width, opts.height / this.height );
				!!opts && (scale < 1) && this.downsize( this.width*scale, this.height*scale );
				this.embed( container );
			}
			this.image.bind('Resize', function(e) {
				this.embed( container );
			});
			this.image.load( data );
			if ( this.$imageContainer )
				this.$imageContainer.append(this.image);
			this.disabled(false);
			return this;
		},
		render : function() {
			this.$imageContainer = $('<span class="image-container" />');
			this.$el.prepend(this.$imageContainer);
		},
		discardImage : function(){
			this.trigger( 'action:discard:dataimage' , this );
			this.unbindUploaderEvents();
		},
		uploadImage : function() {
//			
			var type = 'image/png',
				name = this.nameInput.val() + '.png',
				blob = this.image.getAsBlob( type );

			this.bindUploaderEvents();

			blob.detach( blob.getSource() );
			blob.name = name;
			blob.type = type;
			this.getUploader().addFile( blob , name );

			this.disabled( true );

			this.trigger( 'action:upload:dataimage' , this );
		},
		show:function(){
			this.$el.show();
			return this;
		},
		hide:function(){
			this.$el.hide();
			return this;
		},
		disabled : function( disabled ) {
			this.discardBtn.model.set( 'disabled', disabled );
			this.uploadBtn.model.set( 'disabled', disabled );
		},
		_uploadSuccessHandler : function() {
			this.trigger( 'action:uploaded:dataimage' );
			this.disabled(false);
			this.unbindUploaderEvents();
		},
		_uploadErrorHandler : function() {
			this.trigger( 'error:uploaded:dataimage' );
			this.disabled(false);
			this.unbindUploaderEvents();
		},
		bindUploaderEvents : function() {
			this.getUploader().bind( 'FileUploaded',	this._uploadSuccessHandler,	this );
			this.getUploader().bind( 'Error',			this._uploadErrorHandler,	this );
		},
		unbindUploaderEvents : function() {
			this.getUploader().unbind( 'FileUploaded',	this._uploadSuccessHandler,	this );
			this.getUploader().unbind( 'Error',			this._uploadErrorHandler,	this );
		},
		getUploader: function() {
			return this.controller.uploader.uploader.uploader;
		}
	});
	
	
	
	wp.media.cheese.view.WebcamRecorder = wp.media.View.extend({
		tagName:   'div',
		className: 'webcam-recorder',
		controller:null,
		action:'record',
		_webcam : null,
		_recorder : null,
		_instruments : null,
		
		initialize: function() {
			_.defaults( this.options, {
			});
			var self = this;


			this._recorder = $('<div class="recorder"></div>')
				.appendTo( this.$el )
				.on('click','.recorder-record',function(event) {
					event.preventDefault( );
					self.trigger('action:create:dataimage', self , self._webcam.snapshot() );
					self.stop();
					return false;
				});
			this._instruments = $('<div class="instruments">'
					+ '<a href="#" class="button recorder-record button-primary button-action"><span class="dashicons dashicons-video-alt2"></span>'+l10n.record+'</a>'
				+ '</div>')
				.appendTo(this._recorder);
			this.$el.on('click','.error-try-again',function(){
				self.start();
				self.$el.find('.error').remove();
			});
			if ( ! this._webcam ) {
				var recorderOptions = {
						camera:{mandatory:{
							minWidth: 640,
							minHeight: 480
						}},
						microphone:false
					};
				this._webcam = $(this._recorder).recorder(recorderOptions);
			
				this._webcam.on('recorder:state:ready' , function(e){
// 					setTimeout( function(){self.start()} , 50 );
				} ); // html5 fires on create. Bad...
				this._webcam.on('recorder:state:waiting',function(e){
					self._instruments.hide();
				});
				this._webcam.on('recorder:state:started',function(e){ 
					self._instruments.show();
				});
				this._webcam.on('recorder:state:error',function(e){
					self.$el.append('<div class="error recorder-inline-content"><h3>'+l10n.an_error_occured+'</h3><p><a class="error-try-again" href="#">'+l10n.try_again+'</a></p></div>');
					self._instruments.hide();
				});
				this._webcam.on('recorder:state:permissionerror',function( event, element, err ){
					var msg = err.message || l10n.please_allow_camera_message;
					self.$el.append('<div class="error recorder-inline-content"><h3>'+msg+'</h3><p><a class="error-try-again" href="#">'+l10n.try_again+'</a></p></div>');
					self._instruments.hide();
				});
				this._webcam.on('recorder:state:stopped',function(e){
					self._instruments.hide();
				});
			}

			this._instruments.hide();
		},
		get_state : function() {
			return this._webcam.state;
			// states: ds-image existing
			// camera running
			// camera error
			// camera waiting
		},
		start : function() {
			var self = this;
			if ( ! this._recorder.is(':visible') )
				this._recorder.show();
			this._webcam.start();
			return this;
		},
		stop : function(){
			this._webcam.stop();
			if ( this._recorder.is(':visible') )
				this._recorder.hide();
			return this;
		},
		show:function(){
			this.$el.show();
			return this;
		},
		hide:function(){
			this.$el.hide();
			return this;
		}
	});
	
	wp.media.cheese.view.Pasteboard = wp.media.View.extend({
		tagName:   'div',
		className: 'pasteboard',
		controller:null,
		action:'paste',
		_content : null,
		_pasteboard : null,
		
		initialize: function() {
			_.defaults( this.options, {
			});
			var self = this;
			
			this._pasteboard = $( '<div id="pasteboard-injector" contenteditable tabindex="0"></div>' )
				.appendTo( this.$el );	
			this._status = $('<div class="pasteboard-status"></div>')
				.appendTo(this.$el);
			this._pasteboard.pastableContenteditable();
			
		},
		start : function(){
			var self = this;

			this.show_instructions();

			this._pasteboard
				.on('pasteImage' , function( e, data ) {
					self.trigger( 'action:create:dataimage', this , data.dataURL );
				} )
				.on('pasteImageError' , function( e, data ) {
					self.show_message( l10n.paste_error );
					$( this ).html('');
				} )
				.on('pasteText' , function( e, data ) {
					self.show_message( l10n.paste_error_no_image );
					$( this ).html('');
				} )
				.focus();
			return this;
		},
		stop : function(){
			this._pasteboard
				.off('pasteImage')
				.off('pasteImageError')
				.off('pasteText');
			return this;
		},
		show:function(){
			this.$el.show();
			return this;
		},
		hide:function(){
			this.$el.hide();
			return this;
		},
		show_message:function( msg ) {
			this._status.html( '<div class="message">' + msg + '</div>' );
		},
		show_instructions:function() {
			this._status.html( '<div class="instructions">' + l10n.paste_instructions + '</div>' );
		}
	});

	wp.media.cheese.view.DataSourceImageGrabber = wp.media.View.extend({
		tagName:   'div',
		className : 'image-grabber',
		
		grabber : null,
		uploader : null,
		
		initialize : function() {
			wp.media.View.prototype.initialize.apply( this, arguments );

			_.defaults( this.options, {
				wpuploader	: null,
//				grabber : wp.media.cheese.view.WebcamRecorder
			});

			var defaultFileName = (this.options.grabber == wp.media.cheese.view.WebcamRecorder) 
						? l10n.snapshot 
						: ((this.options.grabber == wp.media.cheese.view.Pasteboard) 
							? l10n.pasted 
							: l10n.image 
						),
				title 		= (this.options.grabber == wp.media.cheese.view.WebcamRecorder) 
								? l10n.take_snapshot 
								: ((this.options.grabber == wp.media.cheese.view.Pasteboard) 
									? l10n.copy_paste 
									: l10n.image 
								),
				wrap		= new wp.media.View({
					className : 'image-grabber-content',
					tagName : 'div',
					controller:this.controller
				}), 
				titleDiv	= new wp.media.View({
					className : 'media-frame-title',
					tagName : 'div'
				}),
				titleH1		= new wp.media.View({
					tagName : 'h1'
				});

			this.grabber  = new this.options.grabber( { controller	: this.controller } );

			this.uploader = new wp.media.cheese.view.DataSourceImageUploader( {	
									controller		: this.controller,
									uploder			: this.options.wpuploader,
									defaultFileName	: defaultFileName
								});

			wrap.views.add( this.grabber );
			wrap.views.add( this.uploader );
			titleH1.$el.text( title );
			titleDiv.views.add( titleH1 );
			this.views.add( titleDiv );
			this.views.add( wrap );

			this.listenTo( this.grabber, 'action:create:dataimage',	this.imageCreated );
			this.listenTo( this.uploader, 'action:discard:dataimage',	this.startGrabbing );
		},
		imageCreated : function( grabber , imageData ) {
			this.grabber.stop().hide();
			this.uploader.show().setImageData( imageData );
		},
		startGrabbing:function() {
			this.uploader.hide();
			this.grabber.show().start();
			return this;
		},
		getAction : function() {
			return this.grabber.action;
		},
		dismiss:function() {
			this.grabber.stop();
			return this;
		}
	});

})(jQuery,window,mOxie);

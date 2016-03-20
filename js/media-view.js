(function($,window,o){
	var cheese = window.cheese,
		Button = wp.media.view.Button,
		Modal  = wp.media.view.Modal,
		l10n   = wp.media.view.l10n = typeof _wpMediaViewsL10n === 'undefined' ? {} : _wpMediaViewsL10n,
		mediaFrame, imageUploader;

	l10n = _.extend(l10n,cheese_l10n);
	
	var oldMFInit = wp.media.view.MediaFrame.prototype.initialize;
	wp.media.view.MediaFrame.prototype.initialize = function() {
		mediaFrame = this;
		oldMFInit.apply(this,arguments);
	}
	
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
			_.defaults( this.options, {
				defaultFileName : l10n.image
			});
			var self = this;
			imageUploader = this;

			var instr = new wp.media.View({
				tagName    : 'div',
				className  : 'instruments',
				controller : this.controller
			});
			this.discardBtn = new wp.media.cheese.view.ActionButton({
				className : 'image-discard',
				style:'secondary',
				text : l10n.try_again,
				dashicon : 'arrow-left',
				controller:this.controller,
				click:function(){ self.discardImage.apply(self,arguments); }
			});
			this.nameInput = new wp.media.cheese.view.NameInput({
				defaultValue : this.options.defaultFileName
			});
			this.uploadBtn = new wp.media.cheese.view.ActionButton({
				className : 'image-upload',
				style:'primary',
				text : l10n.upload,
				controller:this.controller,
				click:function(){ self.uploadImage.apply(self,arguments); }
			});
			
			
			this.views.add(instr);
			instr.views.add( this.discardBtn );
			instr.views.add( this.nameInput );
			instr.views.add( this.uploadBtn );
			
			this.$imageContainer = false;
		},
		setImageData : function( data ) {
			var container = this.$el.find('.image-container').html('').get(0);
			if ( this.image ) 
				this.image.destroy();
			
			this.image = new o.Image();
			this.image.onload = function() {
				var opts = mediaFrame.uploader.uploader.uploader.getOption('resize'),
					scale = Math.max(opts.width/this.width,opts.height/this.height);
				!!opts && (scale < 1) && this.downsize(this.width*scale,this.height*scale);
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
			this.controller.trigger( 'action:discard:dataimage' , this );
		},
		uploadImage : function() {
			this.bindEvents();
			var blob = this.image.getAsBlob( 'image/png' ),
				self = this;

			blob.detach(blob.getSource());
			blob.name = this.nameInput.val() + '.png';
			mediaFrame.uploader.uploader.uploader.addFile( blob , this.nameInput.val() + '.png' );

			this.disabled(true);

			this.controller.trigger( 'action:upload:dataimage' , this );
		},
		show:function(){
			this.$el.show();
			return this;
		},
		hide:function(){
			this.$el.hide();
			return this;
		},
		disabled : function(disabled) {
			this.uploadBtn.model.disabled = this.discardBtn.model.disabled = disabled;
			this.uploadBtn.render();
			this.discardBtn.render();
		},
		_uploadSuccessHandler : function(){
			this.controller.trigger( 'action:uploaded:dataimage' );
			imageUploader.disabled(false);
		},
		_uploadErrorHandler : function(){
			this.controller.trigger( 'error:uploaded:dataimage' );
			imageUploader.disabled(false);
		},
		bindEvents : function(){
			mediaFrame.uploader.uploader.uploader.bind( 'FileUploaded',	this._uploadSuccessHandler,	this );
			mediaFrame.uploader.uploader.uploader.bind( 'Error',		this._uploadErrorHandler,	this );
		}
// doesn't work.
// 		,
// 		unbindEvents : function() {
// 			mediaFrame.uploader.uploader.uploader.unbind( 'FileUploaded' , this._uploadSuccessHandler , false );
// 			mediaFrame.uploader.uploader.uploader.unbind( 'Error' , this._uploadErrorHandler , false );
// 		}
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
					self.controller.trigger('action:create:dataimage', self , self._webcam.snapshot() );
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
						microphone:false,
						flash : {
							swf_url : l10n.swf_url
						}
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
			
			this._content = $('<div class="pasteboard-inline-content"><h3>' + l10n.paste_instructions + '</h3></div>')
				.appendTo(this.$el);
			this._pasteboard = $( '<div id="pasteboard-injector"></div>' )
				.appendTo( this._content );	
			
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
				.on('pasteimage' , function( e , data ) {
					self._onPaste( data );
				} )
				.focus();
			this.listenTo( this.pasteboard, 'pasteimage' , this._onPaste );
			return this;
		},
		stop : function(){
			this._pasteboard
				.imagepastebox('off')
				.off('pasteimage');
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
		_onPaste : function( data ) {
			this.controller.trigger( 'action:create:dataimage', this , data );
		}
	});

	wp.media.cheese.view.DataSourceImageGrabber = wp.media.View.extend({
		tagName:   'div',
		className : 'image-grabber',
		
		_grabber : null,
		_uploader : null,
		
		initialize : function() {
			_.defaults( this.options, {
				grabber : wp.media.cheese.view.WebcamRecorder
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

			this._grabber  = new this.options.grabber( { controller	: this.controller } );
			this._uploader = new wp.media.cheese.view.DataSourceImageUploader( {	controller		: this.controller,
																		defaultFileName	: defaultFileName
																	});

			wrap.views.add( this._grabber );
			wrap.views.add( this._uploader );
			titleH1.$el.text( title );
			titleDiv.views.add( titleH1 );
			this.views.add( titleDiv );
			this.views.add( wrap );

			this.controller.on( 'action:create:dataimage',		this.imageCreated, 		this );
			this.controller.on( 'action:discard:dataimage',		this.startGrabbing,		this );
		},
		imageCreated : function( grabber , imageData ) {
			this._grabber.stop().hide();
			this._uploader.show().setImageData(imageData);
		},
		startGrabbing:function(){
			this._uploader.hide();
			this._grabber.show().start();
			return this;
		},
		getAction : function(){
			return this._grabber.action;
		},
		dismiss:function(){
			this._grabber.stop();
			return this;
		}
	});

	// at media grid view
	wp.media.cheese.view.GrabberButton = Button.extend({
		className:  'grabber-button',
		_grabber : null,
		_modal : null,
		
		initialize: function( options ) {
			Button.prototype.initialize.apply( this, arguments );
			var action;
			_.defaults( this.options, {
				grabber : null,
				title   : 'Image Grabber'
			});
			this._grabber = new wp.media.cheese.view.DataSourceImageGrabber({ 
				controller: this.controller , 
				grabber:    this.options.grabber 
			});
			this._modal = new Modal({
				controller: $(), // use empty controller. modal must not propagate 'ready' event, otherwise Backbone.History gets started twice 
				title:      this.options.title
			});

			this._modal.content( this._grabber );

			action = this._grabber.getAction();
			this.controller.on( action+':activate '+action+':deactivate',	this.toggleModeHandler,	this );
			this.controller.on( action+':action:done', 						this.back,				this );
			this.controller.on( 'action:uploaded:dataimage',				this.uploadDone,		this );
			this.controller.on( 'error:uploaded:dataimage',					this.uploadDone,		this );
			this._modal.on( 'close', this.back, this );
		},
		uploadDone:function(){
// 			this._grabber.dismiss();
 			this._modal.close();
		},
		back: function () {
			this._grabber.dismiss();
			this.controller.deactivateMode( this._grabber.getAction() ).activateMode( 'edit' );
		},

		click: function() {
			Button.prototype.click.apply( this, arguments );
			if ( ! this.controller.isModeActive( this._grabber.getAction() ) ) {
				this.controller.deactivateMode( 'edit' ).activateMode( this._grabber.getAction() );
				this._modal.open();
				this._grabber.startGrabbing();
			}
		}

	});


})(jQuery,window,mOxie);

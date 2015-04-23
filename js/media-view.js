(function($,window,o){
	var cheese = window.cheese,
		media  = wp.media,
		Button = media.view.Button,
		Modal  = media.view.Modal,
		l10n   = media.view.l10n = typeof _wpMediaViewsL10n === 'undefined' ? {} : _wpMediaViewsL10n,
		mediaFrame;

	l10n = _.extend(l10n,cheese_l10n);
	
	var oldMFInit = wp.media.view.MediaFrame.prototype.initialize;
	wp.media.view.MediaFrame.prototype.initialize = function() {
		mediaFrame = this;
		oldMFInit.apply(this,arguments);
	}
	
	media.view.NameInput = media.View.extend({
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
			return v || this.options.defaultValue;//l10n.image;
		}
	});
	
	
	media.view.ActionButton = media.view.Button.extend({
		dashicon : 'yes',
		render : function(){
			_.defaults( this.options, {
				dashicon : 'yes',
			});
			media.view.Button.prototype.render.apply(this,arguments);
			this.$el.addClass('button-action');
			this.$el.prepend('<span class="dashicons dashicons-'+this.options.dashicon+'"></span>');
			if ( this.model.disabled )
				this.$el.addClass('disabled');
			else
				this.$el.removeClass('disabled');
		}
	});
	

	media.view.DataSourceImageUploader = media.View.extend({
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

			var instr = new media.View({
				tagName    : 'div',
				className  : 'instruments',
				controller : this
			});
			this.discardBtn = new media.view.ActionButton({
				className : 'image-discard',
				style:'secondary',
				text : l10n.try_again,
				dashicon : 'arrow-left',
				controller:this,
				click:function(){ self.discardImage.apply(self,arguments); }
			});
			this.nameInput = new media.view.NameInput({
				defaultValue : this.options.defaultFileName
			});
			this.uploadBtn = new media.view.ActionButton({
				className : 'image-upload',
				style:'primary',
				text : l10n.upload,
				controller:this,
				click:function(){ self.uploadImage.apply(self,arguments); }
			});
			
			
			this.views.add(instr);
			instr.views.add( this.discardBtn );
			instr.views.add(this.nameInput);
			instr.views.add( this.uploadBtn );
		},
		setImageData : function( data ) {
			var container = this.$el.find('.image-container').html('').get(0);
			if ( this.image ) 
				this.image.destroy();
			
			this.image = new o.Image();
			this.image.onload = function() {
				this.embed( container , { type:'image/png' } );
			}
			this.image.load( data );
			return this;
		},
		render : function() {
			this.$el.prepend('<span class="image-container" />');
		},
		discardImage : function(){
			this.controller.trigger( 'action:discard:dataimage' , this );
		},
		uploadImage : function() {
			var blob = this.image.getAsBlob( 'image/png' ),
				self = this, uploader = new wp.Uploader();
			blob.detach(blob.getSource());
			blob.name = this.nameInput.val() + '.png';
			mediaFrame.uploader.uploader.uploader.addFile( blob , this.nameInput.val() + '.png' );
			
			var oldSuccess = mediaFrame.uploader.uploader.success;
			mediaFrame.uploader.uploader.success = function(){
				self.controller.trigger( 'action:uploaded:dataimage' );
				mediaFrame.uploader.uploader.success = oldSuccess;
				self.uploadBtn.model.disabled = self.discardBtn.model.disabled = false;
				self.uploadBtn.render();
				self.discardBtn.render();
			}
			this.uploadBtn.model.disabled = this.discardBtn.model.disabled = true;
			this.uploadBtn.render();
			this.discardBtn.render();
			
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
	
	
	
	media.view.WebcamRecorder = media.View.extend({
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
			this._instruments = $('<div class="instruments">\
					<a href="#" class="button recorder-record button-primary button-action"><span class="dashicons dashicons-video-alt2"></span>'+l10n.record+'</a>\
				</div>')
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
				this._webcam.on('recorder:state:permissionerror',function(e){
					self.$el.append('<div class="error recorder-inline-content"><h3>'+l10n.please_allow_camera_message+'</h3><p><a class="error-try-again" href="#">'+l10n.try_again+'</a></p></div>');
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
	
	media.view.Pasteboard = media.View.extend({
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
					self.controller.trigger('action:create:dataimage', self , data );
					return false;
				} )
				.focus();
			this._content.show();
			return this;
		},
		stop : function(){
			this._pasteboard
				.imagepastebox('off')
				.off('pasteimage');
			this._content.hide();
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

	media.view.DataSourceImageGrabber = media.View.extend({
		tagName:   'div',
		className : 'image-grabber',
		
		_grabber : null,
		_uploader : null,
		
		initialize : function() {
			_.defaults( this.options, {
				grabber : media.view.WebcamRecorder
			});
			var defaultFileName = (this.options.grabber == media.view.WebcamRecorder) ? l10n.snapshot : ((this.options.grabber == media.view.Pasteboard) ? l10n.pasted : l10n.image ),
				title = (this.options.grabber == media.view.WebcamRecorder) ? l10n.take_snapshot : ((this.options.grabber == media.view.Pasteboard) ? l10n.copy_paste : l10n.image ),
				wrap = new media.View({
					className : 'image-grabber-content',
					tagName : 'div',
					controller:this
				}), 
				titleDiv = new media.View({
					className : 'media-frame-title',
					tagName : 'div'
				}),
				titleH1 = new media.View({
					tagName : 'h1'
				});
			this._grabber  = new this.options.grabber({controller:this});
			this._uploader = new media.view.DataSourceImageUploader({controller:this,defaultFileName:defaultFileName});
			wrap.views.add(this._grabber);
			wrap.views.add(this._uploader);
			titleH1.$el.text(title);
			titleDiv.views.add(titleH1);
			this.views.add(titleDiv);
			this.views.add(wrap);
			
			this.on( 'action:create:dataimage' , this.imageCreated );
			this.on( 'action:discard:dataimage' , this.startGrabbing );
			this.on( 'action:uploaded:dataimage' , this.imageUploaded );
		},
		imageCreated : function( grabber , imageData ){
			this._grabber.stop().hide();
			this._uploader.show().setImageData(imageData);
		},
		startGrabbing:function(){
			this._uploader.hide();
			this._grabber.show().start();
			return this;
		},
		imageUploaded : function() {
			this.controller.trigger( 'action:uploaded:dataimage' );
		},
		getAction : function(){
			return this._grabber.action;
		},
		dismiss:function(){
			this._grabber.stop();
			return this;
		}
	});

	
	media.view.GrabberButton = Button.extend({
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
			this._grabber = new media.view.DataSourceImageGrabber({ 
				controller: this.controller , 
				grabber:    this.options.grabber 
			});
			this._modal = new Modal({
				controller: $(), // use empty controller. modal must not propagate 'ready' event, otherwise Backbone.History gets started twice 
				title:      this.options.title
			});
			
			this._modal.content( this._grabber );
			
			action = this._grabber.getAction();
			this.listenTo( this.controller, action+':activate '+action+':deactivate', this.toggleModeHandler );
			this.listenTo( this.controller, action+':action:done', this.back );
			this.listenTo( this.controller , 'action:uploaded:dataimage', this.uploadDone );
			this.listenTo( this._modal, 'close', this.back );
		},
		uploadDone:function(){
			this._grabber.dismiss();
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

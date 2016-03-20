
(function($){
	function PasteImageEvent( eventType , dataurl ) {	
		$.Event.call( this, eventType );
		this.dataurl = dataurl;
		this.stopPropagation();
	}
	PasteImageEvent.prototype = new $.Event( "" );
	
	function _selectAll( el ) {
		var range = document.createRange();
		range.selectNodeContents(el);
		var sel = window.getSelection();
		sel.removeAllRanges();
		sel.addRange(range);
	}
	
	
	
	$.fn.extend({
		imagepastebox : function(args){
			
			var self = this, options = {
				messages : {
					no_image_pasted : 'No image data pasted.',
					no_processible_image_pasted : 'Your Browser does not support pasting processible image data.',
				}
			};

			if ( args == 'off' ) {
				return this.off('paste').off('blur').off('keydown').prop('contenteditable',false).blur();
			}
			options = $.extend(args,options);
			
			this.on('paste' , function( event ) {
					var clipboardData = event.clipboardData || event.originalEvent.clipboardData, 
						$trgt = $(event.target), wait, pasted, waiting = false;
					
					

					wait = function(event){
						
						var loops=0, interval, src, $imgs;
						/*
						function drawToCanvas( img ) {
							try {
								var w=$(img).width(), h=$(img).height(),
									canvas = $('<canvas width="'+w+'" height="'+h+'" />').appendTo('body').get(0),
									ctx=canvas.getContext("2d");
								ctx.drawImage(img,0,0);
								// FF will throw a security error here, for images coming from different domains.
								src = canvas.toDataURL();
								return true;
							} catch(err){
								return false;
							}
						}*/
						waiting = true;
						interval = setInterval(function(){
							var $imgs = $trgt.find('img');
							if ( $imgs.length || (++loops)>10) {
								clearInterval(interval);
								waiting = false;
								if ( $imgs.length ) {
									img = $imgs.get(0);
									src = img.src;
									if ( src.match(/^data:/) /*|| drawToCanvas( img )*/ ) {
										self.trigger( 'pasteimage' , src );
									} else if ( src.match(/^webkit-fake-url:/)  ) {
										// trigger error
										// see https://bugs.webkit.org/show_bug.cgi?id=49141 webkit-fake-url
										// 
										$trgt.text(options.messages.no_processible_image_pasted);
										return;
									} else {
										$trgt.text(options.messages.no_image_pasted);
										return;
									}
								}
								$trgt.html('');
							}
						},50);
					};
					
					/*
					Not working cases in FF:
						- pasting images with non-data src from other websites
						- pasting files from finder result in type=text/plain; data=[filename]
					
					*/
					if ( clipboardData.types.length ) {
						$.each(clipboardData.types,function(i,type){
							var $img, dataSrc;
							if ( type == 'Files' && clipboardData.items) { // chrome
								pasted = clipboardData.items[i].getAsFile(); // > blob
								reader = new FileReader();
								reader.onload = function(readerEvent) {
									self.trigger( 'pasteimage' , readerEvent.target.result );
								};
								reader.readAsDataURL(pasted);
								return false; // break each()
							} else { // other
								pasted = clipboardData.getData( type );
								if ( type.match(/image.*/) ) {
									// file like image data, need to process dataurl
									wait(event);
									return false; // break each()
								} else if ( matches = pasted.match(/(^|src=")(data:.*)("|$)/) ) {
									self.trigger( 'pasteimage' , matches[2] );
									return false; // break each()
								} else if ( type == 'text/html' ) {
									// check pasted data, if data source image trigger paste-image 
									
									if ( pasted.match(/<img/) ) {
										// regular image. wait until it can be handled in the DOM.
										wait(event);
									} else {
										// propably no image.
										self.text(options.messages.no_image_pasted);
									}
// 								} else if ( type == 'text/plain' ) {
// 									// - pasting files from finder result in type=text/plain; data=[filename]
// 									console.log(pasted);
// 									if ( pasted.match(/\.(png|jpg)$/) ) {
// 										wait(event);
// 										return false; // break each()
// 									} else {
// 										self.text(options.messages.no_image_pasted);
// 									}
								}
							}
						});
						
					} else { // something pasted but we don't know what.
						// need to wait for clipboard data to arrive
						wait(event);
					}
					waiting || event.preventDefault();
				})
				.prop('contenteditable',true)
				.on('keydown',function(e){
					$(this).text('');
				})
				.on('blur',function(e){
					var self = this;
					setTimeout(function(){ $(self).focus(); },10);
				});
			setTimeout(function(){ self.focus(); },10);
			
			return this;
		}
	});
	

})(jQuery);


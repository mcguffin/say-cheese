
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
			
			if ( args == 'off' )
				return this.off('paste').off('blur').off('keydown').removeAttr('contenteditable','true').blur();
			else 
				options = $.extend(args,options);
			
			this.on('paste' , function( event ) {
					var clipboardData = event.clipboardData || event.originalEvent.clipboardData, 
						$trgt = $(event.target), wait, pasted, waiting = false;
					
					
					wait = function(event){
						
						var loops=0, interval, src, imgs;
						
						waiting = true;
						interval = setInterval(function(){
							var imgs = $trgt.find('img');
							if ( imgs.length || (++loops)>10) {
								clearInterval(interval);
								waiting = false;
								if ( imgs.length ) {
									img = imgs.get(0);
									src = img.src;
									console.log(imgs.length,src);
									if ( src.match(/^data:/) ) {
										self.trigger( 'pasteimage' , src );
									} else {
										// trigger error
										$trgt.text(options.messages.no_processible_image_pasted);
										return;
									}
								}
								$trgt.html('');
							}
						},20);
					};
					
					/*
					Not working cases in FF:
						- pasting images with non-data src from other websites
						- pasting files from finder result in type=text/plain; data=[filename]
					
					*/
					
					if ( clipboardData.types.length ) {
						$.each(clipboardData.types,function(i,type){
							if ( type == 'Files' && clipboardData.items) {
								pasted = clipboardData.items[i].getAsFile();
								reader = new FileReader();
								reader.onload = function(readerEvent) {
									self.trigger( 'pasteimage' , readerEvent.target.result );
								};
								reader.readAsDataURL(pasted);
								return false; // break each()
							} else {
								pasted = clipboardData.getData( type );
								if ( type.match(/image.*/) ) {
									// file like image data, need to process dataurl
									wait(event);
									return false; // break each()
								} else if ( type == 'text/html' ) {
									// check pasted data, if data source image trigger paste-image 
								
									
									if ( matches = pasted.match(/src="(data:.*)"/) ) {
										self.trigger( 'pasteimage' , matches[1] );
										return false; // break each()
									} else if ( pasted.match(/<img/)  ) {
										self.text(options.messages.no_processible_image_pasted);
									} else {
										self.text(options.messages.no_image_pasted);
									}
								} else if ( type == 'text/plain' ) {
									// - pasting files from finder result in type=text/plain; data=[filename]
									if ( pasted.match(/\.(png|jpg)$/) ) {
										wait(event);
										return false; // break each()
									} else {
										self.text(options.messages.no_image_pasted);
									}
								}
							}
						});
					} else { // something pasted but we don't know what.
						// need to wait for clipboard data to arrive
						wait(event);
					}
					console.log(waiting);
					
					waiting || event.preventDefault();
				})
				.attr('contenteditable','true')
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


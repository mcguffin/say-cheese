var cheesePluginCallback;

(function($){
	cheesePluginCallback = function( editor ) {
		var cheeseBtn, $doc, $body, pastebin,
			active = false,
			counter = 0,
			origDomAdd,
			workflow;

		function uploadImage( image, $container ) {

			var type = image.type, 
				suffix = cheese.options.mime_types[ type ],
				name = cheese.l10n.pasted + '.' + suffix,
				blob = image.getAsBlob( type, cheese.options.jpeg_quality ),
				addFile = function(){
					workflow.uploader.uploader.uploader.addFile( blob );
					workflow.close()
				};
				
			blob.detach( blob.getSource() );
			blob.name = name;
			blob.type = type;

			if ( ! workflow ) {
				workflow = wp.media.editor.open( window.wpActiveEditor, {
					frame:		'post',
					state:		'insert',
					title:		cheese.l10n.copy_paste,
					multiple:	false
				} );
				if ( workflow.uploader.uploader && workflow.uploader.uploader.ready ) {
					addFile();
				} else {
					workflow.on( 'uploader:ready', addFile );
				}
			} else {
				workflow.state().reset();
				addFile();
			}

			workflow.uploader.uploader.uploader.bind('UploadProgress',function(e){
				$container.attr('data-progress',e.total.percent);
			});
			workflow.uploader.uploader.uploader.bind('FileUploaded',function(e,args){

				$container.replaceWith( '<img class="alignnone wp-image-'+args.attachment.id+' size-full" src="'+args.attachment.changed.url+'" />' );
			});
		}

		function domAdd() {
			var result = origDomAdd.apply(this,arguments);
			if ( 'mcepastebin' === $(result).attr('id') ) {
				$(result)
					.pastableContenteditable()
					.on('pasteImage',function( e, data ) {
						var id = '__cheese_img_'+(counter++),
							image = new mOxie.Image(),
							imageHtml = '<div class="cheese-image-placeholder" id="'+id+'" contenteditable="false"></div>',
							$container;
// 
						image.onload = function() {
							this.embed($container[0]);
							uploadImage( image, $container );
						}

						setTimeout(function(){
							image.load( data.dataURL );
						},10);

						editor.insertContent( imageHtml );
						$container = editor.$('#'+id);


						
					});
			}
			return result;
		}

		function setupEditorDom() {
			origDomAdd = editor.dom.add;

			editor.dom.add = domAdd;
		}
		editor.addCommand( 'cmd_cheese', function() {
			var editor_body;

			active = ! active;
			cheeseBtn.active( active );
			
// 			if ( active ) {
// 				$body.on('pasteImage',function(){
// 					console.log(arguments);
// 				});
// 			} else {
// 				$body.off('pasteImage');
// 			}
		});


		editor.addButton('cheese', {
			icon: 'cheese',
			tooltip: '',
			cmd : 'cmd_cheese',
			onPostRender: function() {
				cheeseBtn = this;
			}
		});

		editor
			.on( 'init', function(){
				setupEditorDom();
			})
			.on('BeforePastePreProcess',function(e){
				console.log(e);
			});

	};

	tinymce.PluginManager.add( 'cheese', cheesePluginCallback );

} )(jQuery);


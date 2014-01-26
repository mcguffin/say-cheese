(function($,exports){
	function guid(){
		var guid = new Date().getTime().toString(32), i;

		for (i = 0; i < 5; i++) {
			guid += Math.floor(Math.random() * 65535).toString(32);
		}

		return 'p' + guid + (counter++).toString(32);
	}
	
	function suffix_from_mime(mime) {
		return {
			'image/png' : 'png',
			'image/jpeg' : 'jpg',
			'image/gif' : 'gif'
		}[mime] || 'txt';
	}
	
	var counter=0, xhr;
	if (window.XMLHttpRequest) {
		xhr = new XMLHttpRequest();
	}
	
	cheese = {
		
		supports : {
			upload_data_url: !!xhr && !!(xhr.sendAsBinary || (window.Uint8Array && window.ArrayBuffer)),
			paste: ('paste' in document) || ('onpaste' in document) || typeof(window.onpaste) === 'object',
			webcam_recording: !!(navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia)
		},
		
		create_webcam_recorder : function( parent ){
			return $.create_recorder_element()
				.appendTo(parent)
				.recorder({
					camera:{mandatory:{
						minWidth: 640,
						minHeight: 480
					}},
					microphone:false
				});
		},
		
		// upload_data_url: 
		
		send_img : function( img , filename , mediaFrame ) {
			if ( ! this.supports.upload_data_url ) {	
				console.log('Upload not supported');
				return false;
			}
			var send_data = {
					action   : wp.Uploader.defaults.multipart_params.action,
					_wpnonce : wp.Uploader.defaults.multipart_params._wpnonce,
					post_id  : wp.media.model.settings.post.id*1
				},
				boundary = '----multipart_boundary'+guid(),
				dashdash = '--', crlf = '\r\n' , multipart_string = '',
				file_data_name = file_data_name || 'upload', 
				name, value, filename, mime_type ,
				xhr = new XMLHttpRequest();



			// add file fake to WP media library
			var file = {};
			var attributes = {
				file:      file,
				uploading: true,
				date:      new Date(),
				filename:  filename,
				menuOrder: 0,
				uploadedTo: wp.media.model.settings.post.id,
				type : 'image',
				subtype : 'png',
				loaded : 0,
				size : 100,
				percent : 0
			};
			file.attachment = wp.media.model.Attachment.create( attributes );
			wp.Uploader.queue.add(file.attachment);


			for ( name in send_data ) {
				multipart_string += dashdash + boundary + crlf +
					'Content-Disposition: form-data; name="' + name + '"' + crlf + crlf;
				multipart_string += unescape(encodeURIComponent(send_data[name])) + crlf;
			}
			
			var match = img.src.match( /data:([a-z0-9\/]+);base64,(.+)$/ );
			mime_type = match[1];
			file_contents = match[2];
			filename = filename || 'upload'
			var suffix = suffix_from_mime(mime_type);
			if ( filename.split('.').pop() != suffix )
				filename += '.'+suffix;
			
			multipart_string += dashdash + boundary + crlf +
				'Content-Disposition: form-data; name="' + wp.Uploader.defaults.file_data_name + '"; filename="' + filename + '"' + crlf +
				'Content-Type: ' + mime_type + crlf +
					crlf + atob( file_contents ) + crlf +
					dashdash + boundary + dashdash + crlf;
			
			//*
			xhr.open("post", wp.Uploader.defaults.url, true);
			xhr.setRequestHeader('Content-Type', 'multipart/form-data; boundary=' + boundary);
			xhr.onreadystatechange = function() {
				var httpStatus, chunkArgs;
				if (xhr.readyState == 4 ) {
					try {
						httpStatus = xhr.status;
					} catch (ex) {
						httpStatus = 0;
					}
					if (httpStatus == 200) {
						// will load contents to file fake
						mediaFrame.uploader.uploader.uploader.trigger('FileUploaded', file, {
							response : xhr.responseText,
							status : httpStatus
						});
					} else if ( httpStatus >= 400 ) {
						// handle error
					}
				}
			}
			
			if (xhr.sendAsBinary) { // Gecko
				xhr.sendAsBinary(multipart_string);
			} else { // WebKit with typed arrays support
				var ui8a = new Uint8Array(multipart_string.length);
				for (var i = 0; i < multipart_string.length; i++) {
					ui8a[i] = (multipart_string.charCodeAt(i) & 0xff);
				}
				xhr.send(ui8a.buffer);
			}
			
			/*/ NOPE!
			$.ajax({
				contentType: 'multipart/form-data; boundary=' + boundary,
				data : multipart_string,
				success : success_callback,
				type: 'post',
				url : wp.Uploader.defaults.url,
				mimeType : 'application/json',
				processData : false
			});
			//*/
		}
	};
	exports.cheese = cheese;
})(jQuery,window);

<?php

if ( ! defined('ABSPATH') ) 
	die();

?>
<script type="text/html" id="tmpl-cheese-uploader">
	<div class="image-container"></div>
	<div class="instruments">
		<button type="button" class="button image-discard button-secondary button-large button-action" data-action="discard">
			<span class="dashicons dashicons-arrow-left"></span>
			<?php _e( 'Try again', 'say-cheese' ); ?>
		</button>
		<label class="setting">
			<span><?php _e( 'Title', 'say-cheese' ); ?></span>
			<input class="widefat" type="text" data-setting="title" />
		</label>
		<div class="select-format" data-setting="format">
			<# jQuery.each( cheese.options.mime_types, function( mime, suffix ){
				#>
					<input type="radio" name="cheese-upload-format" id="cheese-format-{{{ suffix }}}" value="{{{ mime }}}" />
					<label for="cheese-format-{{{ suffix }}}">.{{{ suffix }}}</label><br />
				<#
			}); #>
		</div>
		<button type="button" class="button image-upload button-primary button-large button-action" data-action="upload">
			<span class="dashicons dashicons-yes"></span>
			<?php _e( 'Upload', 'say-cheese' ); ?>
		</button>

	</div>
</script>

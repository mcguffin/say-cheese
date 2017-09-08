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
			<input class="alignment" type="text" data-setting="title" />
		</label>
		<button type="button" class="button image-upload button-primary button-large button-action" data-action="upload">
			<span class="dashicons dashicons-yes"></span>
			<?php _e( 'Upload', 'say-cheese' ); ?>
		</button>

	</div>
</script>

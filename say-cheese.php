<?php

/*
Plugin Name: Say Cheese
Plugin URI: https://github.com/mcguffin/say-cheese/
Description: Add Media through Webcam and Copy Paste
Author: Jörn Lund
Version: 0.0.3
Author URI: https://github.com/mcguffin/
License: GPL2

Text Domain: cheese
Domain Path: /lang/
*/


function cheese_admin_init() {
	wp_register_script( 'canvas-to-blob' , plugins_url( 'js/canvas-to-blob.min.js' , __FILE__ ) , array() , '2.0.5' );
	wp_register_script( 'jquery-webcam-recorder' , plugins_url( 'js/jquery-webcam-recorder.js' , __FILE__ ) , array( 'jquery' , 'canvas-to-blob' , 'swfobject' ) , '0.0.1' );
	wp_register_script( 'jquery-pasteboard' , plugins_url( 'js/jquery.pasteboard.js' , __FILE__ ) , array( 'jquery' ) , '0.0.1' );
	wp_register_script( 'cheese' , plugins_url( 'js/cheese.js' , __FILE__ ) , array( 'jquery' ) , '0.0.1' );
	wp_register_script( 'cheese-media-view' , plugins_url( 'js/media-view.js' , __FILE__ ) , array('media-editor' , 'jquery-webcam-recorder' , 'jquery-pasteboard' , 'cheese' ) , '0.0.1' );
	wp_localize_script( 'cheese-media-view' , 'cheese_l10n' , array(
		'webcam_record' => __('Webcam Record' , 'cheese' ),
		'try_again' => __('Try again' , 'cheese' ),
		'upload' => __('Upload' , 'cheese' ),
		'record' => __('Record' , 'cheese' ),
		'title' => __('Title'),
		'snapshot' => __('Snapshot','cheese'),
		'copy_paste' => __('Paste from Clipboard' , 'cheese'),
		'image' => __('Image'),
		'paste_instructions' => __('Paste some image Data from your clipboard','cheese'),
		'paste_error_no_image' => __('No image data pasted.','cheese'),
		'paste_error_webkit_fake_image' => __('Your Browser does not support pasting processable image data.','cheese'),
		'please_allow_camera_message' => __( 'Please allow camera access in your browser.' , 'cheese' ),
		'an_error_occured' => __( 'An error occured.' , 'cheese' ),
		'swf_url' =>  plugins_url( 'js/WebcamRecorder.swf' , __FILE__ ),
	) );

	wp_register_style( 'cheese' , plugins_url( 'css/cheese.css' , __FILE__ ) , array( ) , '0.0.1' );
}
add_action( 'admin_init' , 'cheese_admin_init');

function cheese_loaded(){
	load_plugin_textdomain( 'cheese', false, dirname( plugin_basename( __FILE__ ) ) . '/lang/' );
}
add_action( 'plugins_loaded' , 'cheese_loaded');


function cheese_load() {
	wp_enqueue_media( );
	wp_enqueue_script( 'cheese-media-view');
	wp_enqueue_style( 'cheese' );
}
add_action( 'load-post.php' , 'cheese_load');
add_action( 'load-post-new.php' , 'cheese_load');

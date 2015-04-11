<?php

/*
Plugin Name: Say Cheese
Plugin URI: https://github.com/mcguffin/say-cheese/
Description: Add Media through Webcam and Copy Paste
Author: Jörn Lund
Version: 0.0.4
Author URI: https://github.com/mcguffin/
License: GPL2
*/


function cheese_admin_init() {
	wp_register_script( 'canvas-to-blob' , plugins_url( 'js/canvas-to-blob.min.js' , __FILE__ ) , array() , '2.0.5' );
	wp_register_script( 'jquery-webcam-recorder' , plugins_url( 'js/jquery-webcam-recorder.js' , __FILE__ ) , array( 'jquery' , 'canvas-to-blob' , 'swfobject' ) , '0.0.1' );
	wp_register_script( 'jquery-pasteboard' , plugins_url( 'js/jquery.pasteboard.js' , __FILE__ ) , array( 'jquery' ) , '0.0.1' );
	wp_register_script( 'cheese' , plugins_url( 'js/cheese.js' , __FILE__ ) , array( 'jquery' ) , '0.0.1' );
	wp_register_script( 'cheese-media-view' , plugins_url( 'js/media-view.js' , __FILE__ ) , array('media-editor' , 'jquery-webcam-recorder' , 'jquery-pasteboard' , 'cheese' ) , '0.0.1' );
	wp_localize_script( 'cheese' , 'cheese_l10n' , array(
		'webcam_record' => __('Webcam Record' , 'say-cheese' ),
		'try_again' => __('Try again' , 'say-cheese' ),
		'upload' => __('Upload' , 'say-cheese' ),
		'record' => __('Record' , 'say-cheese' ),
		'title' => __('Title'),
		'snapshot' => __('Snapshot','say-cheese'),
		'copy_paste' => __('Paste from Clipboard' , 'say-cheese'),
		'image' => __('Image'),
		'paste_instructions' => __('Paste some image Data from your clipboard','say-cheese'),
		'paste_error_no_image' => __('No image data pasted.','say-cheese'),
		'paste_error_webkit_fake_image' => __('Your Browser does not support pasting processable image data.','say-cheese'),
		'please_allow_camera_message' => __( 'Please allow camera access in your browser.' , 'say-cheese' ),
		'an_error_occured' => __( 'An error occured.' , 'say-cheese' ),
		'swf_url' =>  plugins_url( 'js/WebcamRecorder.swf' , __FILE__ ),
		'enable_snapshot' => apply_filters( 'saycheese_enable_snapshot' , true ),
		'enable_pasteboard' => apply_filters( 'saycheese_enable_pasteboard' , true ),
	) );

	wp_register_style( 'cheese' , plugins_url( 'css/cheese.css' , __FILE__ ) , array( ) , '0.0.1' );
}
add_action( 'admin_init' , 'cheese_admin_init');

function cheese_loaded() {
	load_plugin_textdomain( 'say-cheese', false, dirname( plugin_basename( __FILE__ ) ) . '/languages/' );
}
add_action( 'plugins_loaded' , 'cheese_loaded');


function cheese_load() {
	if ( ! did_action('wp_enqueue_media') ) 
		wp_enqueue_media();
	wp_enqueue_script( 'cheese-media-view');
	wp_enqueue_style( 'cheese' );
}
add_action( 'wp_enqueue_media' , 'cheese_load' );
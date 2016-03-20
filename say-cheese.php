<?php

/*
Plugin Name: Say Cheese
Plugin URI: https://github.com/mcguffin/say-cheese/
Description: Add Media through Webcam and Copy Paste
Author: Jörn Lund
Version: 0.1.2
Author URI: https://github.com/mcguffin/
License: GPL2
*/


function cheese_admin_init() {
	$version = '0.1.2';
	if ( defined('SCRIPT_DEBUG') && SCRIPT_DEBUG ) {
		wp_register_script( 'webrtc-adapter', 
			plugins_url( 'js/adapter-latest.js', __FILE__ ), 
			array( ), 
			$version 
		);
		wp_register_script( 'jquery-webcam-recorder', 
			plugins_url( 'js/jquery-webcam-recorder.js', __FILE__ ), 
			array( 'jquery' , 'swfobject', 'webrtc-adapter' ), 
			$version 
		);
		wp_register_script( 'jquery-pasteboard', 
			plugins_url( 'js/jquery.pasteboard.js', __FILE__ ), 
			array( 'jquery' ), 
			$version 
		);
		wp_register_script( 'cheese-base', 
			plugins_url( 'js/cheese-base.js', __FILE__ ), 
			array( 'media-editor', 'jquery-webcam-recorder' , 'jquery-pasteboard' , 'jquery' ) , 
			$version
		);
		wp_register_script( 'cheese', 
			plugins_url( 'js/cheese.js', __FILE__ ), 
			array( 'cheese-base', 'jquery' ),
			$version 
		);
		wp_register_script( 'cheese-media-view', 
			plugins_url( 'js/media-view.js', __FILE__ ), 
			array( 'cheese-base' , 'cheese' ), 
			$version 
		);
	} else {
		wp_register_script( 'cheese-base', 
			plugins_url( 'js/cheese.min.js' , __FILE__ ), 
			array( 'jquery', 'swfobject', 'media-editor' ), 
			$version
		);
	}
	wp_localize_script( 'cheese-base' , 'cheese_l10n' , array(
		'webcam_record' 				=> __('Webcam Record' , 'say-cheese' ),
		'try_again' 					=> __('Try again' , 'say-cheese' ),
		'upload' 						=> __('Upload' , 'say-cheese' ),
		'record' 						=> __('Record' , 'say-cheese' ),
		'title' 						=> __('Title'),
		'snapshot' 						=> __('Snapshot','say-cheese'),
		'take_snapshot' 				=> __('Take Snapshot','say-cheese'),
		'copy_paste' 					=> __('Copy & Paste' , 'say-cheese'),
		'pasted' 						=> __('Pasted' , 'say-cheese'),
		'paste_from_clipboard' 			=> __('Paste from Clipboard' , 'say-cheese'),
		'image' 						=> __('Image'),
		'paste_instructions' 			=> __('Paste some image Data from your clipboard','say-cheese'),
		'paste_error_no_image' 			=> __('No image data pasted.','say-cheese'),
		'paste_error_webkit_fake_image'	=> __('Your Browser does not support pasting processable image data.','say-cheese'),
		'please_allow_camera_message' 	=> __( 'Please allow camera access in your browser.' , 'say-cheese' ),
		'an_error_occured'				=> __( 'An error occured.' , 'say-cheese' ),
		'swf_url' 						=> plugins_url( 'js/WebcamRecorder.swf' , __FILE__ ),
		'enable_snapshot' 				=> apply_filters( 'saycheese_enable_snapshot' , true ),
		'enable_pasteboard' 			=> apply_filters( 'saycheese_enable_pasteboard' , true ),
	) );

	wp_register_style( 'cheese' , plugins_url( 'css/cheese.css' , __FILE__ ) , array( ) , $version );
}
add_action( 'admin_init' , 'cheese_admin_init');

function cheese_loaded() {
	load_plugin_textdomain( 'say-cheese', false, dirname( plugin_basename( __FILE__ ) ) . '/languages/' );
}
add_action( 'plugins_loaded' , 'cheese_loaded');


function cheese_load() {
	if ( ! did_action('wp_enqueue_media') ) 
		wp_enqueue_media();
	if ( defined('SCRIPT_DEBUG') && SCRIPT_DEBUG ) {
		wp_enqueue_script( 'cheese-media-view');
	} else {
		wp_enqueue_script( 'cheese-base');
	}
	wp_enqueue_style( 'cheese' );
}
add_action( 'wp_enqueue_media' , 'cheese_load' );

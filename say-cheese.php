<?php

/*
Plugin Name: Say Cheese
Plugin URI: https://github.com/mcguffin/say-cheese/
Description: Add Media through Webcam
Author: Jörn Lund
Version: 0.0.2
Author URI: https://github.com/mcguffin/

Text Domain: cheese
Domain Path: /lang/
*/


function cheese_admin_init() {
	wp_register_script( 'canvas-to-blob' , plugins_url( 'js/canvas-to-blob.min.js' , __FILE__ ) , array() , '2.0.5' );
//	wp_register_script( 'jquery-webcam-recorder' , plugins_url( 'js/jquery-webcam-recorder.js' , __FILE__ ) , array('canvas-to-blob' ) , '0.0.1' );
//	wp_register_script( 'cheese-media-view' , plugins_url( 'js/media-view.js' , __FILE__ ) , array('canvas-to-blob', 'media-editor' , 'jquery-webcam-recorder'  ) , '0.0.1' );
	wp_register_script( 'cheese-media-view' , plugins_url( 'js/test-media-view.js' , __FILE__ ) , array('canvas-to-blob', 'media-editor' /*, 'jquery-webcam-recorder' */ ) , '0.0.1' );
}
add_action( 'admin_init' , 'cheese_admin_init');



function cheese_load(){
	wp_enqueue_script( 'cheese-media-view');
}
add_action( 'load-post.php' , 'cheese_load');
add_action( 'load-post-new.php' , 'cheese_load');

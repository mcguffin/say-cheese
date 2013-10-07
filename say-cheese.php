<?php

/*
Plugin Name: Say Cheese
Plugin URI: https://github.com/mcguffin/take-a-picture/
Description: Add Media through Webcam
Author: Jörn Lund
Version: 0.0.1
Author URI: https://github.com/mcguffin/

Text Domain: takea
Domain Path: /lang/
*/


function tap_admin_init() {
	wp_register_script( 'canvas-to-blob' , plugins_url( 'js/canvas-to-blob.min.js' , __FILE__ ) , array() , '2.0.5' );
	wp_register_script( 'jquery-webcam-recorder' , plugins_url( 'js/jquery-webcam-recorder.js' , __FILE__ ) , array('canvas-to-blob' ) , '0.0.1' );
	wp_register_script( 'tap-media-view' , plugins_url( 'js/media-view.js' , __FILE__ ) , array('canvas-to-blob', 'media-editor' , 'jquery-webcam-recorder') , '0.0.1' );
}
add_action( 'admin_init' , 'tap_admin_init');



function tap_load(){
	wp_enqueue_script( 'tap-media-view');
}
add_action( 'load-post.php' , 'tap_load');
add_action( 'load-post-new.php' , 'tap_load');

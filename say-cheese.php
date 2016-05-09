<?php

/*
Plugin Name: Say Cheese
Plugin URI: https://github.com/mcguffin/say-cheese/
Description: Add Media through Webcam and Copy Paste
Author: Jörn Lund
Version: 0.2.0
Author URI: https://github.com/mcguffin/
License: GPL2
*/



if ( is_admin() ) {
	require_once plugin_dir_path(__FILE__).'/include/class-say-cheese-admin.php';
	require_once plugin_dir_path(__FILE__).'/include/class-say-cheese-settings.php';
}


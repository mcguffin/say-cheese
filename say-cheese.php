<?php

/*
Plugin Name: Say Cheese
Plugin URI: https://github.com/mcguffin/say-cheese/
Description: Add Media through Webcam recording
Author: Jörn Lund
Version: 0.4.1
Author URI: https://github.com/mcguffin/
License: GPL2
*/


namespace SayCheese;

define( 'SAY_CHEESE_FILE', __FILE__ );
define( 'SAY_CHEESE_VERSION', '0.4.1' );
define( 'SAY_CHEESE_DIRECTORY', plugin_dir_path(__FILE__) );

require_once SAY_CHEESE_DIRECTORY . 'include/vendor/autoload.php';

Core\Core::instance();

if ( is_admin() || defined( 'DOING_AJAX' ) ) {

	Admin\Admin::instance();

}

<?php

namespace SayCheese\Core;

if ( ! defined( 'ABSPATH' ) )
	die('Nope.');

class Core extends Singleton {


	/**
	 *	Private constructor
	 */
	protected function __construct() {
		add_action( 'plugins_loaded' , array( $this , 'load_textdomain' ) );
	}

	/**
	 *	Load text domain
	 * 
	 *  @action plugins_loaded
	 */
	public function load_textdomain() {
		load_plugin_textdomain( 'acf-quick-edit-fields' , false, ACFQUICKEDIT_DIRECTORY . '/languages/' );
	}

}

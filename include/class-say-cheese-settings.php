<?php

if ( ! defined('ABSPATH') ) 
	die();



class SayCheeseSettings {
	private static $_instance = null;
	
	/**
	 * Setup which to WP options page the Rainbow options will be added.
	 * 
	 * Possible values: general | writing | reading | discussion | media | permalink
	 */
	private $optionset = 'media'; // writing | reading | discussion | media | permalink

	/**
	 * Getting a singleton.
	 *
	 * @return object single instance of TestSettings
	 */
	public static function getInstance() {
		if ( is_null( self::$_instance ) )
			self::$_instance = new self();
		return self::$_instance;
	}

	/**
	 * Private constructor
	 */
	private function __construct() {
		add_action( 'admin_init' , array( &$this , 'register_settings' ) );

		// add default options
		add_option( 'saycheese_enable_snapshot', is_ssl() );
		add_option( 'saycheese_enable_pasteboard', true );
	}

	/**
	 *	Setup options page.
	 *
	 *	@action admin_init
	 *	@uses settings_description
	 *	@uses checkbox
	 */
	function register_settings() {
		$settings_section = 'saycheese_settings';
		// more settings go here ...

		add_settings_section( $settings_section, __( 'Say Cheese',  'say-cheese' ), array( &$this, 'settings_description' ), $this->optionset );
		// ... and here
		$option_name = 'saycheese_enable_pasteboard';
		register_setting( $this->optionset, $option_name , 'boolval' );
		add_settings_field(
			$option_name,
			__( 'Pasteboard',  'say-cheese' ),
			array( $this, 'checkbox' ),
			$this->optionset,
			$settings_section,
			array(
				'option_name'	=> $option_name,
				'option_label'	=> __('Enable Copy-Paste image uploads.','say-cheese'),
			)
		);

		$option_name = 'saycheese_enable_snapshot';
		register_setting( $this->optionset, $option_name , 'boolval' );
		
		add_settings_field(
			$option_name,
			__( 'Snapshot',  'say-cheese' ),
			array( $this, 'checkbox' ),
			$this->optionset,
			$settings_section,
			array(
				'option_name' 			=> $option_name,
				'option_label' 			=> __('Enable Webcam image uploads.','say-cheese'),
				'option_description'	=> __( 'In some Browsers – e.g. Chrome – this will not work with non-HTTPS connections.', 'say-cheese' ),
			)
		);
	}

	/**
	 *	Print some documentation for the optionset
	 *
	 *	@usedby register_settings
	 */
	public function settings_description() {
	}

	/**
	 *	Output checkbox
	 *
	 *	@usedby register_settings
	 */
	public function checkbox( $args ){
		$setting = get_option( $args['option_name'] );
		?><label><?php
			?><input type="checkbox" name="<?php echo $args['option_name'] ?>" <?php checked( $setting,true,true ) ?> value="1" /><?php
			echo $args['option_label']
		?></label><?php
		if ( isset($args['option_description']) ) {
			?><p class="description"><?php
				echo $args['option_description']
			?></p><?php
		}
	}

}

SayCheeseSettings::getInstance();

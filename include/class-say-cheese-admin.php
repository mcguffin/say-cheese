<?php

if ( ! defined('ABSPATH') ) 
	die();



class SayCheeseAdmin {

	/**
	 *	Singleton instance
	 */
	private static $_instance	= null;

	/**
	 *	Get singleton instance
	 */
	public static function getInstance() {
		if ( is_null( self::$_instance ) ) {
			self::$_instance = new self();
		}
		return self::$_instance;
	}

	/**
	 *	Prevent cloning
	 */
	private function __clone(){}

	/**
	 *	Private constructor
	 */
	private function __construct() {
		add_action( 'admin_init' , array( $this, 'admin_init' ) );
		add_action( 'wp_enqueue_media' , array( $this, 'wp_enqueue_media' ) );
	}


	/**
	 *	@action 'plugins_loaded'
	 */
	function plugins_loaded() {
		load_plugin_textdomain( 'say-cheese', false, dirname( plugin_basename( dirname(__FILE__) ) ) . '/languages/' );
	}

	/**
	 *	Register cheese scripts along with wp media
	 *
	 *	@action wp_enqueue_media
	 */
	function admin_init() {
		$version = '0.1.2';
		wp_register_script( 'cheese-base', 
			plugins_url( 'js/cheese.min.js' , dirname( __FILE__ ) ), 
			array( 'jquery', 'swfobject', 'media-editor' ), 
			$version
		);
		wp_localize_script( 'cheese-base' , 'cheese_options' , array(
			'l10n' => array(
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
				'paste_error'					=> __('Error pasting image data.','say-cheese'),
				'please_allow_camera_message' 	=> __( 'Please allow camera access in your browser.' , 'say-cheese' ),
				'an_error_occured'				=> __( 'An error occured.' , 'say-cheese' ),
			),
			'swf_url' 						=> plugins_url( 'js/WebcamRecorder.swf' , dirname( __FILE__ ) ),
			'enable_snapshot' 				=> get_option( 'saycheese_enable_snapshot' , is_ssl() ),
			'enable_pasteboard' 			=> get_option( 'saycheese_enable_pasteboard' , true ),
		) );

		wp_register_style( 'cheese' , plugins_url( 'css/cheese.css' , dirname( __FILE__ ) ) , array( ) , $version );
	}

	/**
	 *	Enqueue cheese scripts along with wp media
	 *
	 *	@action wp_enqueue_media
	 */
	function wp_enqueue_media() {
		if ( ! did_action('wp_enqueue_media') ) {
			wp_enqueue_media();
		}
		wp_enqueue_script( 'cheese-base');
		wp_enqueue_style( 'cheese' );
	}

	
}

SayCheeseAdmin::getInstance();

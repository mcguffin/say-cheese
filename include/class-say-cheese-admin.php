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
		if ( defined('SCRIPT_DEBUG') && SCRIPT_DEBUG ) {
			wp_register_script( 'webrtc-adapter', 
				plugins_url( 'js/adapter-latest.js', dirname( __FILE__ ) ), 
				array( ), 
				$version 
			);
			wp_register_script( 'jquery-webcam-recorder', 
				plugins_url( 'js/jquery-webcam-recorder.js', dirname( __FILE__ ) ), 
				array( 'jquery' , 'swfobject', 'webrtc-adapter' ), 
				$version 
			);
			wp_register_script( 'jquery-pasteboard', 
				plugins_url( 'js/jquery.pasteboard.js', dirname( __FILE__ ) ), 
				array( 'jquery' ), 
				$version 
			);
			wp_register_script( 'cheese-base', 
				plugins_url( 'js/cheese-base.js', dirname( __FILE__ ) ), 
				array( 'media-editor', 'jquery-webcam-recorder' , 'jquery-pasteboard' , 'jquery' ) , 
				$version
			);
			wp_register_script( 'cheese', 
				plugins_url( 'js/cheese.js', dirname( __FILE__ ) ), 
				array( 'cheese-base', 'jquery' ),
				$version 
			);
			wp_register_script( 'cheese-media-view', 
				plugins_url( 'js/media-view.js', dirname( __FILE__ ) ), 
				array( 'cheese-base' , 'cheese' ), 
				$version 
			);
		} else {
			wp_register_script( 'cheese-base', 
				plugins_url( 'js/cheese.min.js' , dirname( __FILE__ ) ), 
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
		if ( ! did_action('wp_enqueue_media') ) 
			wp_enqueue_media();
		if ( defined('SCRIPT_DEBUG') && SCRIPT_DEBUG ) {
			wp_enqueue_script( 'cheese-media-view');
		} else {
			wp_enqueue_script( 'cheese-base');
		}
		wp_enqueue_style( 'cheese' );
	}

	
}

SayCheeseAdmin::getInstance();

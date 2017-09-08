<?php

namespace SayCheese\Admin;
use SayCheese\Core;


class Admin extends Core\Singleton {

	private $core;

	/**
	 *	Private constructor
	 */
	protected function __construct() {

		$this->core = Core\Core::instance();

		add_action( 'admin_init' , array( $this, 'admin_init' ) );
		add_action( 'wp_enqueue_media' , array( $this, 'wp_enqueue_media' ) );
	}


	/**
	 * Admin init
	 */
	function admin_init() {
		$version = SAY_CHEESE_VERSION;
		if ( defined( 'SCRIPT_DEBUG' ) && SCRIPT_DEBUG ) {
			$script_source = 'js/cheese-with-sourcemap.min.js';
		} else {
			$script_source = 'js/cheese.min.js';
		}
		wp_register_script( 'cheese-base', 
			plugins_url( $script_source , SAY_CHEESE_FILE ), 
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
				'click_here'					=> __( 'Click here please...' , 'say-cheese' ),
			),
			'enable_snapshot' 				=> get_option( 'saycheese_enable_snapshot' , is_ssl() ),
			'enable_pasteboard' 			=> get_option( 'saycheese_enable_pasteboard' , true ),
		) );

		wp_register_style( 'cheese' , plugins_url( 'css/cheese.css' , SAY_CHEESE_FILE ) , array( ) , $version );
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


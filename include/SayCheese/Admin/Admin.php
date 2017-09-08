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
		add_action( 'print_media_templates',  array( $this, 'print_media_templates' ) );
	}


	/**
	 *	register scripts
	 *
	 *	@action admin_init
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
		wp_localize_script( 'cheese-base' , 'cheese' , array(
			'l10n' => array(
				'webcam_record' 				=> __('Webcam Record' , 'say-cheese' ),
				'snapshot' 						=> __('Snapshot','say-cheese'),
				'take_snapshot' 				=> __('Take Snapshot','say-cheese'),
				'copy_paste' 					=> __('Copy & Paste' , 'say-cheese'),
				'pasted' 						=> __('Pasted' , 'say-cheese'),
				'image' 						=> __('Image'),
				'paste_error_no_image' 			=> __('No image data pasted.','say-cheese'),
				'paste_error'					=> __('Error pasting image data.','say-cheese'),
			),
			'options' => array(
				'enable_snapshot' 				=> get_option( 'saycheese_enable_snapshot' , is_ssl() ),
				'enable_pasteboard' 			=> get_option( 'saycheese_enable_pasteboard' , true ),
			),
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

	/**
	 *	@action 'print_media_templates'
	 */
	function print_media_templates() {
		$rp = SAY_CHEESE_DIRECTORY . 'include' . DIRECTORY_SEPARATOR . '/template/{,*/,*/*/,*/*/*/}*.php';
		foreach ( glob( $rp, GLOB_BRACE ) as $template_file ) {	
			include $template_file;
		}
	}
}


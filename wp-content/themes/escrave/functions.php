<?php
	//theme support
	function esc_theme_setup(){
		add_theme_support('post-thumbnails');
		
	}

	add_action('after_setup_theme', 'esc_theme_setup');

	//excerpt length control
	function set_excerpt_length(){
		return 45;
	}

	add_filter('excerpt_length', 'set_excerpt_length');
	
	//sidebar customization
	function esc_init_widgets($id){
		register_sidebar(array(
			'name' => 'Sidebar',
			'id'   => 'sidebar',
			'before_widget' => '<div class="sidebar-module">',
			'after_widget' => '</div>',
			'before_title' => '<h4>',
			'after_title' => '</h4>'
		) );
	}
	add_action('widgets_init', 'esc_init_widgets');
?>
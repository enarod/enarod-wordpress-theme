<?php
/**
 * @package Skeleton WordPress Theme Framework
 * @subpackage skeleton
 * @author Simple Themes - www.simplethemes.com
 *
 * Layout Hooks:
 *
 * skeleton_header // header tag and logo/header text
 * skeleton_header_extras // Additional content may be added to the header
 * skeleton_navbar // main menu wrapper
 * skeleton_before_content // Opening content wrapper
 * skeleton_after_content // Closing content wrapper
 * skeleton_before_sidebar // Opening sidebar wrapper
 * skeleton_after_sidebar // Closing sidebar wrapper
 * skeleton_footer // Footer
 *
 * For more information on hooks, actions, and filters, see http://codex.wordpress.org/Plugin_API.
 *
 * @package WordPress
 * @subpackage skeleton
 * @since skeleton 2.0
 *
 */


/*-----------------------------------------------------------------------------------*/
/* Theme Customizer
/*-----------------------------------------------------------------------------------*/

require_once get_template_directory() . '/customizer.php';

/*-----------------------------------------------------------------------------------*/
/* Register Core Stylesheets
/* These are necessary for the theme to function as intended
/* Supports the 'Better WordPress Minify' plugin to properly minimize styleshsets into one.
/* http://wordpress.org/extend/plugins/bwp-minify/
/*-----------------------------------------------------------------------------------*/

if ( !function_exists( 'skeleton_scripts' ) ) {

function skeleton_scripts() {

	// Set a dynamic version for cache busting
	$theme = wp_get_theme();
	if(is_child_theme()) {
		$parent = $theme->parent();
		$version = $parent['Version'];
		} else {
		$version = $theme['Version'];
	}

	wp_enqueue_script('superfish',get_template_directory_uri()."/javascripts/superfish.js",array('jquery'),$version,true);

	wp_enqueue_script('formalize',get_template_directory_uri()."/javascripts/jquery.formalize.min.js",array('jquery'),$version,true);

	wp_enqueue_script('custom',get_template_directory_uri()."/javascripts/custom.js",array('jquery'),$version,true);

	if ( is_singular() && comments_open() && get_option( 'thread_comments' ) ) {
		wp_enqueue_script( 'comment-reply' );
	}

	// register the various widths based on max_layout_width option
	$maxwidth = skeleton_options('layout', '960');
  	wp_enqueue_style('skeleton', trailingslashit(get_template_directory_uri()) .'/css/skeleton-'.$maxwidth.'.css', array(), $version, 'screen, projection');

    wp_enqueue_style('formalize', trailingslashit(get_template_directory_uri()).'/css/formalize.css', array(), $version, 'screen, projection');

    wp_enqueue_style('superfish', trailingslashit(get_template_directory_uri()).'/css/superfish.css', array(), $version, 'screen, projection');

	// Get Typography Options

	$body_font = str_replace("+"," ", skeleton_options('body_font', 'Sans-Serif'));
	$heading_font = str_replace("+"," ", skeleton_options('heading_font', 'Sans-Serif'));
	$protocol = is_ssl() ? 'https' : 'http';

	$body_query_args = array('family' => skeleton_options('body_font').':400,700');
	$heading_query_args = array('family' =>	skeleton_options('heading_font').':400,700');

	if ($body_font != 'Sans-Serif' && $body_font != 'Serif') {
		wp_enqueue_style('skeleton-body-fonts',add_query_arg($body_query_args, "$protocol://fonts.googleapis.com/css" ),array(), null);
	}
	if ($heading_font != 'Sans-Serif' && $body_font != 'Serif') {
		wp_enqueue_style('skeleton-heading-fonts',add_query_arg($heading_query_args, "$protocol://fonts.googleapis.com/css" ),array(), null);
	}

	wp_enqueue_style( 'skeleton-style', get_stylesheet_uri() );

	wp_enqueue_style( 'skeleton-theme-settings-css', trailingslashit(get_template_directory_uri()) . 'css/layout.css', array(), null );
	$secondary_color = skeleton_options('secondary_color', '#BE3243');
	$primary_color = skeleton_options('primary_color', '#375199');
	$body_bg_color = skeleton_options('body_bg_color', '#f9f9f9');
	$body_text_color = skeleton_options('body_text_color', '#333333');
	$link_color = skeleton_options('link_color', '#55a038');
	$link_hover_color = skeleton_options('link_hover_color', '#55a038');

	$css = "
		body {
			color: {$body_text_color};
			font-family: {$body_font};
			background-color: {$body_bg_color};
		}
		h1,h2,h3,h4,h5 {
			font-family: {$heading_font};
		}
		a,a:visited {
			color: {$link_color};
		}
		a:hover, a:focus, a:active {
			color: {$link_hover_color};
		}
		#header h1#site-title a {
			color:{$primary_color};
		}
		h3.widget-title,
		#header span.site-desc {
			color:{$secondary_color};
		}

	";
	wp_add_inline_style( 'skeleton-theme-settings-css', $css );

}

add_action( 'wp_enqueue_scripts', 'skeleton_scripts');

}






/*-----------------------------------------------------------------------------------*/
// Hookable theme option field to add add'l content to header
// such as social icons, phone number, widget, etc...
// Child Theme Override: skeleton_child_header_extras();
/*-----------------------------------------------------------------------------------*/

if ( !function_exists( 'skeleton_header_extras' ) ) {

	function skeleton_header_extras() {
		$header_extras = skeleton_options('header_extras');
		if ($header_extras) {
			$extras  = "<div class=\"header_extras\">";
            $extras .= $header_extras;
            echo "<div class = 'lang_top' id = 'lang_top'>";
            echo qtrans_generateLanguageSelectCode('dropdown');
            echo "</div>";
            $extras .= "</div>";
            echo apply_filters ('skeleton_child_header_extras',$extras);
		}
	}
	add_action('skeleton_header','skeleton_header_extras', 3);

}


/*-----------------------------------------------------------------------------------*/
/* Header Logo
/*-----------------------------------------------------------------------------------*/


if ( !function_exists( 'skeleton_logo' ) ) {

	function skeleton_logo() {
			// image
			if ( skeleton_options( 'logotype' ) ) :
				$skeleton_logo = '<h1 id="site-title">';
				$skeleton_logo .= '<a class="logotype-img" href="'.esc_url( home_url( '/' ) ).'" title="'.esc_attr( get_bloginfo( 'name', 'display' ) ).'" rel="home">';
				$skeleton_logo .= '<img src="'.skeleton_options( 'logotype' ).'" alt="'.esc_attr( get_bloginfo( 'name', 'display' ) ).'"></a>';
				$skeleton_logo .= '</h1>';
			// text
			else :
				$skeleton_logo = '<h1 id="site-title">';
				$skeleton_logo .= '<a class="text" href="'.esc_url( home_url( '/' ) ).'" title="'.esc_attr( get_bloginfo( 'name', 'display' ) ).'" rel="home">Електронна <span>демократія</span></a>';
				$skeleton_logo .= '</h1>';
				$skeleton_logo .= '<span class="site-desc">'.get_bloginfo('description').'</span>'. "\n";
			endif;
		echo apply_filters ( 'skeleton_child_logo', $skeleton_logo);
	}
	add_action('skeleton_header','skeleton_logo', 4);

}



/*-----------------------------------------------------------------------------------*/
/* Footer Credits
/*-----------------------------------------------------------------------------------*/

if ( !function_exists( 'skeleton_footer_credits' ) ) {
	function skeleton_footer_credits() {
		$footer_extras = skeleton_options('footer_extras');
		$extras  = '<div id="credits">';
		$extras .= $footer_extras;
		$extras .= "</div>";
		echo apply_filters('skeleton_author_credits',$extras);
	}
	add_action('skeleton_footer', 'skeleton_footer_credits',4);
}





//Added by Olga to disable cachefunction remove_cssjs_ver( $src ) {    if( strpos( $src, '?ver=' ) )        $src = remove_query_arg( 'ver', $src );    return $src;}add_filter( 'style_loader_src', 'remove_cssjs_ver', 10, 2 );add_filter( 'script_loader_src', 'remove_cssjs_ver', 10, 2 );

//Added by Olga 
add_action( 'init', 'create_post_type' );
function create_post_type() {
	register_post_type( 'carousel',
		array(
			'labels' => array(
				'name' => __( 'Carousel' ),
				'singular_name' => __( 'Carousel' )
			),
                'supports' => array( 'title', 'editor','thumbnail' ),
                'public' => true,
		'has_archive' => true,
		)
	);
}

// Added by Illia
//Making jQuery Google API
function modify_jquery() {
	if (!is_admin()) {
		// comment out the next two lines to load the local copy of jQuery
		wp_deregister_script('jquery');
		wp_register_script('jquery', 'https://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js', false, '1.7.2');
		wp_enqueue_script('jquery');
	}
}
add_action('init', 'modify_jquery');

// Added by Anton Goncharuk (02.09.2014)
add_filter( 'wpcf7_load_js', '__return_false' );
add_filter( 'wpcf7_load_css', '__return_false' );

function include_cf7_files() {
    if ( is_page( 'faq' ) ) {
        if ( function_exists( 'wpcf7_enqueue_scripts' ) )
            wpcf7_enqueue_scripts();
        if ( function_exists( 'wpcf7_enqueue_styles' ) )
            wpcf7_enqueue_styles();
    }
}

add_action( 'wp_head', 'include_cf7_files' );
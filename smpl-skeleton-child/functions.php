<?php
/**
 * @package Skeleton WordPress Theme Framework
 * @subpackage skeleton
 * @author Simple Themes - www.simplethemes.com
 *
 * Layout Hooks:
 *
 * skeleton_above_header // Opening header wrapper
 * skeleton_header // header tag and logo/header text
 * skeleton_header_extras // Additional content may be added to the header
 * skeleton_below_header // Closing header wrapper
 * skeleton_navbar // main menu wrapper
 * skeleton_before_content // Opening content wrapper
 * skeleton_after_content // Closing content wrapper
 * skeleton_before_sidebar // Opening sidebar wrapper
 * skeleton_after_sidebar // Closing sidebar wrapper
 * skeleton_footer // Footer
 *
 * Sets up the theme and provides some helper functions. Some helper functions
 * are used in the theme as custom template tags. Others are attached to action and
 * filter hooks in WordPress to change core functionality.
 *
 * The first function, skeleton_setup(), sets up the theme by registering support
 * for various features in WordPress, such as post thumbnails, navigation menus, and the like.
 *
 * When using a child theme (see http://codex.wordpress.org/Theme_Development and
 * http://codex.wordpress.org/Child_Themes), you can override certain functions
 * (those wrapped in a function_exists() call) by defining them first in your child theme's
 * functions.php file. The child theme's functions.php file is included before the parent
 * theme's file, so the child theme functions would be used.
 *
 * Functions that are not pluggable (not wrapped in function_exists()) are instead attached
 * to a filter or action hook. The hook can be removed by using remove_action() or
 * remove_filter() and you can attach your own function to the hook.
 *
 * We can remove the parent theme's hook only after it is attached, which means we need to
 * wait until setting up the child theme:
 *
 * For more information on hooks, actions, and filters, see http://codex.wordpress.org/Plugin_API.
 *
 * @package WordPress
 * @subpackage skeleton
 * @since skeleton 2.0
 */


add_action( 'pre_get_posts' , 'alter_query' );

function alter_query($query) {
    if (!$query->is_main_query()) {
        return;
    }

    if (!is_author()) {
        return;
    }

    $query->set('post_type', array('blogs', 'documents'));

}

/**
 * Programatically set some default values for skeleton theme,
 * only if values are not defined.
 *
 * @param $options - values to set.
 */
function set_skeleton_options($options) {
    $skeleton_options = (get_option('skeleton_options')) ? get_option('skeleton_options') : null;
    $updated = false;
    foreach ($options as $name=>$value) {
        if (!isset($skeleton_options[$name])) {
            $skeleton_options[$name] = $value;
            $updated = true;
        }
    }

    if ($updated) {
        update_option('skeleton_options', $skeleton_options);
    }
}

function en_setup() {
    // Set some defaults to Skeleton
    set_skeleton_options(array(
        'secondary_color' => '#be3243',
        'link_color' => '#55a038',
        'link_hover_color' => '#55a038'
    ));

    add_theme_support('post-thumbnails');
}
add_action('after_setup_theme', 'en_setup');

function en_scripts() {
    $theme = wp_get_theme();
    $version = $theme['Version'];
    $theme_uri = get_stylesheet_directory_uri();


    wp_enqueue_style(
        'shortcodes', trailingslashit(plugins_url()).'smpl-shortcodes/assets/css/smpl-shortcodes.css',
        array(), $version, 'screen, projection');

    wp_enqueue_script(
        'en-agreement-service', $theme_uri.'/crypto/agreement-service.js',
        array('jquery'), $version, 'screen, projection');
    wp_enqueue_script(
        'en-functions', $theme_uri.'/functions.js',
        array('jquery'), $version, 'screen, projection');
}
add_action('wp_enqueue_scripts', 'en_scripts');


/*-----------------------------------------------------------------------------------*/
/* Navigation Hook (skeleton_navbar)
/*-----------------------------------------------------------------------------------*/


if ( !function_exists( 'skeleton_main_menu' ) ) {

    function skeleton_main_menu() {
        echo '<nav id="en-navigation" class="row sixteen columns">';
        wp_nav_menu( array( 'container_class' => 'menu-header', 'theme_location' => 'primary'));
        echo '</nav><!--/#navigation-->';
    }

    add_action('skeleton_navbar','skeleton_main_menu', 1);

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
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


/** Tell WordPress to run skeleton_setup() when the 'after_setup_theme' hook is run. */

add_action( 'after_setup_theme', 'skeleton_setup' );

if ( ! function_exists( 'skeleton_setup' ) ):
/**
 * Sets up theme defaults and registers support for various WordPress features.
 *
 * Note that this function is hooked into the after_setup_theme hook, which runs
 * before the init hook. The init hook is too late for some features, such as indicating
 * support post thumbnails.
 *
 * To override skeleton_setup() in a child theme, add your own skeleton_setup to your child theme's
 * functions.php file.
 *
 */
function skeleton_setup() {
	add_editor_style();

	add_theme_support( 'automatic-feed-links' );

	add_theme_support( 'post-thumbnails' );

	add_theme_support( 'custom-background');

  	set_post_thumbnail_size( 150, 150 );
	// 150px square
	add_image_size( $name = 'squared150', $width = 150, $height = 150, $crop = true );
	// 250px square
	add_image_size( $name = 'squared250', $width = 250, $height = 250, $crop = true );
	// 4:3 Video
	add_image_size( $name = 'video43', $width = 320, $height = 240, $crop = true );
	// 16:9 Video
	add_image_size( $name = 'video169', $width = 320, $height = 180, $crop = true );

	register_nav_menus( array(
		'primary' => __( 'Primary Navigation', 'smpl' ),
		'footer'	=> __( 'Footer Navigation', 'smpl' )
	));

	// Load TGM plugin activation
	load_template( get_template_directory() . '/inc/class-tgm-plugin-activation.php' );

	// Translations can be filed in the /languages/ directory
	load_theme_textdomain( 'smpl', get_template_directory() . '/languages' );


}
endif; // end skeleton_setup


/*-----------------------------------------------------------------------------------*/
// Opening #header
/*-----------------------------------------------------------------------------------*/

if ( !function_exists( 'skeleton_header_open' ) ) {

	function skeleton_header_open() {
		echo "<div id=\"wrap\" class=\"container\">";
	  	echo "<div id=\"header\" class=\"sixteen columns\">\n<div class=\"inner\">\n";
	}
	add_action('skeleton_header','skeleton_header_open', 2);

}


/*-----------------------------------------------------------------------------------*/
// Hookable theme option field to add add'l content to header
// such as social icons, phone number, widget, etc...
// Child Theme Override: skeleton_child_header_extras();
/*-----------------------------------------------------------------------------------*/

if ( !function_exists( 'skeleton_header_extras' ) ) {

	function skeleton_header_extras() {
		$header_extras = skeleton_options('header_extras');
		if ($header_extras) {            $extras  = "<div class=\"header_extras\">";			$extras .= $header_extras;									echo "<div class = 'lang_top' id = 'lang_top'>"; 			echo qtrans_generateLanguageSelectCode('dropdown'); 						echo "</div>";			$extras .= "</div>";			echo apply_filters ('skeleton_child_header_extras',$extras);			
			//$extras  = "<div class=\"header_extras\">";
			//$extras .= $header_extras;
			//$extras .= "</div>";
			//echo apply_filters ('skeleton_child_header_extras',$extras);
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
/* Closes the #header markup
/*-----------------------------------------------------------------------------------*/

if ( !function_exists( 'skeleton_header_close' ) ) {

	function skeleton_header_close() {
		echo "</div>"."\n";
		echo "</div>"."\n";
		echo "<!--/#header-->"."\n";
	}
	add_action('skeleton_header','skeleton_header_close', 5);

}


/*-----------------------------------------------------------------------------------*/
/* Navigation Hook (skeleton_navbar)
/*-----------------------------------------------------------------------------------*/


if ( !function_exists( 'skeleton_main_menu' ) ) {

	function skeleton_main_menu() {
		echo '<div id="navigation" class="row sixteen columns">';
		wp_nav_menu( array( 'container_class' => 'menu-header', 'theme_location' => 'primary'));
		echo '</div><!--/#navigation-->';
	}

	add_action('skeleton_navbar','skeleton_main_menu', 1);

}


/*-----------------------------------------------------------------------------------*/
// Content Wrap Markup - skeleton_content_wrap()
// Be sure to add the excess of 16 to skeleton_before_sidebar() as well
/*-----------------------------------------------------------------------------------*/


if ( !function_exists( 'skeleton_content_wrap' ) )  {

	function skeleton_content_wrap() {

	$columns = '';
	$columns = apply_filters('skeleton_set_colwidth', $columns, 1);

	echo '<a id="top"></a>';
	echo '<div id="content" class="'.$columns.' columns">';

	}
	add_action( 'skeleton_before_content', 'skeleton_content_wrap', 1 );

}


/*-----------------------------------------------------------------------------------*/
// After Content Wrap Markup - skeleton_content_wrap_close()
/*-----------------------------------------------------------------------------------*/


if (! function_exists('skeleton_content_wrap_close'))  {

    function skeleton_content_wrap_close() {
    	echo "\t\t</div><!-- /.columns (#content) -->\n";
    }
    add_action( 'skeleton_after_content', 'skeleton_content_wrap_close', 1 );

}


/*-----------------------------------------------------------------------------------*/
// Sidebar Wrap Markup - skeleton_sidebar_wrap()
// Be sure to add the excess of 16 to skeleton_content_wrap() as well
/*-----------------------------------------------------------------------------------*/


if ( !function_exists( 'skeleton_sidebar_wrap' ) )  {

	function skeleton_sidebar_wrap() {

	$columns = '';
	$columns = apply_filters('skeleton_set_sidebarwidth', $columns, 1);


	echo '<div id="sidebar" class="'.$columns.' columns" role="complementary">';

	}
	add_action( 'skeleton_before_sidebar', 'skeleton_sidebar_wrap', 1 );

}


/*-----------------------------------------------------------------------------------*/
/* After Sidebar Markup
/*-----------------------------------------------------------------------------------*/

if ( !function_exists( 'skeleton_sidebar_wrap_close' ) ) {
	function skeleton_sidebar_wrap_close() {
	   echo '</div><!-- #sidebar -->';
	}
}

add_action( 'skeleton_after_sidebar', 'skeleton_sidebar_wrap_close');



/*-----------------------------------------------------------------------------------*/
// Global hook for footer actions
/*-----------------------------------------------------------------------------------*/

function skeleton_footer() {
	do_action('skeleton_footer');
}
add_action('wp_footer', 'skeleton_footer',1);


/*-----------------------------------------------------------------------------------*/
/* Before Footer
/*-----------------------------------------------------------------------------------*/

if (!function_exists('skeleton_before_footer'))  {
    function skeleton_before_footer() {
			$footerwidgets = is_active_sidebar('footer-widget-area-1') + is_active_sidebar('footer-widget-area-2') + is_active_sidebar('footer-widget-area-3') + is_active_sidebar('footer-widget-area-4');
			$class = ($footerwidgets == '0' ? 'noborder' : 'normal');
			echo '<div class="clear"></div><div id="footer" class="'.$class.' sixteen columns">';
    }
    add_action('skeleton_footer', 'skeleton_before_footer',1);
}


/*-----------------------------------------------------------------------------------*/
// Footer Widgets
/*-----------------------------------------------------------------------------------*/

if (! function_exists('skeleton_footer_widgets'))  {
	function skeleton_footer_widgets() {
		get_sidebar( 'footer' );
	}
	add_action('skeleton_footer', 'skeleton_footer_widgets',2);
}


/*-----------------------------------------------------------------------------------*/
// Footer Navigation
/*-----------------------------------------------------------------------------------*/

if ( !function_exists( 'skeleton_footer_nav' ) ) {

	function skeleton_footer_nav() {

		$defaults = array(
			'theme_location'  => 'footer',
			'container'       => 'div',
			'container_id' 	=> 'footermenu',
			'menu_class'      => 'menu',
			'echo'            => true,
			'fallback_cb'     => false,
			'after'           => '<span> | </span>',
			'depth'           => 1);
		wp_nav_menu($defaults);
		echo '<div class="clear"></div>';

	}
	add_action('skeleton_footer', 'skeleton_footer_nav',3);
}


/*-----------------------------------------------------------------------------------*/
/* Footer Credits
/*-----------------------------------------------------------------------------------*/

if ( !function_exists( 'skeleton_footer_credits' ) ) {
	function skeleton_footer_credits() {
		$footer_extras = skeleton_options('footer_extras');
		$extras  = '<div id="credits">';
		$extras .= $footer_extras;
		//$extras .= '<div class="themeauthor">WordPress Theme by <a href="http://www.simplethemes.com" title="Simple WordPress Themes">Simple Themes</a></div>';
		$extras .= "</div>";
		echo apply_filters('skeleton_author_credits',$extras);
	}
	add_action('skeleton_footer', 'skeleton_footer_credits',4);
}


/*-----------------------------------------------------------------------------------*/
/* After Footer
/*-----------------------------------------------------------------------------------*/

if (!function_exists('skeleton_after_footer'))  {

    function skeleton_after_footer() {
			echo "</div><!--/#footer-->"."\n";
			echo "</div><!--/#wrap.container-->"."\n";
    }
	add_action('skeleton_footer', 'skeleton_after_footer',5);
}


/*-----------------------------------------------------------------------------------*/
//	Register widgetized areas, including two sidebars and four widget-ready columns in the footer.
//	To override skeleton_widgets_init() in a child theme, remove the action hook and add your own
//	function tied to the init hook.
/*-----------------------------------------------------------------------------------*/

if ( !function_exists( 'skeleton_widgets_init' ) ) {

function skeleton_widgets_init() {
		// Area 1, located at the top of the sidebar.
		register_sidebar( array(
		'name' => __( 'Posts Widget Area', 'smpl' ),
		'id' => 'sidebar-1',
		'description' => __( 'Shown only in Blog Posts, Archives, Categories, etc.', 'smpl' ),
		'before_widget' => '<div id="%1$s" class="widget-container %2$s">',
		'after_widget' => '</div>',
		'before_title' => '<h3 class="widget-title">',
		'after_title' => '</h3>',
	) );


	// Area 2, located below the Primary Widget Area in the sidebar. Empty by default.
	register_sidebar( array(
		'name' => __( 'Pages Widget Area', 'smpl' ),
		'id' => 'sidebar-2',
		'description' => __( 'Shown only in Pages', 'smpl' ),
		'before_widget' => '<div id="%1$s" class="widget-container %2$s">',
		'after_widget' => '</div>',
		'before_title' => '<h3 class="widget-title">',
		'after_title' => '</h3>',
	) );

	// Area 3, located in the footer. Empty by default.
	register_sidebar( array(
		'name' => __( 'First Footer Widget Area', 'smpl' ),
		'id' => 'footer-widget-area-1',
		'description' => __( 'The first footer widget area', 'smpl' ),
		'before_widget' => '<div class="%1$s">',
		'after_widget' => '</div>',
		'before_title' => '<h3 class="widget-title">',
		'after_title' => '</h3>',
	) );

	// Area 4, located in the footer. Empty by default.
	register_sidebar( array(
		'name' => __( 'Second Footer Widget Area', 'smpl' ),
		'id' => 'footer-widget-area-2',
		'description' => __( 'The second footer widget area', 'smpl' ),
		'before_widget' => '<div class="%1$s">',
		'after_widget' => '</div>',
		'before_title' => '<h3 class="widget-title">',
		'after_title' => '</h3>',
	) );

	// Area 5, located in the footer. Empty by default.
	register_sidebar( array(
		'name' => __( 'Third Footer Widget Area', 'smpl' ),
		'id' => 'footer-widget-area-3',
		'description' => __( 'The third footer widget area', 'smpl' ),
		'before_widget' => '<div class="%1$s">',
		'after_widget' => '</div>',
		'before_title' => '<h3 class="widget-title">',
		'after_title' => '</h3>',
	) );

	// Area 6, located in the footer. Empty by default.
	register_sidebar( array(
		'name' => __( 'Fourth Footer Widget Area', 'smpl' ),
		'id' => 'footer-widget-area-4',
		'description' => __( 'The fourth footer widget area', 'smpl' ),
		'before_widget' => '<div class="%1$s">',
		'after_widget' => '</div>',
		'before_title' => '<h3 class="widget-title">',
		'after_title' => '</h3>',
	) );
}

/** Register sidebars by running skeleton_widgets_init() on the widgets_init hook. */

add_action( 'widgets_init', 'skeleton_widgets_init' );

}


/*-----------------------------------------------------------------------------------*/
// Featured Thumbnails
// Utility function for defining conditional featured image settings
/*-----------------------------------------------------------------------------------*/

if ( !function_exists( 'skeleton_thumbnailer' ) ) {

	function skeleton_thumbnailer($content) {
		global $post;
		global $id;
		$size = 'squared150';
		$align = 'alignleft scale-with-grid';
		$image = get_the_post_thumbnail($id, $size, array('class' => $align));
		$content =  $image . $content;
		return $content;
	}
	add_filter('the_content','skeleton_thumbnailer');

}


/*-----------------------------------------------------------------------------------*/
// Sets the post excerpt length to 40 characters.
// To override this length in a child theme, remove the filter and add your own
// function tied to the excerpt_length filter hook.
/*-----------------------------------------------------------------------------------*/


if ( !function_exists( 'skeleton_excerpt_length' ) ) {

	function skeleton_excerpt_length( $length ) {
		return 40;
	}
	add_filter( 'excerpt_length', 'skeleton_excerpt_length' );

}



/*-----------------------------------------------------------------------------------*/
// Returns a "Continue Reading" link for excerpts
/*-----------------------------------------------------------------------------------*/

if ( !function_exists( 'skeleton_continue_reading_link' ) ) {

	function skeleton_continue_reading_link() {
		return ' <a href="'. get_permalink() . '">' . __( 'Continue reading <span class="meta-nav">&rarr;</span>', 'smpl' ) . '</a>';
	}
}


/*-----------------------------------------------------------------------------------*/
// Replaces "[...]" (appended to automatically generated excerpts) with an ellipsis
// and skeleton_continue_reading_link().
//
// To override this in a child theme, remove the filter and add your own
// function tied to the excerpt_more filter hook.
/*-----------------------------------------------------------------------------------*/

if ( !function_exists( 'skeleton_auto_excerpt_more' ) ) {

	function skeleton_auto_excerpt_more( $more ) {
		return ' &hellip;' . skeleton_continue_reading_link();
	}
	add_filter( 'excerpt_more', 'skeleton_auto_excerpt_more' );

}

/*-----------------------------------------------------------------------------------*/
// Adds a pretty "Continue Reading" link to custom post excerpts.
/*-----------------------------------------------------------------------------------*/


if ( !function_exists( 'skeleton_custom_excerpt_more' ) ) {

	function skeleton_custom_excerpt_more( $output ) {
		if ( has_excerpt() && ! is_attachment() ) {
			$output .= skeleton_continue_reading_link();
		}
		return $output;
	}
	add_filter( 'get_the_excerpt', 'skeleton_custom_excerpt_more' );

}



/*-----------------------------------------------------------------------------------*/
// Removes the page jump when read more is clicked through
/*-----------------------------------------------------------------------------------*/


if ( !function_exists( 'remove_more_jump_link' ) ) {

	function remove_more_jump_link($link) {
		$offset = strpos($link, '#more-');
		if ($offset) {
		$end = strpos($link, '"',$offset);
		}
		if ($end) {
		$link = substr_replace($link, '', $offset, $end-$offset);
		}
		return $link;
	}
	add_filter('the_content_more_link', 'remove_more_jump_link');

}



/*-----------------------------------------------------------------------------------*/
//	Comment Styles
/*-----------------------------------------------------------------------------------*/

if ( ! function_exists( 'skeleton_comments' ) ) :
	function skeleton_comments($comment, $args, $depth) {
	$GLOBALS['comment'] = $comment; ?>
	<li <?php comment_class(); ?> id="li-comment-<?php comment_ID() ?>">
		<div id="comment-<?php comment_ID(); ?>" class="single-comment clearfix">
			<div class="comment-author vcard"> <?php echo get_avatar($comment,$size='64'); ?></div>
			<div class="comment-meta commentmetadata">
				<?php if ($comment->comment_approved == '0') : ?>
				<em><?php _e('Comment is awaiting moderation','smpl');?></em> <br />
				<?php endif; ?>
				<h6><?php echo __('By','smpl').' '.get_comment_author_link(). ' '. get_comment_date(). '  -  ' . get_comment_time(); ?></h6>
				<?php comment_text() ?>
				<?php edit_comment_link(__('Edit comment','smpl'),'  ',''); ?>
				<?php comment_reply_link(array_merge( $args, array('reply_text' => __('Reply','smpl'),'depth' => $depth, 'max_depth' => $args['max_depth']))); ?>
			</div>
		</div>
		<!-- </li> -->
	<?php  }
endif;


if ( ! function_exists( 'skeleton_posted_on' ) ) :
/**
 * Prints HTML with meta information for the current post-date/time and author.
 *
 * @since Skeleton 1.0
 */
function skeleton_posted_on() {
	printf( __( '<span class="%1$s">Posted on</span> %2$s <span class="meta-sep">by</span> %3$s', 'smpl' ),
		'meta-prep meta-prep-author',
		sprintf( '<a href="%1$s" title="%2$s" rel="bookmark"><span class="entry-date">%3$s</span></a>',
			get_permalink(),
			esc_attr( get_the_time() ),
			get_the_date()
		),
		sprintf( '<span class="author vcard"><a class="url fn n" href="%1$s" title="%2$s">%3$s</a></span>',
			get_author_posts_url( get_the_author_meta( 'ID' ) ),
			sprintf( esc_attr__( 'View all posts by %s', 'smpl' ), get_the_author() ),
			get_the_author()
		)
	);
}

endif;

if ( ! function_exists( 'skeleton_posted_in' ) ) :

	 // Prints HTML with meta information for the current post (category, tags and permalink).
	function skeleton_posted_in() {
		// Retrieves tag list of current post, separated by commas.
		$tag_list = get_the_tag_list( '', ', ' );
		if ( $tag_list ) {
			$posted_in = __( 'This entry was posted in %1$s and tagged %2$s. Bookmark the <a href="%3$s" title="Permalink to %4$s" rel="bookmark">permalink</a>.', 'smpl' );
		} elseif ( is_object_in_taxonomy( get_post_type(), 'category' ) ) {
			$posted_in = __( 'This entry was posted in %1$s. Bookmark the <a href="%3$s" title="Permalink to %4$s" rel="bookmark">permalink</a>.', 'smpl' );
		} else {
			$posted_in = __( 'Bookmark the <a href="%3$s" title="Permalink to %4$s" rel="bookmark">permalink</a>.', 'smpl' );
		}
		// Prints the string, replacing the placeholders.
		printf(
			$posted_in,
			get_the_category_list( ', ' ),
			$tag_list,
			get_permalink(),
			the_title_attribute( 'echo=0' )
		);
}

endif;


/*-----------------------------------------------------------------------------------*/
/* Custom Page Navigation
/*-----------------------------------------------------------------------------------*/

if ( ! function_exists( 'skeleton_custom_pagenav' ) ) :

function skeleton_custom_pagenav() {

	echo '<div id="nav-below" class="navigation">';
		if ( function_exists( 'wp_pagenavi' ) ) {

			if (is_page()) {
				wp_pagenavi( array( 'type' => 'multipart' ) );
			} elseif (is_single()) {
				previous_post_link( '<div class="nav-prev">%link</div>', __( 'Previous Post', 'smpl' ) );
				next_post_link( '<div class="nav-next">%link</div>', __( 'Next Post', 'smpl' ) );
			} else {
				wp_pagenavi();
			}

		} else {

			if (is_page()) {
				wp_link_pages( array( 'before' => '<div class="page-link">' . __( 'Pages:', 'smpl' ), 'after' => '</div>' ) );
			} elseif (is_single()) {
				previous_post_link( '<div class="nav-prev">%link</div>', __( 'Previous Post', 'smpl' ) );
				next_post_link( '<div class="nav-next">%link</div>', __( 'Next Post', 'smpl' ) );
			} else {
				next_posts_link( __( '<div class="nav-prev">Older posts</div>', 'smpl' ) );
				previous_posts_link( __( '<div class="nav-next">Newer posts</div>', 'smpl' ) );
			}

		}
	echo '</div><!-- #nav-below -->';
	}

add_action('skeleton_page_navi','skeleton_custom_pagenav');

endif;

/*-----------------------------------------------------------------------------------*/
// Sidebar Positioning Utility (sidebar-left | sidebar-right)
// Sets a body class for source ordered sidebar positioning
/*-----------------------------------------------------------------------------------*/


if ( !function_exists( 'skeleton_sidebar_position' ) ) {

function skeleton_sidebar_position($class) {
		$sidebar_position = skeleton_options('sidebar_position', 'right');
		$sidebar_position = ($sidebar_position == "right" ? "right" : "left");
		$class[] = 'sidebar-'.$sidebar_position;
		return $class;
	}
	add_filter('body_class','skeleton_sidebar_position');
}


/*-----------------------------------------------------------------------------------*/
/* Filterable utility function to set the content width - skeleton_content_width()
/* Specifies the column classes via conditional statements
/* See http://codex.wordpress.org/Conditional_Tags for a full list
/*-----------------------------------------------------------------------------------*/


if ( !function_exists( 'skeleton_content_width' ) ) {

	function skeleton_content_width() {

		global $post;
		$columns = skeleton_options('content_width', 'eleven');

		// Single Posts
		if ( is_single() ) {
			$post_wide = get_post_meta($post->ID, "sidebars", $single = true) ==  "false";

			// make sure no Post widgets are active
			if ( !is_active_sidebar('sidebar-1') || $post_wide ) {
				$columns = 'sixteen';
			}
			// wide attachement pages
			if ( is_attachment() ) {
				$columns = 'sixteen';
			}

		// Single Pages
		} elseif ( is_page() ) {
			$page_wide = is_page_template('onecolumn-page.php');

			// make sure no Page widgets are active
			if ( !is_active_sidebar('sidebar-2') || $page_wide ) {
				$columns = 'sixteen';
			}

		}

		return $columns;

	}
	// Create filter
	add_filter('skeleton_set_colwidth', 'skeleton_content_width', 10, 1);

}


/*-----------------------------------------------------------------------------------*/
/* Filterable utility function to set the sidebar width - skeleton_sidebar_width()
/* Specifies the column classes via conditional statements
/* See http://codex.wordpress.org/Conditional_Tags for a full list
/*-----------------------------------------------------------------------------------*/


if ( !function_exists( 'skeleton_sidebar_width' ) ) {

	function skeleton_sidebar_width() {
	global $post;
	$columns = skeleton_options('sidebar_width', 'five');

	// Single Posts
	if ( is_single() ) {
		// Check for custom field of sidebars => false
		$post_wide = get_post_meta($post->ID, "sidebars", $single = true) ==  "false";

		// make sure no Post widgets are active
		if ( !is_active_sidebar('sidebar-1') || $post_wide ) {
			$columns = false;
		}
	// Single Pages
	} elseif ( is_page() ) {
		// Pages: check for custom page template
		$page_wide = is_page_template('onecolumn-page.php');

		// make sure no Page widgets are active
		if ( !is_active_sidebar('sidebar-2') || $page_wide ) {
			$columns = false;
		}
	}

	return $columns;


	}
	// Create filter
	add_filter('skeleton_set_sidebarwidth', 'skeleton_sidebar_width', 10, 1);

}



/*-----------------------------------------------------------------------------------*/
/* Enable Shortcodes in excerpts and widgets
/*-----------------------------------------------------------------------------------*/


add_filter('widget_text', 'do_shortcode');
add_filter( 'the_excerpt', 'do_shortcode');
add_filter('get_the_excerpt', 'do_shortcode');


/*-----------------------------------------------------------------------------------*/
/* Override default embeddable content width
/*-----------------------------------------------------------------------------------*/

if (!function_exists('skeleton_content_width'))  {
	function skeleton_content_width() {
		$content_width = 580;
	}
}


/*-----------------------------------------------------------------------------------*/
/*  TGM plugin activation
/*-----------------------------------------------------------------------------------*/

if ( ! function_exists( 'smpl_recommended_plugins' ) ) {

	function smpl_recommended_plugins() {

		$plugins = array(
			array(
				'name' 				=> 'Regenerate Thumbnails',
				'slug' 				=> 'regenerate-thumbnails',
				'required'			=> false,
				'force_activation' 	=> false,
				'force_deactivation'=> false,
			),
			array(
				'name' 				=> 'WP-PageNavi',
				'slug' 				=> 'wp-pagenavi',
				'required'			=> false,
				'force_activation' 	=> false,
				'force_deactivation'=> false,
			),
			array(
				'name' 				=> 'Simple Shortcodes',
				'slug' 				=> 'smpl-shortcodes',
				'required'			=> true,
				'force_activation' 	=> false,
				'force_deactivation'=> false,
			)
		);
		tgmpa( $plugins );
	}
}
add_action( 'tgmpa_register', 'smpl_recommended_plugins' );


/*-----------------------------------------------------------------------------------*/
/* Remove WP Pagenavi Styles
/* Theme Includes Native Support
/*-----------------------------------------------------------------------------------*/


function skeleton_deregister_styles() {
	wp_deregister_style( 'wp-pagenavi' );
}

add_action( 'wp_print_styles', 'skeleton_deregister_styles', 100 );


/*-----------------------------------------------------------------------------------*/
/* Filters wp_title to print a proper <title> tag based on content
/*-----------------------------------------------------------------------------------*/

if (!function_exists('skeleton_wp_title'))  {

	function skeleton_wp_title( $title, $sep ) {
		global $page, $paged;

		if ( is_feed() )
			return $title;

		// Add the blog name
		$title .= get_bloginfo( 'name' );

		// Add the blog description for the home/front page.
		$site_description = get_bloginfo( 'description', 'display' );
		if ( $site_description && ( is_home() || is_front_page() ) )
			$title .= " $sep $site_description";

		// Add a page number if necessary:
		if ( $paged >= 2 || $page >= 2 )
			$title .= " $sep " . sprintf( __( 'Page %s', 'skeleton' ), max( $paged, $page ) );

		return apply_filters ('skeleton_child_wp_title',$title);
	}
}
add_filter( 'wp_title', 'skeleton_wp_title', 10, 2 );


/*-----------------------------------------------------------------------------------*/
/* Instead of remove_filter('the_content', 'wpautop');
/* The function below removes wp_autop from specified pages with a custom field:
/* Name: wpautop Value: false
/*-----------------------------------------------------------------------------------*/

if ( !function_exists( 'st_remove_wpautop' ) ) {

	function st_remove_wpautop($content) {
	    global $post;
	    // Get the keys and values of the custom fields:
	    $rmwpautop = get_post_meta($post->ID, 'wpautop', true);
	    // Remove the filter
	    if ('false' === $rmwpautop) {
	    	remove_filter('the_content', 'wpautop');
	    	remove_filter('the_content', 'wptexturize');
	    }
	    return $content;
	}
	// Hook into the Plugin API
	add_filter('the_content', 'st_remove_wpautop', 9);

}//Added by Olga to disable cachefunction remove_cssjs_ver( $src ) {    if( strpos( $src, '?ver=' ) )        $src = remove_query_arg( 'ver', $src );    return $src;}add_filter( 'style_loader_src', 'remove_cssjs_ver', 10, 2 );add_filter( 'script_loader_src', 'remove_cssjs_ver', 10, 2 );

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
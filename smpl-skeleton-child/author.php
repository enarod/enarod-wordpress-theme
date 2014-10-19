<?php
/**
 * The template for displaying Author Archive pages.
 *
 * @package Skeleton WordPress Theme Framework
 * @subpackage skeleton
 * @author Simple Themes - www.simplethemes.com
 */

get_header();
do_action('skeleton_before_content');
$curauth = (isset($_GET['author_name'])) ? get_user_by('slug', $author_name) : get_userdata(intval($author));
global $authordata;
$authordata = $curauth;
?>


<h1><?php printf( __( 'Автор: %s', 'smpl' ), "<a class='url fn n' href='" . get_author_posts_url( get_the_author_meta( 'ID', $curauth->ID ) ) . "' title='" . esc_attr( get_the_author() ) . "' rel='me'>" . get_the_author() . "</a>" ); ?></h1>

<?php
// If a user has filled out their description, show a bio on their entries.
if ( get_the_author_meta( 'description' ) ) : ?>


				<?php echo get_avatar( get_the_author_meta( 'user_email' ), apply_filters( 'skeleton_author_bio_avatar_size', 60 ) ); ?>


				<h2><?php printf( __( 'About %s', 'smpl' ), get_the_author() ); ?></h2>

				<?php the_author_meta( 'description' ); ?>


<?php endif; ?>

<?php


	/* Run the loop for the author archive page to output the authors posts
	 * If you want to overload this in a child theme then include a file
	 * called loop-author.php and that will be used instead.
	 */
	get_template_part( 'loop', 'author' );
	do_action('skeleton_after_content');
	get_sidebar();
    display_ca_sidebar();
	get_footer();
?>
<?php
/**
 * The Header for our theme.
 *
 * @package Skeleton WordPress Theme Framework
 * @subpackage skeleton
 * @author Simple Themes - www.simplethemes.com
 */

$theme_url = get_template_directory_uri();
$child_url = get_stylesheet_directory_uri();

?>
<!doctype html>
<!--[if lt IE 7 ]><html class="ie ie6" <?php language_attributes();?>> <![endif]-->
<!--[if IE 7 ]><html class="ie ie7" <?php language_attributes();?>> <![endif]-->
<!--[if IE 8 ]><html class="ie ie8" <?php language_attributes();?>> <![endif]-->
<!--[if IE 9 ]><html class="ie ie9" <?php language_attributes();?>> <![endif]-->
<!--[if (gte IE 10)|!(IE)]><!--><html <?php language_attributes();?>> <!--<![endif]-->

<head>
<meta charset="<?php bloginfo( 'charset' ); ?>">
<link rel="icon" href="<?php bloginfo('siteurl'); ?>/favicon.ico" type="image/x-icon" />
<link rel="shortcut icon" href="<?php bloginfo('siteurl'); ?>/favicon.ico" type="image/x-icon" />

<!--[if IE]><meta http-equiv='X-UA-Compatible' content='IE=edge,chrome=1'><![endif]-->
<!--[if lt IE 9]><script src="<?php echo $theme_url; ?>/js/html5.js"></script><![endif]-->

<title><?php wp_title( '|', true, 'right' ); ?></title>

<link rel="profile" href="http://gmpg.org/xfn/11">
<link rel="pingback" href="<?php bloginfo( 'pingback_url' ); ?>">


<!-- Mobile Specific Metas -->
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />

<?php wp_head(); ?>

<!-- E-narod stylesheet and js application -->
<script type="text/javascript"
        src="<?php echo $child_url; ?>/app/libs/require.js"
        data-main="<?php echo $child_url; ?>/app/main"></script>
<link rel="stylesheet/less" type="text/css" href="<?php echo $child_url; ?>/enarod.less">

</head>
<body <?php body_class(); ?>>
<?php
$top_title=get_locale()=='ru_UA'?'Вверх':'Вгору';
?>
<a href="#" class="scrollup" title="<?php print $top_title; ?>"><?php print $top_title; ?></a>

<?php
	do_action('skeleton_header');
	do_action('skeleton_navbar');
?>
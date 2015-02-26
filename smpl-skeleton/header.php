<?php

/**

 * The Header for our theme.

 *

 * @package Skeleton WordPress Theme Framework

 * @subpackage skeleton

 * @author Simple Themes - www.simplethemes.com

 */

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



<title><?php wp_title( '|', true, 'right' ); ?></title>



<link rel="profile" href="http://gmpg.org/xfn/11">



<link rel="pingback" href="<?php bloginfo( 'pingback_url' ); ?>">



<!--[if lt IE 9]>

	<script src="<?php echo get_template_directory_uri(); ?>/js/html5.js"></script>

<![endif]-->





<!-- Mobile Specific Metas

================================================== -->



<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />


<script type="text/javascript" src="/wp-content/themes/smpl-skeleton-child/jquery/jquery-1.7.2.min.js"></script>

<script type="text/javascript" src="/wp-content/themes/smpl-skeleton-child/jquery/jquery-ui-1.8.20.custom.min.js"></script>

<script type="text/javascript" src="/wp-content/themes/smpl-skeleton-child/crypto/agreement-service.js"></script>


<!--<script type="text/javascript" src="/wp-content/themes/smpl-skeleton-child/jquery/jquery.base64.min.js"></script>-->

<!--<link rel="stylesheet" type="text/css" media="screen" href="/wp-content/themes/smpl-skeleton-child/jquery/redmond/jquery-ui-1.8.20.custom.css" />-->





<?php wp_head(); ?>

<!--<link rel='stylesheet' id='smpl_shortcodes-css'  href='http://emaidan.infopulsepackaging.com/wp-content/plugins/smpl-shortcodes/assets/css/smpl-shortcodes.css' type='text/css' media='all' />-->

<link rel='stylesheet' id='smpl_shortcodes-css'  href='/wp-content/plugins/smpl-shortcodes/assets/css/smpl-shortcodes.css' type='text/css' media='all' />


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
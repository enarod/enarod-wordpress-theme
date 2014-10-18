<?php
/**
 * The loop that displays posts.
 *
 * The loop displays the posts and the post content.  See
 * http://codex.wordpress.org/The_Loop to understand it and
 * http://codex.wordpress.org/Template_Tags to understand
 * the tags used in it.
 *
 * This can be overridden in child themes with loop.php or
 * loop-template.php, where 'template' is the loop context
 * requested by a template. For example, loop-index.php would
 * be used if it exists and we ask for the loop with:
 * <code>get_template_part( 'loop', 'index' );</code>
 *
 * @package Skeleton WordPress Theme Framework
 * @subpackage skeleton
 * @author Simple Themes - www.simplethemes.com
 */
?>


<?php
/**
 * Agreement 
 */

$ThisPost_ID =  $post->ID;
$photo = (get_post_meta($post->ID, 'wpcf-photo', true));
$deputy_name = get_the_title();
$id = (get_post_meta($post->ID, 'wpcf-contract-id', true)); 
?>

<script type="text/javascript" src="/wp-content/themes/smpl-skeleton-child/jquery/jquery.center.js"></script>

<!-- added on May, 19 by Illia-->
<link rel="stylesheet" href="/wp-content/themes/smpl-skeleton-child/jquery/jQuery-Form-Validator-master/custom/form.css" type="text/css">

<script type="text/javascript" src="/wp-content/themes/smpl-skeleton-child/jquery/jQuery-Form-Validator-master/form-validator/jquery.form-validator.min.js"></script>
<script type="text/javascript" src="/wp-content/themes/smpl-skeleton-child/jquery/jQuery-Form-Validator-master/form-validator/date.js"></script>
<script type="text/javascript" src="/wp-content/themes/smpl-skeleton-child/jquery/jQuery-Form-Validator-master/form-validator/location.js"></script>
<script type="text/javascript" src="/wp-content/themes/smpl-skeleton-child/jquery/jQuery-Form-Validator-master/form-validator/security.js"></script>


<link rel="stylesheet" type="text/css" media="screen" href="/wp-content/themes/smpl-skeleton-child/jquery/redmond/jquery-ui-1.8.20.custom.css" />

<!-- added on May 31 by Illia -->
<script type="text/javascript" src="/wp-content/themes/smpl-skeleton-child/crypto/agreement-service.js"></script>
<script type="text/javascript" src="/wp-content/themes/smpl-skeleton-child/crypto/cert.common.js"></script>
<script type="text/javascript" src="/wp-content/themes/smpl-skeleton-child/crypto/cert.dpa.js"></script>
<script type="text/javascript" src="/wp-content/themes/smpl-skeleton-child/crypto/cert.uacrypto.js"></script>
<script type="text/javascript" src="/wp-content/themes/smpl-skeleton-child/crypto/dialog.userDetails.js"></script>
<script type="text/javascript" src="/wp-content/themes/smpl-skeleton-child/crypto/dialog.certSelector.js"></script>

<script type="text/javascript">
	var agreementID = <?php echo $id ?>;
	var service = new AgreementService();
	service.getAgreement(<?php echo $id ?>, function (data) {
		$('#agreement-name').html('<div>' + data.Name + '</div>');
		$('#agreement-text').html('<div>' + data.Description + '</div>');
		$('#agreement-stats').html(data.NumberOfVotes);
	});
</script>

<div class="agreements-navi">
	<a href="/agreements-president/" class="active">Президент України</a>
&nbsp;&nbsp;|&nbsp;&nbsp;
	<a href="/agreements-major/">Мер Києва</a>
<!--
<div class="one_third last">
	<a href="/agreements-deputy/">Кандидати у депутати Київради</a>
</div>
-->
</div>

<div class="su-column su-column-size-3-4" style="width: 74%; float:left;">
<h1><div id="agreement-name"></div></h1>
<div id="agreement-text"></div>


<div>
<div class="one_fourth last">
	<div class="text-2"><input type="button" value="Назад" class="button_green" onclick="location.href='/../agreements-president/'">
		</div></div>
<!--<div class="one_fourth">

	<div class="text-2">		
<input type="button" value="Завантажити" class="button_green"></div>
<div class="one_fourth">
	<div class="text-2"><input type="button" value="Друкувати" class="button_green"></div>
</div>
<div class="one_fourth last">
	<div class="text-2">
		<button id="sign_button">Пiдписати</button>
		<input id="sign_button2" type="button" value="Підписати" class="button_green">
	</div>
</div> -->

	</div>
</div>
 
<?php
/**
 * Photo and name 
 */
?>
<div class="su-column su-column-size-1-4 agreement">
<div class="deputy_main">
   <div class="img_div"> 
   <img src="<?php echo $photo; ?>" class="img_deputy"/>
   </div>
  
   <h3 class="entry-title"><?php echo $deputy_name; ?></h3>
   <div class="stats">Підписів: <span id="agreement-stats"></span></div>
    <?php // echo (get_post_meta($post->ID, 'wpcf-contract-id', true)); ?>
	<button id="sign_button">Пiдписати угоду</button>
</div>

<ul> 
<?php
/**
 * Show all  
 */
?>
	<?php
$my_posts = get_posts('post_type=agreements-president');
$number_posts=count($my_posts);
$count=1;
foreach ($my_posts as $post) :
setup_postdata($post);
if($post->ID !== $ThisPost_ID):
?><li class="<?php echo $number_posts==$count?'deputu_li_last':'deputu_li' ?>"><a href="<?php the_permalink(); ?>">  
      <div class="div_deputy"> 
      <div class="img_div_small div_left"> 
            <img src="<?php echo (get_post_meta($post->ID, 'wpcf-photo', true)); ?>" class="img_deputy"/>
      </div>
	  <div class="deputy_right">
	        <div class="deputy_title"><?php the_title(); ?></div>
			<!--<br/><input type="button" value="Перейти" class="button_green" onclick="location.href='<?php the_permalink(); ?>'">-->
			<button id="sign_button-<?php echo $post->ID ?>" onclick="location.href='<?php the_permalink(); ?>'">Пiдписати</button>
	  </div>
	  </div>
<div class="clear"></div>
	  <div>
		<?php echo (get_post_meta($post->ID, 'wpcf-contract-items', true)); ?>
	  </div>
  </a></li>
<?php 
 endif;
$count++;
endforeach; ?>
</ul>
<script>
	var baseUrl = '/wp-content/themes/smpl-skeleton-child/crypto/';
	var signButton = $('#sign_button');
	var keySelectorDialog;
	signButton.click(function () {
		keySelectorDialog = new KeySelectorDialog();
	});
</script>


</div>z
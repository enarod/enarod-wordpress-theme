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
 
?>
<div class="agreements-navi">
<div class="one_third">
	<a href="/agreements-president/">Кандидати у президенти</a>
</div>
<div class="one_third">
	<a href="/agreements-major/">Кандидати у мери Києва</a>
</div>
<div class="one_third last">
	<a href="/agreements-deputy/" class="active">Кандидати у депутати Київради</a>
</div>
</div>

<div class="su-column su-column-size-3-4" style="width: 74%; float:left;">

<?php

$etalon_id = 580;
?>
<h1> <?php echo get_the_title($etalon_id); ?> </h1>

<?php
$post_id_380 = get_post($etalon_id);
$content = $post_id_380->post_content;
$content = apply_filters('the_content', $content);
$content = str_replace(']]>', ']]>', $content);
echo $content;
?>

<div>
<div class="one_fourth">
	<div class="text-2"><!--<input type="button" value="Назад" class="button_green">-->
		</div></div>
<!--
<div class="one_fourth">
	<div class="text-2">		
<input type="button" value="Завантажити" class="button_green"></div></div>
<div class="one_fourth">
	<div class="text-2"><input type="button" value="Друкувати" class="button_green"></div></div>
<div class="one_fourth last">
	<div class="text-2"><input type="button" value="Підписати" class="button_green"></div></div>
-->
</div>
</div>
 
<?php
/**
 * Photo and name 
 */
?>
<div class="su-column su-column-size-1-4" style="width: 20%; float:left; padding-left:20px;">
  
<ul> 
<?php
/**
 * Show all  
 */
?>
	<?php
$my_posts = get_posts('post_type=agreements-deputy');
$number_posts=count($my_posts);
$count=1;
foreach ($my_posts as $post) :
setup_postdata($post);
?>
<a href="<?php the_permalink(); ?>"><li class="<?php echo $number_posts==$count?'deputu_li_last':'deputu_li' ?>">  
      <div class="div_deputy"> 
      <div class="img_div_small div_left"> 
            <img src="<?php echo (get_post_meta($post->ID, 'wpcf-photo', true)); ?>" class="img_deputy"/>
      </div>
	  <div>
	        <div class="deputu_title"><?php the_title(); ?></div>
			<!--<br/><input type="button" value="Перейти" class="button_green" onclick="location.href='<?php the_permalink(); ?>'">-->
			<br/><button id="sign_button-<?php echo $post->ID ?>" onclick="location.href='<?php the_permalink(); ?>'">Пiдписати</button>
	  </div>
	  </div>
	  <div>
		<?php echo (get_post_meta($post->ID, 'wpcf-contract-items', true)); ?>
	  </div>
  </li></a>
<?php 
$count++;
endforeach; ?>
</ul>

</div>

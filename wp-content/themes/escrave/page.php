<?php get_header(); ?>

	<section id="<?php the_title(); ?>">
	  <!-- SECTION Header-->
        <div class="container-fluid section-header">
            <h2 class="text-center">
				<?php the_title(); ?>
			</h2>
        </div>
		
		<div class="container">
			<div class="row">
				<div class="col-sm-10 offset-sm-1">
					<?php echo get_post_field('post_content', $post->ID); ?>
				</div>
			</div>
		</div>
		
	</section>

<?php get_footer(); ?>
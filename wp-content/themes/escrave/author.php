<?php get_header(); ?>

<!-- This sets the $curauth variable -->

	<?php
		$curauth = (isset($_GET['author_name'])) ? get_user_by('slug', $author_name) : get_userdata(intval($author));
	?>



  <section id="author-profile">
          <!-- SECTION Header-->
          <div class="container-fluid section-header">
              <h2 class="text-center"><?php echo $curauth->nickname; ?></h2>
          </div>
      <div class="container"> 
          <div class="row">
              <div class="col-sm-10 offset-sm-1" style="margin-bottom:25px;">
				
				<h3><?php echo $curauth->first_name." ".$curauth->last_name ?></h3>
				
				
				<img class="author-avatar" src="<?php echo esc_url( get_avatar_url( $curauth->ID ) ); ?>"/>
				<div class="author-info">
					
					<h4>Website</h4>
					<p><a href="<?php echo $curauth->user_url; ?>"><?php echo $curauth->user_url; ?></a></p>
					<h4>Profile</h4>
					<p><?php echo $curauth->user_description; ?></p>
					
						<h3>Posts by <?php echo $curauth->nickname; ?>:</h3>

						<ul>
					<!-- The Loop -->

						<?php if ( have_posts() ) : while ( have_posts() ) : the_post(); ?>
							<li>
								<a href="<?php the_permalink() ?>" rel="bookmark" title="Permanent Link: <?php the_title(); ?>">
								<?php the_title(); ?></a>,
								<?php the_time('d M Y'); ?> in <?php the_category('&');?>
							</li>

						<?php endwhile; else: ?>
							<p><?php _e('No posts by this author.'); ?></p>

						<?php endif; ?>

					<!-- End Loop -->

						</ul>
				</div>

			

			</div>	
		</div>
	</div>
</section>
<?php get_footer(); ?>
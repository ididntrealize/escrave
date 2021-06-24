<?php get_header(); ?>

	<section id="archive">
        <!-- SECTION Header-->
        <div class="container-fluid section-header">
            <h2 class="text-center">Category:&nbsp;
				<?php
					foreach((get_the_category()) as $category) { 
						echo $category->cat_name . ' '; 
					} 
				?>
			</h2>
        </div>
    
        <div class="container">
          <div class="row">
            <div class="col-md-7 offset-md-1 col-sm-8">
		
			
				<?php if ( have_posts() ) : ?>
					<?php while ( have_posts() ) : the_post(); ?>
					  <div id="post-<?php the_ID(); ?>" <?php post_class(); ?>>
						<div class="post-header">
						   
							<h3><a href="<?php the_permalink(); ?>" rel="bookmark" title="Permanent Link to <?php the_title_attribute(); ?>">
								<?php the_title(); ?>
							</a></h3>
							   <div class="post-info">
									<div class="date">Posted: <?php the_time( 'M j, Y' ); ?></div>
									<div class="author">by: 
										<a href="<?php echo get_author_posts_url(get_the_author_meta("ID")); ?>">
											<?php the_author(); ?>
										</a>
									</div>
								   
							   </div>
							   <?php if(has_post_thumbnail()) : ?>
								<div class="post-thumb">
								<a href="<?php the_permalink(); ?>" rel="bookmark" title="Permanent Link to <?php the_title_attribute(); ?>">
									<?php the_post_thumbnail(); ?>
								</a>
								</div>
							   <?php endif; ?>
						</div><!--end post header-->
						<div class="entry clear">
						   <?php the_excerpt(); ?>
						   <?php wp_link_pages(); ?> 
						</div>
						<!--end entry-->
						<div class="post-footer">
							<div class="read-more">
								<a class="btn btn-outline-info btn-lg" href="<?php the_permalink(); ?>" rel="bookmark" title="Permanent Link to <?php the_title_attribute(); ?>">
									Read more
								</a>
							</div>
						   <div class="comments">
								<?php comments_popup_link( 'Leave a Comment', '1 Comment', '% Comments' ); ?>
							</div>
						</div><!--end post footer-->
						</div><!--end post-->
					<?php endwhile; /* rewind or continue if all posts have been fetched */ ?>
						<div class="navigation index">
						   <div class="alignleft"><?php next_posts_link( 'Older Entries' ); ?></div>
						   <div class="alignright"><?php previous_posts_link( 'Newer Entries' ); ?></div>
						</div><!--end navigation-->
					<?php else : ?>
					
					<p><?php __('No posts have been made'); ?></p>
				<?php endif; ?>

			
			
			
				<!--div class="methods">
				  <div class="method-chunk">
					<h3>The old paradigm:</h3>
					<p>
					  When people fail at ‘quitting’ something, they tend to give up trying to quit entirely. So even if they
					  lasted a lot longer than they normally do, they feel like they failed and so stop trying to achieve
					  their goals. That’s why escrave is based on helping you make gradual improvements until you feel that
					  you do your guilty pleasure at an acceptable amount, rather than being focused entirely on quitting.
					</p>
				  </div>
				  <div class="method-chunk">
					<h3>Committing to logging:</h3>
					<p>
					  You might say that opening escrave and entering in data every time you do or buy your guilty pleasure
					  is too much of a time commitment. I would say that extra time commitment is directly in line with the
					  purpose of this app. The longer you can wait, the greater the chance that you will be able to resist.
					</p>
				  </div>
				  <div class="method-chunk">
					<h3>Making conscious decisions:</h3>
					<p>
					  Whenever you open escrave to mark a behavior, you are presented with consciously committing to a choice
					  to do or not to do. If you’ve made a conscious decision to cut back, being reminded of your own
					  commitment at the last moment could be the difference between doing or not.
					</p>
				  </div>
				  <div class="method-chunk">
					<h3>Recognizing and accepting cravings:</h3>
					<p>
					  It’s not so difficult to know how much you spend on a habit, most people are already keeping track in
					  their heads. You can probably convert the money into an approximation of how much you do your habit,
					  however, figuring out how many times you consider doing it but decide not to, is nearly impossible
					  without help. Recognizing those incremental successes is incredibly important, because they are
					  entirely what your end goal is composed of. escrave helps you give that choice of inaction enough
					  weight that it doesn’t slip through the cracks.
					</p>
				  </div>
				  <div class="method-chunk">
					<h3>Extending escrave</h3>
					<p>
					  For escrave to be effective, you must consistently log your behaviors into it, so how can you get into
					  the habit of opening escrave each time you do your guilty pleasure? First, you should figure out the
					  physical location where you go to do/buy it. Then, put a reminder somewhere that you can see it. For
					  example, if you are tracking cigarettes, a post-it note on your pack could do the trick.
					</p>
				  </div>
				</div-->
			</div>
			<div class="col-md-4 col-sm-4">
				<div class="sidebar-widget">
					<?php if(is_active_sidebar('sidebar')): ?>
						<?php dynamic_sidebar('sidebar'); ?>
					<?php endif; ?>
				</div>
          </div>
        </div>
        
      </section>
<?php get_footer(); ?>
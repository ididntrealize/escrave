<!DOCTYPE html>
<html <?php language_attributes(); ?>>
  <head>
    <meta charset="<?php bloginfo('charset');?>" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1, shrink-to-fit=no"
    />
    <meta
      name="description"
      content="<?php bloginfo('description'); ?>"
    />
    <meta name="author" content="Corey Boiko" />
	<meta property="og:url" content="https://www.escrave.com" />
	<meta property="og:image" content="https://www.escrave.com/app/images/escrave-logo-preview.png" />
	<meta property="og:title" content="<?php bloginfo('name'); ?>" />
	<meta property="og:description" content="<?php bloginfo('description'); ?>" />


    <link rel="icon" href="<?php bloginfo('template_url');?>/images/favicon.ico" />
	<!--
    <link rel="manifest" href="wp-content/themes/escrave/manifest.json" />
	-->

    <title>
		<?php bloginfo('name'); ?> | 
		<?php is_front_page() ? print('Anonymous Addiction Tracking app & blog') : bloginfo('wp_title'); ?>
	
	</title>

    <!-- Bootstrap core CSS
    <link
      href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-beta.2/css/bootstrap.min.css"
      rel="stylesheet"
      integrity="sha384-PsH8R72JQ3SOdhVi3uxftmaW6Vc51MKb0q5P2rRUpPvrszuE4W1povHYgTpBfshb"
      crossorigin="anonymous"
    />
  -->
    <link rel="stylesheet" href="<?php bloginfo('template_url');?>/theme-css/bootstrap.min.css" />

    <!-- jQuery UI css 
    <link
      rel="stylesheet"
      media="all"
      href="https://code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css"
    />
	
	 <link rel="stylesheet" href="theme-css/jquery-ui.css" />

    -->

    <!-- temp google font, yo! -->
   <link href="https://fonts.googleapis.com/css?family=Neucha|Varela&display=swap" rel="stylesheet">
   
    <!-- Font awesome
    <link
      rel="stylesheet"
      href="https://use.fontawesome.com/releases/v5.7.0/css/all.css"
      integrity="sha384-lZN37f5QGtY3VHgisS14W3ExzMWZxybE1SJSEsQp9S+oqd12jhcu+A56Ebc1zFSJ"
      crossorigin="anonymous"
    />
  -->
    <link href="<?php bloginfo('template_url');?>/fontawesome/css/all.min.css" rel="stylesheet" />

    <!-- Custom styles for this template -->
    <link href="<?php bloginfo('stylesheet_url');?>" rel="stylesheet" />
	
	<?php wp_head(); ?>
	
  </head>
  
  <body>
  
 <!-- Navigation -->
    <nav class="navbar fixed-top navbar-expand-lg navbar-light bg-white fixed-top" 
		 style="<?php 
					  // Fix menu overlap
					  if ( is_admin_bar_showing() ) echo 'margin-top:32px;'; 
				?>">
				
      <div class="container">
        <a class="navbar-brand logo-and-tagline" href="<?php echo home_url(); ?>">
          <img class="img-fluid" src="<?php bloginfo('template_url'); ?>/images/escrave-logo-extended.png" />
          <!--span class="tagline">escrave</span-->
        </a>
        <button
          class="navbar-toggler navbar-toggler-right"
          type="button"
          data-toggle="collapse"
          data-target="#navbarResponsive"
          aria-controls="navbarResponsive"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarResponsive">
          <ul class="navbar-nav ml-auto">
            <li class="nav-item d-none d-md-block">
              <a class="btn btn-outline-willing btn-lg" href="<?php echo home_url(); ?>/app/app.html" style="margin-top: 17px;">Test the app</a>
            </li>
            <li class="nav-item d-md-none">
                <a class="btn btn-outline-willing btn-lg" href="<?php echo home_url(); ?>/app/app.html">Try the app</a>
              </li>
            <li class="nav-item">
             <a class="nav-link scroll-to-href" href="<?php echo home_url(); ?>#value-proposition">Benefits</a>
            </li>
            <li class="nav-item">
              <a class="nav-link scroll-to-href" href="<?php echo home_url(); ?>#functionality">Functionality</a>
            </li>
            <li class="nav-item">
              <a class="nav-link scroll-to-href" href="<?php echo home_url(); ?>#privacy">Privacy</a>
            </li>
            <li class="nav-item">
              <a class="nav-link scroll-to-href" href="<?php echo home_url(); ?>#habits">Habits</a>
            </li>
            <li class="nav-item">
              <a class="nav-link scroll-to-href" href="<?php echo home_url(); ?>#methods">Blog</a>
            </li>
			  <div class="d-md-none">
					<hr/>
			  </div>
          </ul>
        </div>
      </div>
    </nav>
	
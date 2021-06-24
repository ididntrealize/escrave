$(document).ready(function(){

      
      /* shrink menu on scroll */
        $(window).scroll(function() {
            if ($(document).scrollTop() > 50) {
            $('.navbar-brand img').addClass('shrink');
            $('.navbar-brand .tagline').addClass('shrink');
                $(window).unbind('scroll');
            } else {
                $('.navbar-brand img').removeClass('shrink');
                $('.navbar-brand .tagline').removeClass('shrink');
            }
        });

        /* Bind minHeight of section to INITIAL 100vh, HOTfix of viewport resize bug */

			var initVeiwportHeight = $(window).height();
			var percentHeight = initVeiwportHeight*.70;
            $("section").css("min-height", percentHeight);
			
		/* Check if user it scrolled at all */
		if($(document).scrollTop() > 50){
			//trigger navbar shrink
			$('.navbar-brand img').addClass('shrink');
            $('.navbar-brand .tagline').addClass('shrink');
		}

		// close dropdown nav on scrolly link click
		$(function(){ 
			var navMain = $(".navbar-collapse"); // avoid dependency on #id
			// "a:not([data-toggle])" - to avoid issues caused
			// when you have dropdown inside navbar
			navMain.on("click", "a:not([data-toggle])", null, function () {
				navMain.collapse('hide');
			});
		});


		/* BLINKY HEADING */
		setInterval(() => {
			//add or remove class 'hidden'
			$('.main-heading-variation span').toggleClass('transparent');

		}, 3000);


		/* SCROLLY LINKS */
		
		/*check if scroll necessary */
		$(".scroll-to-href").click(function(event){
				
			event.preventDefault();
				
				console.log($(this).attr("href"));
				
				var linkLocation = $(this).attr("href");
				var scrollToLocation = "#mainBodyContainer";
				var navBarHeight = 62;
		
		
						if(linkLocation.includes("#")){
							scrollToLocation = "#" + linkLocation.split("#")[1];
						}
					
				//if target exists on curr page
				if($(scrollToLocation).height()){
					$('html, body').animate({
						scrollTop: $(scrollToLocation).offset().top - navBarHeight
					}, 1000);
				}else{
				//else 
					window.location = linkLocation;
				}
		});
		
    });
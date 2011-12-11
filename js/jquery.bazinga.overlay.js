/*
 * jQuery Overlay Plugin
 * by Dylan Swartz
 * Written for CIS255 final project. Used again in CS401.
 *
 * Tuesday, June 7, 2011
 */


(function($) {
	 
    /* Listener for data-overlay-id attribute
    * For more info on custom attributes:
    * http://ejohn.org/blog/html-5-data-attributes/ */

    $('a[data-overlay-id]').live('click', function(e) {
        e.preventDefault(); // Stop the link from going to another page
        // Get the value from the link's data-overlay-id attribute
        var overlayLocation = $(this).attr('data-overlay-id');
        // Run the overlay function
        // Passing $(this).data() will maintain the state of this specific overlay
        $('#'+overlayLocation).bazingaOverlay($(this).data());
    });


    /* Extend  jquery with the bazingaOverlay funtiona and execute  it*/
    $.fn.bazingaOverlay = function(options) {
        
        var defaults = {  
            animationspeed: 300, // how long the animation will run
            closeonbgclick: true, // should the overlay close when clicking the background?
            killoverlayclass: 'close-bazinga-overlay' // the class of a button or element that will close an open overlay
    	}; 
    	
        // Extend the options (allows for other developers to add othere settings and such)
        var options = $.extend({}, defaults, options); 
	
        return this.each(function() { // returning "this" maintains chainability for other jquery functions
        
            /* Global Variables */
            // Don't yell at me. I know I shouldn't be using global variables in JS. :/
            var overlay = $(this),
            topMeasure  = parseInt(overlay.css('top')),
            topOffset   = overlay.height() + topMeasure,
            locked      = false,
            overlayBG   = $('.bazinga-overlay-bg');

            /* Create the overlay background */
            if(overlayBG.length == 0) {
                overlayBG = $('<div class="bazinga-overlay-bg" />').insertAfter(overlay);
            }

            /* Open & Close Animations */

            // Open Animation
            overlay.bind('bazingaOverlay:open', function () {
                overlayBG.unbind('click.overlayEvent');
                $('.' + options.killoverlayclass).unbind('click.overlayEvent');
                // only executing when the overlay is unlocked prevents multiple animations from running at the same time
                if(!locked) {
                    lockOverlay(); // sets the locked boolean to true

                    /*
                     * I use the animate function like this:
                     * .animate( properties, animationSpeed, functionToExecuteAfterCompletion )
                     *
                     */
                    overlay.css({'opacity' : 0, 'visibility' : 'visible', 'top': $(document).scrollTop()+topMeasure});
                    overlayBG.fadeIn(options.animationspeed/2);
                    overlay.delay(options.animationspeed/2).animate({
                            "opacity" : 1
                    }, options.animationspeed,unlockOverlay());

                    // This was before I put in the animation
                    /* overlay.css({'visibility' : 'visible', 'top':$(document).scrollTop()+topMeasure});
                    overlayBG.css({"display":"block"});
                    unlockOverlay() */
                }
                overlay.unbind('bazingaOverlay:open');
            });

            // Close Animation
            overlay.bind('bazingaOverlay:close', function () {
                if(!locked) { // make sure an an animation isn't running
                    lockOverlay(); // let everyone know that you're running an animation

                    /*
                     * I use the animate function like this:
                     * .animate( properties, animationSpeed, functionToExecuteAfterCompletion )
                     *
                     */
                    overlayBG.delay(options.animationspeed).fadeOut(options.animationspeed);
                    overlay.animate({
                        "opacity" : 0
                    }, options.animationspeed, function() {
                        overlay.css({'opacity' : 1, 'visibility' : 'hidden', 'top' : topMeasure});
                        unlockOverlay();
                    });
                    

                   // This was before I put in the animation
                   /* overlay.css({'visibility' : 'hidden', 'top' : topMeasure});
                    overlayBG.css({'display' : 'none'}); */
                    
                }
                overlay.unbind('bazingaOverlay:close');
            });
   	
            /* Event listeners */

            // Open the overlay now! >:O
            overlay.trigger('bazingaOverlay:open')
			
            // Event listener for when the close button is clicked
            var closeButton = $('.' + options.killoverlayclass).bind('click.overlayEvent', function () {
              overlay.trigger('bazingaOverlay:close') // Close the overlay
            });

            // Event listener for when the user clicks the background
            // (provided that option is set)
            if(options.closeonbgclick) {
                overlayBG.css({"cursor":"pointer"})
                overlayBG.bind('click.overlayEvent', function () {
                    overlay.trigger('bazingaOverlay:close') // Close that overlay son!
                });
            }
            // Event listener for the escape key
            $('body').keyup(function(e) {
                // The === operator doesn't perform any type coercion
                if(e.which===27){ overlay.trigger('bazingaOverlay:close'); } // 27 is the keycode for the Escape key
            });
			
            /* Animations Locks */
            // These are set to prevent animations from running simutaniously
            function unlockOverlay() {
                locked = false;
            }
            function lockOverlay() {
                locked = true;
            }
        });
    }
})(jQuery);
        
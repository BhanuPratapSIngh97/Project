$(document).ready(function(){
    
    $('.signup-form').waypoint(function(direction){
            if(direction == "down"){
                $('nav').addClass('sticky');
            }else{
                $('nav').removeClass('sticky');
            }
        },{
            offset: '60px;'
        });
     
    /*
    
    var waypoints = $('#handler-first').waypoint(function(direction) {
  notify(this.element.id + ' hit 25% from top of window') 
}, {
  offset: '25%'
})
*/
    $('a[href*="#"]')
  // Remove links that don't actually link to anything
  .not('[href="#"]')
  .not('[href="#0"]')
  .click(function(event) {
    // On-page links
    if (
      location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') 
      && 
      location.hostname == this.hostname
    ) {
      // Figure out element to scroll to
      var target = $(this.hash);
      target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
      // Does a scroll target exist?
      if (target.length) {
        // Only prevent default if animation is actually gonna happen
        event.preventDefault();
        $('html, body').animate({
          scrollTop: target.offset().top
        }, 1000, function() {
          // Callback after animation
          // Must change focus!
          var $target = $(target);
          $target.focus();
          if ($target.is(":focus")) { // Checking if the target was focused
            return false;
          } else {
            $target.attr('tabindex','-1'); // Adding tabindex for elements not focusable
            $target.focus(); // Set focus again
          };
        });
      }
    }
  });
    
    document.getElementById('logg-in').addEventListener('click',function(){
       document.querySelector('.bg-model').style.display = 'flex'; 
    });
    document.querySelector('.close').addEventListener('click',function(){
        document.querySelector('.bg-model').style.display = 'none';
    });
    
    /*  animation*/
    $('.bg-model').waypoint(function(direction){
        $('.bg-model').addClass('fadeInRightBig');
    });
    
    
});
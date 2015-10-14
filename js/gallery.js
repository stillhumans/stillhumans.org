$(document).ready(function(e) {
    
	var ScrollHijack = function (context) {
		// public api object
		var api = {},
			$el          = $(context),
			$body        = $('body'),
			$window      = $(window),
			$slides      = $el.find('.slide'),
			currentIndex = 0,
			isTransitioning = false;
	
	
		function transitionEnd() {
		  var transEndEventNames = {
			'WebkitTransition' : 'webkitTransitionEnd',// Saf 6, Android Browser
			'MozTransition'    : 'transitionend',      // only for FF < 15
			'transition'       : 'transitionend'       // IE10, Opera, Chrome, FF 15+, Saf 7+
		  };
		  return transEndEventNames[ Modernizr.prefixed('transition') ];
		}

		function next() {
			if (currentIndex < $slides.length - 1) {
				isTransitioning = true;
				$slides.eq(currentIndex).one(transitionEnd(),   function () {
					isTransitioning = false;
				});
				$slides.eq(currentIndex).addClass('out');
				currentIndex++;
			}
		}

		function prev() {
			if (currentIndex > 0) {
				currentIndex--;
				isTransitioning = true;
				$slides.eq(currentIndex).one(transitionEnd(), function () {
					isTransitioning = false;
				})
				$slides.eq(currentIndex).removeClass('out');
			}
			else console.log('already on first slide');
		}
	
		function onMouseWheel(e) {
		  var e = e.originalEvent ? e.originalEvent : e;
		  
		  // normalize mouse wheel event
		  var delta = e.wheelDelta ? e.wheelDelta/40 : e.detail ? -e.detail/3 : 0;
	
		  if (isTransitioning) {
			return;
		  }
	
		  if (delta < 0) {
			next();
			return e.preventDefault() && false;
		  }
		  else if (delta > 0) {
			prev();
			return e.preventDefault() && false;
		  }
		}

		function onKeyUp(e) {
			if (e.keyCode === 40) 		next();
			else if (e.keyCode === 38) 	prev();
		}
 
		// Initializes the component/
		api.init = function () {
			console.log('init - found' ,$slides.length, 'slides');
			
			$window.on("DOMMouseScroll mousewheel", onMouseWheel);
			$window.on("keyup", onKeyUp);
			
			Hammer($el[0]).on("swipeleft", function () {
				setTimeout(next, 0);
			});
			Hammer($el[0]).on("swiperight", function () {
				setTimeout(prev, 0);
			});
		};
		return api;
	};

	new ScrollHijack( $('.js-component-scroll-hijack') ).init();
});


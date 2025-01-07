import $ from "jquery";


(function () {
  const navScroller = $(".nav-scroller");

  $(window).on("scroll", function () {
    if ($(window).scrollTop() > 100) {
      navScroller.addClass("scrolled");
    } else {
      navScroller.removeClass("scrolled");
    }
  });
})();

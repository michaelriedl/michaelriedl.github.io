// jQuery
jQuery(document).ready(function($){
    $('.inf-scr').infiniteScroll({
      // options
      path: '.pagination__next',
      checkLastPage: '.pagination__next',
      append: '.item',
      status: '.scroller-status',
      hideNav: '.pagination',
    });
});

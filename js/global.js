
window.setTimeout(function(){
    $(".loading").fadeOut(500)
    },400)
    
    $(document).ready(function(){
        $(window).load(function () {
              $(".mobile-inner-header-icon").click(function(){
                $(this).toggleClass("mobile-inner-header-icon-click mobile-inner-header-icon-out");
                $(".mobile-inner-nav").slideToggle(250);
              });
              $(".mobile-inner-nav li").each(function( index ) {
                $( this ).css({'animation-delay': (index/10)+'s'});
              });
              $(".mobile-inner-nav li").click(function(){
                $(this).find('dl').slideToggle(200)
              })
            });
    
    })
    
    $(document).ready(function(){
    
    $(".banner .center>*").each(function( index ) {
                $( this ).css({'animation-delay': (index/10)+'s'});
              });
    
    $(".section3 .list .imgbox").each(function( index ) {
                $( this ).css({'animation-delay': (index/10)+'s'});
              });
    
    
    
    
    $('.banner .center>*').addClass('wow fadeInDown')
    
    $('.section1 .item#item1 .left,.section1 .item#item2 .right').addClass('wow fadeInLeft')
    $('.section1 .item#item1 .right,.section1 .item#item2 .left').addClass('wow fadeInRight')
    
    $('.section2 .dec,.cbanner1 .title').addClass('wow zoomInDown')
    
    $('.section3 .title').addClass('wow zoomInUp')
    
    
    $('.section3 .list .imgbox,.cbanner1 .search form,.activitylist li,.aboutMain>*>*,.nftMain>*>*').addClass('wow fadeInUp')
    
    $('.slideMenu ul li .h2tit').click(function(){
      $(this).next('dl').stop()
      $(this).next('dl').slideToggle(200)
    })
    
    $('.wapNav .switch').click(function(){
      $(this).toggleClass('current')
      $('.slideMenu').toggleClass('current')
    })
    
    $('.section2 .more').addClass('wow pulse')
    
    var item1 = new Swiper('#item1 .swiper-container', {
              pagination: '#item1 .swiper-pagination',
              paginationClickable: '#item1 .swiper-pagination',
              nextButton: '#item1 .swiper-button-next',
              prevButton: '#item1 .swiper-button-prev',
              autoplay:5000,
              autoplayDisableOnInteraction: false,
              speed:500,
              slidesPerView: 1,
              spaceBetween: 0
            });
            var item2 = new Swiper('#item2 .swiper-container', {
              pagination: '#item2 .swiper-pagination',
              paginationClickable: '#item2 .swiper-pagination',
              nextButton: '#item2 .swiper-button-next',
              prevButton: '#item2 .swiper-button-prev',
              autoplay:5000,
              autoplayDisableOnInteraction: false,
              speed:500,
              slidesPerView: 1,
              spaceBetween: 0
            });
      
      var section3 = new Swiper('.section3 .swiper-container', {
              pagination: '.section3 .swiper-pagination',
              paginationClickable: '.section3 .swiper-pagination',
              nextButton: '.section3 .swiper-button-next',
              prevButton: '.section3 .swiper-button-prev',
              autoplay:5000,
              autoplayDisableOnInteraction: false,
              speed:500,
              slidesPerView: 4,
              spaceBetween: 75,
              breakpoints: {
                640: {
                  noSwiping : false,
                  slidesPerView: 1,
                  spaceBetween: 10,
                },
                768: {
                  noSwiping : false,
                  slidesPerView: 2,
                  spaceBetween: 20,
                },
                1024: {
                  noSwiping : false,
                  slidesPerView: 4,
                  spaceBetween: 30,
                },
              }
      });
      
    
    
    
    
    var f=37/1920*innerWidth
    
    var nftList = new Swiper('.nftList .swiper-container', {
            pagination: '.nftList .swiper-pagination',
            paginationClickable: '.nftList .swiper-pagination',
            nextButton: '.nftList .swiper-button-next',
            prevButton: '.nftList .swiper-button-prev',
            autoplay:false,
            autoplayDisableOnInteraction: false,
            speed:500,
            slidesPerView: 5.3,
            spaceBetween: f,
            breakpoints: {
              640: {
                noSwiping : false,
                slidesPerView: 3.5,
                spaceBetween: f,
              },
              768: {
                noSwiping : false,
                slidesPerView: 3.5,
                spaceBetween: f,
              },
              1024: {
                noSwiping : false,
                slidesPerView: 4.2,
                spaceBetween: f,
              },
            }
    });
    
    $('.activitylist li').hover(function(){
      $(this).find('.dec').stop()
      $(this).find('.dec').slideToggle(200)
    })
    
    var wow = new WOW({
        boxClass: 'wow',
        animateClass: 'animated',
        offset: 0,
        mobile: true,
        live: true
    });
    wow.init();
    
    
    
    
    function height(){
      var sc = $(window).scrollTop();
      if (sc > 200) {
          $("body").addClass("current");
        } else {
          $("body").removeClass("current");
        }
    }
    height()
    $(window).scroll(function () {
      height()
    });
    
    
    
    $('.mapAlert .close,.mapMain .item').click(function(){
      $('.mapAlert').stop()
      $('.mapAlert').fadeToggle(200)
    })
    
    
    });
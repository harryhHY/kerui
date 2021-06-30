$(function(){
    // 搜索
    $(".Header-searclick").click(function () {
        if ($(window).width() < 1000) {
            $(".Header-navbarbox").css("display", "none");
            $(".Header-navclick").removeClass("ontrue");
        };
        if ($(".Header-searwords").is(":hidden")) {
            $(this).addClass("ontrue");
            $(".Header-searwords").slideDown(300);
        } else {
            $(this).removeClass("ontrue");
            $(".Header-searwords").slideUp(100);
        }
    });

     // 二级导航控制
     sunNavEvent();
     function sunNavEvent() {
         if ($(window).width() > 1000) {
             // 二级导航
             $('.Header-navbar').show();
             $('.Header-navbar ul li').hover(function () {
                 $(this).find('.Header-sunNav').slideDown(300);
             }, function () {
                 $(this).find('.Header-sunNav').stop(true,false).slideUp(200);
             });
 
             $('.Header-wrapper').hover(function () {
                 $(this).addClass("Header-wrapperOn");
                 $(".Header-logo").addClass("onhover");
             }, function () {
                 $(this).removeClass("Header-wrapperOn");
                 $(".Header-logo").removeClass("onhover");
             });
         } else {
             $(".Header-sunNavClick").click(function(){
                 var sunNavMObileWords=$(this).next(".Header-sunNav");
                 $(".Header-sunNav").slideUp(200);
                 $(".Header-sunNavClick").removeClass('ontrue');
                 if ($(sunNavMObileWords).is(':hidden')) {
                     $(this).addClass('ontrue');
                     $(sunNavMObileWords).slideDown(300);
                 } else {
                     $(this).removeClass('ontrue');
                     $(sunNavMObileWords).slideUp(200);
                 }
             });
         }
     }
     // 手机端控制导航
     $('.Header-navclick').click(function () {
         if ($(window).width() < 1000) {
            $(".Header-searwords").slideUp(100);
            $(".Header-searclick").removeClass('ontrue');
            }
         if ($('.Header-navbarbox').is(':hidden')) {
             $(this).addClass('ontrue');
             $('.Header-navbarbox').slideDown(500);
         } else {
             $(this).removeClass('ontrue');
             $('.Header-navbarbox').slideUp(300);
         }
     });

     // 手机端底部控制
    $('.Footer-navarr').bind("click", function () {
        var FnavbarWords = $(this).parents(".Footer-navclick").next('.Footer-navwords');
        $('.Footer-navwords').slideUp(300);
        $('.Footer-navarr').removeClass('ontrue');
        if ($(FnavbarWords).is(':hidden')) {
            $(this).addClass('ontrue');
            $(FnavbarWords).slideDown(300);
        } else {
            $(this).removeClass('ontrue');
            $(FnavbarWords).slideUp(300);
        }
    });

    // 锚点切换
    $('a[href*=#],area[href*=#]').click(function(){
        if(location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname){
            var $target = $(this.hash);
            $target = $target.length && $target || $('[name=' + this.hash.slice(1) + ']');
            if($target.length){
                var targetOffset = $target.offset().top - $(".Header-wrapper").height();
                $('html,body').animate({scrollTop: targetOffset},1000);
                return false;
            }
        }
    });

    // 平板hover失效
    document.body.addEventListener('touchstart',function(){});

    // 禁止图片、a标签可以拖动
    $("body").find("img,a").attr("ondragstart","return false");
   
    //浏览器窗口事件
    $(window).resize(function () {});

    // 页面滚动轴事件
    // 滚动添加样式
    $(window).scroll(function () {
        if ($(window).scrollTop() > 180) {
            $(".Header-wrapper").addClass("Header-wrapperScr");
        }else{
            $(".Header-wrapper").removeClass("Header-wrapperScr");
        }
    });


});

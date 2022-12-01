//menu
var tombolMenu =  $(".tombol-menu");
var menu = $("nav .menu ul");

function klikMenu(){
    tombolMenu.click(function(){
        menu.toggle();
    });
    menu.click(function(){
        menu.toggle();
    });
}

//frame box jquery untuk nav menu
$ (document).ready(function () {
    var width = $(window).width();
    if (width < 990) {
        klikMenu();
    }
})

//pengecekan lebar
$(window).resize(function(){
    var width = $(window).width();
    if(width > 989){
        menu.css("display","block");
        //display:block
    }else{
        menu.css("display","none");
    }
    klikMenu();
})

//efek scroll
$ (document).ready(function () {
    var scroll_pos = 0;
    $(document).scroll(function (){
        scroll_pos = $(this).scrollTop();
        if(scroll_pos > 0){
            $("nav").addClass("putih");
            $("nav img.hitam").show();
            $("nav img.putih").hide();
        }else{
            $("nav").removeClass("hitam");
            $("nav img.putih").hide();
            $("nav img.hitam").show();
        }

    }) 
});

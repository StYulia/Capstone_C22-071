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

//Java Window Location Assign
var coll = document.getElementsByClassName("collapsible");
var i;

for (i = 0; i < coll.length; i++) {
  coll[i].addEventListener("click", function() {
    this.classList.toggle("active");
    var content = this.nextElementSibling;
    if (content.style.display === "block") {
      content.style.display = "none";
    } else {
      content.style.display = "block";
    }
  });
}

//button detect
function newDoc1() {
    window.location.assign("https://www.european-bioplastics.org/the-benefits-of-separate-organic-waste-collection/")
  }

function newDoc2() {
    window.location.assign("https://kebunraya.id/bogor")
  }

function newDoc3() {
    window.location.assign("https://www.devoyagebogor.com")
  }

function newDoc4() {
    window.location.assign("https://en.wikipedia.org/wiki/Puncak")
  }

  function newDoc5() {
    window.location.assign("https://bogor.tamansafari.com/")
  }

  function newDoc6() {
    window.location.assign("https://bogorkab.go.id/post/detail/jungleland")
  }
//jQuery effect toggle() team
$(document).ready(function(){
  $("h3").click(function(){
    $("span, p, h6").toggle();
  });
});


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
            $("nav").removeClass("putih");
            $("nav img.hitam").hide();
            $("nav img.putih").show();
        }

    }) 
});

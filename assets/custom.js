function homePageFullWidth(){
    $('.home').closest('.wrapper').css({"width": "100%", "padding": "0px"});
    $('.home').closest('.page-content').css({"padding-top": "0px"});
}

$( document ).ready(function() {
    homePageFullWidth();
});
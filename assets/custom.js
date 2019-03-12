function homePageFullWidth(){
    $('.home').closest('.wrapper').css({"width": "100%", "padding": "0px"});
    $('.home').closest('.page-content').css({"padding-top": "0px"});
}

$( document ).ready(function() {
    homePageFullWidth();
});

function changeLanguage(url){
  let languageVal = $('#languageType')[0].value ;
  console.log(url,languageVal)
  switch (languageVal) {
    case 'en':
      window.location.href = 'https://nemtech.github.io/nem2-workshop-document-notarization/'+ url
      break;
    case 'ch':
      window.location.href = 'https://nemtechchina.github.io/nem2-workshop-document-notarization/'+url
      break;
    default:
      window.location.href = 'https://nemtech.github.io/nem2-workshop-document-notarization/'+ url
  }
}

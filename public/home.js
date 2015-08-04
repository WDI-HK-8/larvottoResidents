$(document).ready(function(){

  var APIaction = function(){

  };

  APIaction.prototype.logOut = function(){
    $.ajax({
      type: 'DELETE',
      url: '/sessions',
      success: function(response){
        console.log(response)
        window.location.href = '/';
      }
    })
  }











  var apiAction = new APIaction ();

  //user log out and redirect to homepage
  $('.logOut').on('click', function(){
    apiAction.logOut();

  });



  //toggle popovers
  $('.more-info').on('click', function(){
    $(this).popover('toggle')
  })

  


})

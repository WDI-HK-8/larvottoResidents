$(document).ready(function(){

  var APIaction = function(){

  };

  APIaction.prototype.logOut = function(){
    $.ajax({
      type: 'DELETE',
      url: '/sessions',
      success: function(response){
        alert("Logout successful. See you soon!")
        window.location.href = '/';
      }
    })
  };

  APIaction.prototype.changeDetail = function(){
    $.ajax({
      type: 'PUT',
      url: '/users',
      data:{
        user: {
          firstname: firstName,
          lastname: lastName,
          email: email,
          username: userName,
          password: password,
          dateCreated: new Date()
        }
      },
      dataType: 'json',
      success: function(response){
        alert("Update successful!")
        window.location.href = '/home';
      },
      error: function(xhr, status, data){
        console.log(xhr);
      }
    })
  };

  APIaction.prototype.nameDisplay = function(){
  $.ajax({
    type: 'GET',
    url: '/users',
    dataType: 'json',
    success: function(response){
      html  =  '<h4>Welcome Back!<h4>'
      html +=  '<h4>'+response.firstname.toUpperCase()+" "+response.lastname.toUpperCase()+'</h4>'
      $('#name_display').replaceWith(html);
    }
  });
}


  var apiAction = new APIaction ();
  
  apiAction.nameDisplay();


  //user log out and redirect to homepage
  $('.logOut').on('click', function(){
    apiAction.logOut();

  });

  // update button with slide over
  $('#update').on('click', function(){
    $('.update_wrapping').animate({width: "100%"}, {duration: 'slow'}).toggle();
  })

  $('.infoUpdate').on('click', function(){
    
    firstName = $('#firstName').val();
    lastName  = $('#lastName').val();
    email     = $('#email').val();
    userName  = $('#userName').val();
    password  = $('#password').val();

    if((firstName !== "") && (lastName !== "") && (userName !== "") && (email !== "") && (password !== "")) {
    apiAction.changeDetail(firstName,lastName,email,userName,password);
  } else {
    alert('At least one of the input fields is empty!');
    }
   
    $('#firstName').val("");
    $('#lastName').val("");
    $('#email').val("");
    $('#userName').val("");
    $('#password').val("");

  });


  //toggle popovers
  $('.more-info').on('click', function(){
    $(this).popover('toggle')
  })

  


})

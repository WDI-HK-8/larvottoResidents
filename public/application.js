$(document).ready(function(){

  var APIaction = function(){

  };


  APIaction.prototype.createUser = function(){
    $.ajax({
      type: 'POST',
      url: '/users',
      data:{
        user:{
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
        if(response.userExist){
          alert("Account already exist. Forgot Passord?")
        } else {alert("Congratulations! Account created.")
          }
      },
      error: function(xhr, status, data){
        console.log(xhr);
      }
    })
  };


  var apiAction = new APIaction();

  //toggle control
   $('.dropdown-toggle').click(function() {
    $('.dropdown-menu').slideToggle();
  });


  //createUser

  $('#notAMember').on('click', function(){
    $('.nonMember_wrapping').slideToggle();
  });

  $('.signUp').on('click', function(){
    firstName = $('#firstName').val();
    lastName  = $('#lastName').val();
    email     = $('#email').val();
    userName  = $('#userName').val();
    password  = $('#password').val();

  if((firstName !== "") && (lastName !== "") && (userName !== "") && (email !== "") && (password !== "")) {
    apiAction.createUser(firstName,lastName,email,userName,password);
  } else {
    alert('At least one of the input fields is empty!');
    }
  
  $('#firstName').val("");
  $('#lastName').val("");
  $('#email').val("");
  $('#userName').val("");
  $('#password').val("");

  });





});

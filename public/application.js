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
        } else {alert("Congratulations! Account created. Please login above.")
          }
      },
      error: function(xhr, status, data){
        console.log(xhr);
      }
    })
  };


  APIaction.prototype.userLogin = function(){
    $.ajax({
      type: 'POST',
      url: '/sessions',
      data:{
        user:{
          username: memberName,
          password: memberPassword
        }
      },
      dataType: 'json',
      success: function(response){
        if(response.userExist === false){
          alert("Record not found. Please sign up.")
        } else if (response.authorized === false){
          alert("Credentials not correct, please check again")
        } else {
          alert('Login successful!')
          window.location.href = '/home';
          }
      }
    })
  }



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

  //User login
  $('.submit').on('click', function(){
    memberName = $('.memberuserName').val();
    memberPassword = $('.memberpassword').val();
    apiAction.userLogin();

    $('.memberuserName').val("");
    $('.memberpassword').val("");
    $('.nonMember_wrapping').slideToggle();


  })




});

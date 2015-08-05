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
        html +=  '<h4>'+response.username.toUpperCase()+'</h4>'
        $('#name_display').replaceWith(html);
      }
    })
  };

  
  APIaction.prototype.creatWorkOut = function(){
    $.ajax({
      type: 'POST',
      url: '/workouts',
      data:{
        workout:{
          title: title,
          type: type,
          startTime: startTime,
          date: date,
          duration: duration,
          meetingLocation: meetingLocation,
          comments: comments,
        }
      },
      dataType: 'json',
      success: function(response){
        alert("Thank you for the post!")
      },
      error: function(xhr, status, data){
        console.log(xhr);
      }
    })
  }

  var picChoice = function(type){
    if(type == 'SWIM'){
      return '/public/assets/swim.jpeg'
    } else if (type == 'BIKE'){
      return '/public/assets/bike.jpg'
    } else if (type == 'RUN'){
      return '/public/assets/run.jpeg'
    } else if (type == 'TEAM'){
      return '/public/assets/team.jpeg'
    } else if (type == 'GROUP'){
      return '/public/assets/bootcamp.jpeg'
    } else if (type == 'OTHER') {
      return '/public/assets/others.jpg'
    }
    
  }


  APIaction.prototype.getPostSuccess = function(response){
    var constructHTML = function(response){
      var html = '';

      for (i = 0; i < response.length; i++){
      html +=  '<div class="col-md-4">'
      html +=    '<div class="thumbnail img-responsive">'
      html +=      '<img src=' + picChoice(response[i].message.type)+'>'
      html +=        '<div class="caption">'
      html +=          '<h3>'+response[i].message.title+'</h3>'
      html +=          '<p>Type:  '+response[i].message.type+'</p>'
      html +=          '<p>Date:  '+new Date(response[i].message.date).toISOString().slice(0, 10)+'</p>'
      html +=          '<p>Time:  '+response[i].message.startTime+'</p>'
      html +=          '<p>Duration:  '+response[i].message.duration+'</p>'
      html +=          '<p>Meet Point:  '+response[i].message.meetingLocation+'</p>'
      html +=          '<p>Posted by:   '+response[i].username+'</p>'
      html +=          '<p><button class="btn btn-success" role="button">Join</button>'
      html +=          '<button class="btn btn-danger" role="button">Unjoin</button>'
      html +=          '<button type="button" class="btn btn-primary more-info" data-container="body" data-toggle="popover" ' 
      html +=          'data-placement="bottom" data-content=' + response[i].message.comments + '>MORE</button></p>'   
      html +=         '</div>'
      html +=     '</div>'
      html +=  '</div>'
      }
      return html;
     
    };

    html = constructHTML(response);
    $('.workOutPosts').html(html);
    //popover
    $('.more-info').on('click', function(){
    console.log('popover')
    $(this).popover('toggle')
  })  

  }

  APIaction.prototype.getAllPost = function(){
    $.ajax({
      type: 'GET',
      url: '/workouts',
      dataType: 'json',
      success: this.getPostSuccess
      

    })
  }

  APIaction.prototype.searchPost = function (){
    $.ajax({
      type: 'GET',
      url: '/workouts?type='+type+'&date='+date+'&starttime='+starttime,
      dataType: 'json',
      success: this.getPostSuccess 
    })
  }

  APIaction.prototype.searchPostByUser = function(){
    $.ajax({
      type: 'GET',
      url: '/users/'+username+'/workouts',
      dataType: 'json',
      success: this.getPostSuccess,
      error:  function(xhr, status, data){
        console.log(xhr);
      }
    })
  }

  APIaction.prototype.pageRefresh = function(){
    return setInterval(this.getAllPost(),5000)
  }

  var apiAction = new APIaction ();
  
  //name display
  apiAction.nameDisplay();
  
  //autoRefresh
  apiAction.pageRefresh();

  //refresh all post (manually)
  $('#refresh').on('click', function(){
  apiAction.getAllPost()
  })

  //search Post
  $('#searchBtn').on('click', function(){
    type      = $('#request-selector-type-search').val(); 
    date      = $('#searchByDate').val();
    starttime = $('#searchByTime').val();

    apiAction.searchPost()
  })

  //search Post by user
  $('#showMyPost').on('click', function(){
    username = ''
    apiAction.searchPostByUser()
  })

  //create workout post
  $('#confirmPost').on('click',function(){
    title           = $('#inputTitle').val();
    type            = $('#request-selector-type').val();
    startTime       = $('#inputTime').val();
    date            = $('#inputDate').val();
    duration        = $('#inputDuration').val() +""+ $('#request-selector-hr').val();
    meetingLocation = $('#inputMeet').val();
    comments        = $('#inputComment').val()||undefined;

    if((startTime !== "") && (date !== "") && (duration !== "") && (meetingLocation !== "")) {
    apiAction.creatWorkOut(type,startTime,date,duration,meetingLocation,comments);
    apiAction.getAllPost();

  } else {
    alert('At least one of the input fields is empty!');
    }
  })

  //refresh after submit post
  $('#modalExit').on('click', function(){
    apiAction.getAllPost()
  })

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

  

  


})

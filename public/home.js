$(document).ready(function(){

  var APIaction = function(){
    signInUser = this.username;
    
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
      context: this,
      type: 'GET',
      url: '/users',
      dataType: 'json',
      success: function(response){
        html  =  '<h4>Welcome Back!<h4>'
        html +=  '<h4>'+response.username.toUpperCase()+'</h4>'
        $('#name_display').replaceWith(html);
        this.username = response.username;
        

      }
    })
  };

  
  APIaction.prototype.creatWorkOut = function(){
    $.ajax({
      context: this,
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
          joiners: [],
        }
      },
      dataType: 'json',
      success: function(response){
        alert("Thank you for the post!")
        this.getAllPost();
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
      html +=          '<p><button class="btn btn-success join-btn" id="joinWorkOut" role="button" data-tag='+response[i]._id+'>Join</button>'
      html +=          '<button class="btn btn-danger unjoin-btn" id="unjoinWorkOut" role="button" data-tag='+response[i]._id+'>Leave</button>'
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

  APIaction.prototype.getSelfPostSuccess = function(response){  
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
    html +=          '<p><button class="btn btn-success amendBTN" role="button" data-toggle="modal" data-target="#myModalUpdate" data-tag='+response[i]._id+'>AMEND</button>'
    html +=          '<button class="btn btn-danger deleteBTN" role="button" data-tag='+response[i]._id+'>DELETE</button>' 
    html +=         '</div>'
    html +=     '</div>'
    html +=  '</div>'
    }
    return html;
   
  };

    html = constructHTML(response);
    $('.workOutPosts').html(html);
    
  }

  APIaction.prototype.getAllPost = function(){
    $.ajax({
      type: 'GET',
      url: '/workouts',
      dataType: 'json',
      success: this.getPostSuccess
    })
  }

  APIaction.prototype.checkUserIsJoiner = function(){
    if (this.joinWorkOut(response))
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
      success: this.getSelfPostSuccess,
      error:  function(xhr, status, data){
        console.log(xhr);
      }
    })
  }

  APIaction.prototype.deletePost = function(){
    $.ajax({
      context: this,
      type: 'DELETE',
      url: '/users/'+username+'/workouts/'+ workout_id,
      success: function(response){
        alert("Successfully deleted");
        this.getAllPost();  
      },
      error: function (xhr, status, data){
        console.log (xhr)
      } 
    })
  }

  APIaction.prototype.amendWorkOut = function (){
    $.ajax({
      context: this,
      type: 'PUT',
      url: '/users/'+username+'/workouts/'+ workout_id,
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
        alert("Successfully amended!")
        this.getAllPost();
      },
      error: function(xhr, status, data){
        console.log(xhr);
      }
    })
  }

  APIaction.prototype.joinWorkOut = function(){
    $.ajax({
      type: 'GET',
      url: '/workouts/'+ workout_id +'/joiners',
      dataType: 'json',
      success: function(response){
        if (response[0].joinerExist){
        alert("Cannot join twice");
        } else {
        alert("Joined successful") ;         
        }
      },
      error: function(xhr, status, data){
        console.log(xhr);
      }
    })
  }

  APIaction.prototype.unjoinWorkOut = function(){
    $.ajax({
      type: 'DELETE',
      url: '/workouts/'+ workout_id +'/joiners',
      success: function(response){
        alert("Maybe nexttime")
      },
      error: function (xhr, status, data){
        console.log (xhr)
      } 
    })
  }

  APIaction.prototype.showJoined = function(){
    $.ajax({
      type: 'GET',
      url: '/workouts/'+ username,
      dataType: 'json',
      success: this.getPostSuccess
    });
    
  }


  APIaction.prototype.pageRefresh = function(){
    return setInterval(this.getAllPost(),5000)
  }

// /////////////////////////////////////////////////////

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

    $('#request-selector-type-search').val(""); 
    $('#searchByDate').val("");
    $('#searchByTime').val("");
  })

  //search Post by user
  $(document).on('click', '#workOutCreated', function(){
    console.log('workOutCreated')
    username = signInUser
    apiAction.searchPostByUser(username)

    
  })

  // amend workout post
  
  $('#myModalUpdate').on('show.bs.modal', function (event) {
    var button = $(event.relatedTarget) 
    var recipient = button.data('tag') 
    console.log(button, recipient)

      $(document).on('click','#confirmUpdate',function(){
        title = $('#editTitle').val();
        type = $('#request-selector-editType').val();
        startTime = $('#editTime').val();
        date = $('#editDate').val();
        duration = $('#editDuration').val();
        meetingLocation = $('#editMeet').val();
        comments = $('#editComment').val();
        
        username = signInUser;
        workout_id = recipient;

        if((title !== "")&&(startTime !== "") && (date !== "") && (duration !== "") && (meetingLocation !== "")){
          apiAction.amendWorkOut();
        } else {
          alert('At least one of the input fields is empty! Amendment not done');
        }

      })

    })


  // delete workout post
  $(document).on('click', '.deleteBTN', function(){
    console.log('delete post')
    workout_id = $(this).attr('data-tag')
    apiAction.deletePost(workout_id);
    apiAction.getAllPost();
  
  })
  
  // join workout
  $(document).on('click', '#joinWorkOut', function(){
    console.log('join workout')
    workout_id = $(this).attr('data-tag')
    apiAction.joinWorkOut(workout_id);
    
  })

  // unjoin workout
  $(document).on('click', '#unjoinWorkOut', function(){
    console.log('unjoin workout')
    workout_id = $(this).attr('data-tag')
    apiAction.unjoinWorkOut(workout_id);
    
  })

  // show workouts that i joined
  $('#showMyPost').on('click', function(){
    username = signInUser
    apiAction.showJoined(username)

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

  // update user info
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

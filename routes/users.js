var Bcrypt = require('bcrypt');
var Joi = require('joi');
var Auth = require('./auth')

exports.register = function (server, options, next){

  server.route([
      {
        method: 'POST',
        path: '/users',
        config: {
          handler: function(request, reply){
            var db = request.server.plugins['hapi-mongodb'].db;
            
            var user = request.payload.user;

            var uniqUserQuery = {
              $or: [
                {username: user.username},
                {email: user.email}
              ]
            };

            db.collection('users').count(uniqUserQuery, function(err, userExist) {
              
              if(userExist){
                return reply ({userExist: true});
              }

              Bcrypt.genSalt(10, function(err, salt){
                Bcrypt.hash(user.password, salt, function(err, encrypted){
                  user.password = encrypted;

                  db.collection('users').insert(user, function(err, writeResult){
                    if (err){
                      return reply ("Internal MongoDB error")
                    }
                    reply (writeResult)
                  })
                })
              });
            })
          },
          validate:{
            payload:{
              user:{
                firstname: Joi.string().min(1).max(100).required(),
                lastname: Joi.string().min(1).max(100).required(),
                email: Joi.string().email().max(100).required(),
                username: Joi.string().min(1).max(100).required(),
                password: Joi.string().min(1).max(100).required(),
                dateCreated: Joi.date().required()  
              }
            }
          }
        }    
      },
      {
        method: 'PUT',
        path: '/users',
        config: {
          handler: function(request, reply){

            Auth.authenticated(request, function(session){
              if(!session.authenticated){
                return reply (session)
              }

            var db = request.server.plugins['hapi-mongodb'].db;
            var ObjectID = request.server.plugins['hapi-mongodb'].ObjectID;
            var user = request.payload.user;
            
            var cookie  = request.session.get('larvotto_link');
            var user_id = cookie.user_id;


            db.collection('users').update({_id: ObjectID(user_id)}, {$set: user}, function(err, writeResult){
              if(err) {return reply('Internal MongoDB error')}

              reply (writeResult)
            })
            })
          }
          ,
          validate:{
            payload:{
              user:{
                firstname: Joi.string().min(1).max(100),
                lastname: Joi.string().min(1).max(100),
                email: Joi.string().email().max(100),
                username: Joi.string().min(1).max(100),
                password: Joi.string().min(1).max(100),
                dateCreated: Joi.date().required()  
              }
            }
          }
        }
      }
      ,
      {
        method: 'GET',
        path: '/users',
        handler: function(request, reply){
          var db = request.server.plugins['hapi-mongodb'].db;
          var ObjectID = request.server.plugins['hapi-mongodb'].ObjectID;
          var cookie  = request.session.get('larvotto_link');
          var user_id = cookie.user_id;

          db.collection('users').findOne({_id: ObjectID(user_id)}, function(err, user){
            if(err) {return reply('Internal MongoDB error')}

            reply ({firstname: user.firstname, lastname: user.lastname})
          })

        }
      }




    ])

  next();
};

exports.register.attributes = {
  name: 'users-routes',
  version: '0.0.1'
};
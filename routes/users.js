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


      }


    ])

  next();
};

exports.register.attributes = {
  name: 'users-routes',
  version: '0.0.1'
};
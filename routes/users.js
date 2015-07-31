var Bcrypt = require('bcrypt');
var Joi = require('joi');
var Auth = require('./auth')

exports.register = function (server, options, next){

  server.route([
      {
       method: 'POST',
       path: '/users',
       handler: function(request, reply){
        
       } 
      }


    ])

  next();
};

exports.register.attributes = {
  name: 'users-routes',
  version: '0.0.1'
};
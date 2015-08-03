var Auth = require('./auth');
var Joi = require('joi');


exports.register = function(server, options, next){
  server.route([
    {
      method: 'POST',
      path: '/workouts',
      config: {
        handler: function(request, reply){
          
          Auth.authenticated(request, function(session){
            if(!session.authenticated){
              reply (session)
            }

            var db       = request.server.plugins['hapi-mongodb'].db;
            var ObjectID = request.server.plugins['hapi-mongodb'].ObjectID;

            var workout = {
              'message': request.payload.workout,
              'user_id': ObjectID(session.user_id)
            }
            
            db.collection('workouts').insert(workout,function(err,writeResult){
              if(err) {return reply('Internal MongoDB error')}

              reply (writeResult)
            })
          })
        },
        validate: {
          payload: {
            workout: {
                type: Joi.string().min(3).required(),
                startTime: Joi.string().min(3).required(),
                date: Joi.date().min('now').required(),
                duration: Joi.string().min(4).required(),
                meetingLocation: Joi.string().max(30).required(),
                comments: Joi.string().max(30).required(),
            }
          }
        }
      }
    }
    ])
  next();
}

exports.register.attributes = {
  name: 'workouts-routes',
  version: '0.0.1'
};

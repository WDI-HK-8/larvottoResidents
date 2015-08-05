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
              'message':request.payload.workout,
              'username':session.username,
              'user_id':ObjectID(session.user_id),
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
                title: Joi.string().min(3).required(), 
                type: Joi.string().min(3).required(),
                startTime: Joi.string().min(3).required(),
                date: Joi.date().min('now').required(),
                duration: Joi.string().min(4).required(),
                meetingLocation: Joi.string().max(30).required(),
                comments: Joi.string().max(40).optional(),
            }
          }
        }
      }
    },
    {
      method: 'GET',
      path: '/workouts',
      handler: function(request, reply){
        var db        = request.server.plugins['hapi-mongodb'].db;
        var type      = request.query.type;
        var date      = new Date(request.query.date);
        var starttime = request.query.starttime;

        if (type !=  null || request.query.date !=  null || starttime !=  null){
          db.collection('workouts').find({$or: [{'message.type': type},{'message.date': date},{'message.startTime': starttime}]}).toArray(function(err, workout){
            if(err) {return reply('Internal MongoDB error')}

              reply(workout)
          })          
        } else {
          db.collection('workouts').find().toArray(function(err, workout){
            if(err) {return reply('Internal MongoDB error')}

              reply(workout);
          });
        }
      }
    },
    

    ])
  next();
}

exports.register.attributes = {
  name: 'workouts-routes',
  version: '0.0.1'
};

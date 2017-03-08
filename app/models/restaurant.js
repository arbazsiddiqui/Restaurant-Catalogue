var mongoose = require('mongoose');
// var mongoosastic = require('mongoosastic');

var restaurantSchema = mongoose.Schema({
  address: mongoose.Schema.Types.Mixed,
  borough: String,
  cuisine: String,
  grades: [{
    date : Date,
    grade : String,
    score : Number
  }],
  name: String,
  restaurant_id: String
});

// restaurantSchema.plugin(mongoosastic);

var Restaurant = mongoose.model('Restaurant', restaurantSchema);

exports.getAll = function (callback) {
  Restaurant
    .find()
    .limit(20)
    .exec(function (error, restaurants) {
      if (error) {
        console.error(error);
        return callback(null);
      }
      return callback(restaurants);
    })
};
// var stream = Restaurant.synchronize();
// var count = 0
// stream.on('data', function(err, doc){
//   count++;
// });
// stream.on('close', function(){
//   console.log('indexed ' + count + ' documents!');
// });
// stream.on('error', function(err){
//   console.log(err);
// });

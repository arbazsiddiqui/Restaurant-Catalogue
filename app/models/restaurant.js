var mongoose = require('mongoose');
// var mongoosastic = require('mongoosastic');

var restaurantSchema = mongoose.Schema({
  address: mongoose.Schema.Types.Mixed,
  borough: String,
  cuisine: String,
  grades: [],
  name: String,
  restaurant_id: String
});

// restaurantSchema.plugin(mongoosastic);

var Restaurant = mongoose.model('Restaurant', restaurantSchema);

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

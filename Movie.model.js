var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//creating Movie Schema

var MovieSchema=new mongoose.Schema({
  MovieName:String,
  Genre:String,
  Language:String
});

//Creating model for Movie

module.exports=mongoose.model('MovieInfo',MovieSchema,'Movies');

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var MovieInfo=require('./Movie.model');
var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

//Establishing connection
var mongoose=require('mongoose');
mongoose.connect('mongodb://127.0.0.1/MovieData');

//verifying connection
var db=mongoose.connection;
db.on('error',console.error.bind(console,'connection error:'));
db.once('open',function(){
  console.log('connection successful.....congrats!!!');
});

/*var MovieSchema=new mongoose.Schema({
  MovieName:String,
  Genre:String,
  Language:String
});*/



//Creating model for Movie

//var MovieInfo=mongoose.model('MovieInfo',MovieSchema,'Movies');


app.get('/MovieList',function(req,res){
 	 //console.log("All my Movies");
  	MovieInfo.find({},function(err,data){
     console.log(data);

      res.send(JSON.stringify(data));
      //console.log(err);
  res.end();
});
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('html',require('ejs').renderFile);
app.set('view engine', 'html');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);
app.use('/create', routes);
app.use('/MovieList/:id', routes);
// Defining an API for Saving the data

app.post('/create',function(req, res)
{

  var newMovie = new MovieInfo();
       newMovie.MovieName= req.body.txtName;
         newMovie.Genre= req.body.txtGenre;
         newMovie.Language= req.body.txtLanguage;

     newMovie.save(function(err,MovieList) {
           if (err){
             //console.log(err);
              throw err;
           }
           else{
              console.log('Movie Saved successfully...');
              res.send(MovieList);
              res.end();
           }
          });
  });


  //Updating using PUT method

  app.put('/MovieList/:id',function(req,res)
{
  MovieInfo.findOneAndUpdate(
    {
    _id:req.params.id
  },
{$set:{MovieName: req.body.MovieName}},
{upsert:true},
function(err,newMovie)
{
  if(err)
  {
    console.log('error occured');
  }
  else
    {
      console.log(newMovie);
      res.send(newMovie);
    }
});
});

app.delete('/MovieList/:id', function(req,res){
  MovieInfo.findOneAndRemove({
    _id:req.params.id
  }, function(err,newMovie){
    if(err){
      res.send('Error while deleting');
    }
    else{
      console.log(newMovie);
      res.send('done');
    }
  })
})


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;

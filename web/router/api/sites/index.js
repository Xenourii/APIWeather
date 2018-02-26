var router = require('express').Router();
var OpenWeatherMapHelper = require('../../../../helpers/openweathermap.js')();

var db = require('../../../../config/index.js');

var WeatherSite = require('../../../../models/WeatherSite.js');

router.get("/:SiteId", function(req, res){

  WeatherSite.findOne({site_id: req.params.SiteId, isActivated: true}, function(err, weatherSite){
    if (weatherSite){
      var updatedTime = weatherSite.updated_at.getTime();
      var nowTime = Date.now().getTime();
      var IsUpdateNeeded = (nowTime - updatedTime > 21600); // 21600 seconds = 6 hours
      if( IsUpdateNeeded ){
        OpenWeatherMapHelper.getCurrentWeatherByCityID(req.params.SiteId, function(err, currentWeather){
          if(err)
            res.status(500).json(err);

          weatherSite.openweathermap = currentWeather;

          weatherSite.save((err) => {
            if(err)
              res.status(500).json(err);
            res.status(200).json(weatherSite);
          });
        });
      }
      else {
        res.status(200).json(newWeatherSite);
      }
    }
    else{
      OpenWeatherMapHelper.getCurrentWeatherByCityID(req.params.SiteId, function(err, currentWeather){
        if(err)
          res.status(500).json(err);

        var newWeatherSite = new WeatherSite();
        newWeatherSite.site_id = req.params.SiteId;
        newWeatherSite.openweathermap = currentWeather;

        newWeatherSite.save((err) => {
          if(err)
            res.status(500).json(err);
          res.status(200).json(newWeatherSite);
        });
      });
    }
  });

});

router.post('/', function(req, res){
  var weatherSite = new WeatherSite();

  weatherSite.site_id = req.body.SiteId;
  weatherSite.openweathermap = req.body.Openweathermap;

  weatherSite.save((err)=> {
    if(err)
      res.status(500).json(err);

    res.status(200).json({message: 'added'});
  });
});

router.patch('/:SiteId', function(req, res){
  var weatherSite = new WeatherSite();

  weatherSite.site_id = req.body.SiteId || weatherSite.site_id;
  weatherSite.openweathermap = req.body.Openweathermap || weatherSite.openweathermap;

  weatherSite.save((err)=> {
    if(err)
      res.status(500).json(err);

    res.status(200).json({message: 'updated'});
  });
});

router.delete("/:SiteId", function(req, res){
  var site_id = req.params.SiteId;
  if (!site_id)
    res.status(400).json({message: "Invalid Id."});

    WeatherSite.findOne({site_id: req.params.SiteId, isActivated: true}, function(err, weatherSite){
      if(!weatherSite)
        res.status(401).json(err);

      WeatherSite.findAndUpdate({_id: weatherSite._id}, {isActivated: false}, function(err, res){
        if(err)
          res.status(500).json(message: 'weatherSite not found');

        res.status(200).json({message: 'deleted'});
      }),
    });
});

router.get("/paragliding/:SiteId", function(req, res){
  WeatherSite.findOne({site_id: req.params.SiteId}, function(err, weatherSite){
    if (err)
      res.status(500).json(err);

      var weatherId = weatherSite.openweathermap.weather[0].id;
      var windSpeed = weatherSite.openweathermap.wind.speed;
      var windDirectionDegree = weatherSite.openweathermap.wind.deg; //N = 0, E = 90, S = 180, W = 270

      var IsWeatherOK = (weatherId >= 800 && weatherId <= 804);
      var IsWindSpeedOK = (windSpeed * 3.6 < 35);
      var IsWindDirectionOK = true; //TODO read from the other database to get the degree !

      if(IsWeatherOK && IsWindSpeedOK && IsWindDirectionOK)
        res.status(200).json({'message': true});
      else
        res.status(200).json({'message': false});
  });
});

module.exports = router;

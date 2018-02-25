var router = require('express').Router();
var OpenWeatherMapHelper = require('../../../../helpers/openweathermap.js')();

var db = require('../../../../config/index.js');

var WeatherSite = require('../../../../models/WeatherSite.js');

router.get("/:Id", function(req, res){

  WeatherSite.findOne({site_id: req.params.Id}, function(err, weatherSite){
    if (weatherSite){
      var updatedTime = weatherSite.updated_at.getTime();
      var nowTime = Date.now().getTime();
      var IsUpdateNeeded = (nowTime - updatedTime > 21600); // 21600 seconds = 6 hours
      if( IsUpdateNeeded ){
        OpenWeatherMapHelper.getCurrentWeatherByCityID(req.params.Id, function(err, currentWeather){
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
      OpenWeatherMapHelper.getCurrentWeatherByCityID(req.params.Id, function(err, currentWeather){
        if(err)
          res.status(500).json(err);

        var newWeatherSite = new WeatherSite();
        newWeatherSite.site_id = req.params.Id;
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

router.get("/paragliding/:Id", function(req, res){
  WeatherSite.findOne({site_id: req.params.Id}, function(err, weatherSite){
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

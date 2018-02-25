var router = require('express').Router();
var OpenWeatherMapHelper = require('../../../../helpers/openweathermap.js')();

var db = require('../../../../config/index.js');

var WeatherSite = require('../../../../models/WeatherSite.js');

router.get("/:Id", function(req, res){

  WeatherSite.findOne({site_id: req.params.Id}, function(err, weatherSite){
    if (weatherSite){
      var updatedTime = weatherSite.updated_at.getTime();
      var nowTime = Date.now().getTime();
      var IsUpdateNeeded = (nowTime - updatedTime > 21600); //if  21600 seconds = 6 hours
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

router.get("/mysqltest", function(req, res){

});

module.exports = router;

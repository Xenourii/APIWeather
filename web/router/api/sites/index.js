var router = require('express').Router();
var OpenWeatherMapHelper = require('../../../../helpers/openweathermap.js')();

var db = require('../../../../config/index.js');

var WeatherSite = require('../../../../models/WeatherSite.js');

router.get("/:SiteId", function(req, res){

  //var get from mysql
  var coordLatitude = 5.6037;
  var coordLongitude = 0.1870;

  WeatherSite.findOne({site_id: req.params.SiteId, isActivated: true}, function(err, weatherSite){
    if (weatherSite){
      var updatedTime = weatherSite.updated_at.getTime();
      var nowTime = Date.now().getTime();
      var IsUpdateNeeded = (nowTime - updatedTime > 21600); // 21600 seconds = 6 hours
      if( IsUpdateNeeded ){
        OpenWeatherMapHelper.getCurrentWeatherByGeoCoordinates(coordLatitude, coordLongitude, function(err, currentWeather){
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
      OpenWeatherMapHelper.getCurrentWeatherByGeoCoordinates(coordLatitude, coordLongitude, function(err, currentWeather){
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
          res.status(500).json({message: 'weatherSite not found'});

        res.status(200).json({message: 'deleted'});
      });
    });
});

router.get("/paragliding/:SiteId", function(req, res){

  // var cardinalDirection get from mysql
  var cardinalDirection = ['N', 'NE', 'E'];

  WeatherSite.findOne({site_id: req.params.SiteId}, function(err, weatherSite){
    if (err)
      res.status(500).json(err);

      var weatherId = weatherSite.openweathermap.weather[0].id;
      var windSpeed = weatherSite.openweathermap.wind.speed;
      var windDirectionDegree = weatherSite.openweathermap.wind.deg; //N = 0, E = 90, S = 180, W = 270

      var IsWeatherOK = (weatherId >= 800 && weatherId <= 804);
      var IsWindSpeedOK = (windSpeed * 3.6 < 35);
      var IsWindDirectionOK = IsWindDirectionOK(cardinalDirection, windDirectionDegree)

      if(IsWeatherOK && IsWindSpeedOK && IsWindDirectionOK)
        res.status(200).json({'message': true});
      else
        res.status(200).json({'message': false});
  });
});

function IsWindDirectionOK(cardinalDirection, degree){
  var cardinalPoint = {
    "N":[348.75, 11.25],
    "NNE":[11.25, 33.75],
    "NE":[33.75, 56.25],
    "ENE":[56.25, 78.75],
    "E":[78.75, 101.25],
    "ESE":[101.25, 123.75],
    "SE":[123.75, 146.25],
    "SSE":[146.25, 168.75],
    "S":[168.75, 191.25],
    "SSW":[191.25, 213.75],
    "SW":[213.75, 236.25],
    "WSW":[236.25, 258.75],
    "W":[258.75, 281.25],
    "WNW":[281.25, 303.75],
    "NW":[303.75, 326.25],
    "NNW":[326.25, 348.75],
    "TOUTES":[0, 360]
  }

  cardinalDirection.forEach(function(elem){
    var acceptedDegree = cardinalPoint[elem];
    if ( degree >= acceptedDegree[0] && degree <= acceptedDegree[1])
      return true;
  });

  return false;
}

module.exports = router;

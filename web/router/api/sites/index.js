var router = require('express').Router();
var OpenWeatherMapHelper = require('../../../../helpers/openweathermap.js')();

router.get("/:Id", function(req, res){

  OpenWeatherMapHelper.getCurrentWeatherByCityID(req.params.Id, function(err, currentWeather){
    if(err)
      res.status(500).json(err);

    res.status(200).json(currentWeather);
  });
});

module.exports = router;

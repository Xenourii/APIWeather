var router = require('express').Router();
var db = require('../../../../config/index.js');
var mysqlconnection = require('../../../../config/index.js');

router.get('/', function(req, res){

  var sql = "SELECT * from sites";
  mysqlconnection.query(sql, function(err, sites){
    if(err)
      res.status(500).json(err);

    res.status(200).json(sites);
  });
});

module.exports = router;

# Weather APP

## MCD

See the `MCD.PNG` file in the root of the repository.

## Api

Create a `.env` file at the root of the project, and put inside `APPID=YourOpenWeatherMapID`  
  

* localhost:3000/api/sites/:SiteId (GET) -> get a specific weather of a site, by his SiteId.  

* localhost:3000/api/sites (POST) -> create a weather site.  
You have to provide the `SiteId`, and a json of the `Openweathermap`.  


* localhost:3000/api/sites/:SiteId (PATCH) -> edit a specific weather site by his SiteId.  
You can edit the `SiteId` (have to be unique), and the `Openweathermap` json.  


* localhost:3000/api/sites/:SiteId (DELETE) -> delete a specific weather site by his SiteId.  

------------------------------

* localhost:3000/api/sites/paragliding/:SiteId (GET) -> get `true` or `false`, depending if the site is paraglidable or not.

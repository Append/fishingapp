import Ember from 'ember';

export default Ember.Component.extend({
	isP: false,
	showMap: false,
	lng: 0,
	lat: 0,
	alt: 0,

	on: true,
	startLogging: function(){
		//begin logging geolocation data once the component launches

		var component = this;
		this.computeGPS(component);

	}.on('init'),

	computeGPS: function(component){
		Ember.run.later(function(){
		//wrapper to preserve binding satistfaction
		try {
			//invoke cordova geolocation Plugin and get geolocation data
			navigator.geolocation.getCurrentPosition(function (position) {//success callback
			//console.log('acceleration setvars called');
			component.set('lng', position.coords.longitude);
			console.log(position.coords);
			component.set('lat', position.coords.latitude);
			component.set('alt', position.coords.altitude);


		}, function (error) {//error callback	

		console.log(error);
		});
	}
	catch(err){
	console.log('error: '+err);
	}
	if(component.get('on')){
		//keep running
		component.computeGPS(component); //recurse
	}

	}, 10000);//run ever 10000ms
	},

	// getWeather: function(latitude, longitude) {

	//     // Get a free key at http://openweathermap.org/. Replace the "Your_Key_Here" string with that key.
	//     var OpenWeatherAppKey = "2881eb7b944ea129ceb95cc246d83e02";

	//     var queryString =
	//       'http://api.openweathermap.org/data/2.5/weather?lat='
	//       + latitude + '&lon=' + longitude + '&appid=' + OpenWeatherAppKey + '&units=imperial';

	//     $.getJSON(queryString, function (results) {

	//         if (results.weather.length) {

	//             $.getJSON(queryString, function (results) {

	//                 if (results.weather.length) {

	//                     $('#description').text(results.name);
	//                     $('#temp').text(results.main.temp);
	//                     $('#wind').text(results.wind.speed);
	//                     $('#humidity').text(results.main.humidity);
	//                     $('#visibility').text(results.weather[0].main);

	//                     var sunriseDate = new Date(results.sys.sunrise);
	//                     $('#sunrise').text(sunriseDate.toLocaleTimeString());

	//                     var sunsetDate = new Date(results.sys.sunrise);
	//                     $('#sunset').text(sunsetDate.toLocaleTimeString());
	//                 }

	//             });
	//         }
	//     }).fail(function () {
	//         console.log("error getting location");
	//     });
	// },

	actions: {
		Press: function(){
			var Component = this;
			Component.set('isP', true);
		},

		unPress: function(){
			var Component = this;
			Component.set('isP', false);
		},

		getLocation: function(){
			var Component = this;
			Component.set('showMap', true)
		},

		stopLocation: function(){
			var Component = this;
			Component.set('showMap', false)	
		}
	}
});
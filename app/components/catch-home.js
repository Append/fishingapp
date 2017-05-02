import Ember from 'ember';

export default Ember.Component.extend({
	isP: false,
	showMap: false,
	showBait: false,
	showCamera: false,
	first: false,
	lng: 0,
	lat: 0,
	alt: 0,
	zoom: 4,
	imgSrc: 'assets/200.jpg',
	on: true,

	startLogging: function(){
		//begin logging geolocation data once the component launches

		var component = this;
		this.computeGPS(component);

	}.on('init'),

	//gps code from class mate at https://github.com/MLHale/CYBR8480/blob/master/modules/hybrid-app-tutorial-part2.md
	computeGPS: function(component){
		Ember.run.later(function(){
		//wrapper to preserve binding satistfaction
		try {
			//invoke cordova geolocation Plugin and get geolocation data
			navigator.geolocation.getCurrentPosition(function (position) {//success callback
			//console.log('acceleration setvars called');
			component.set('lng', position.coords.longitude);
			//console.log(position.coords);
			component.set('lat', position.coords.latitude);
			component.set('alt', position.coords.altitude);


		}, function (error) {//error callback	
			console.log(error);
		});
	}
	catch(err){
	//console.log('error: '+err);
	alert('error: '+err);
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

	//picture code from https://github.com/theeheng/ember-cli-cordova-example-app
	onPhotoDataSuccess : function (imageData) {
	//alert('Success.');
	//alert(imageData);

	this.set('imgSrc',imageData);

	},

	onFail : function (message) {
	alert('Failed because: ' + message);
	},
	capturePhoto : function () {
	// body...


	//alert(navigator.camera);

	navigator.camera.getPicture(this.onPhotoDataSuccess.bind(this), this.onFail , { quality: 50 });
	},


	actions: {
		Press: function(){
			var Component = this;
			Component.set('isP', true);
		},

		unPress: function(){
			var Component = this;
			Component.set('isP', false);
		},

		recBait: function(){
			var Component = this;
			Component.set('showBait', true);
		},

		saveBait: function(){
			var Component = this;
			Component.set('showBait', false);
			//Save the state of the bait selector
			//maybe seperate component http://stackoverflow.com/questions/30244040/recording-values-of-radio-buttons-in-ember
		},

		getLocation: function(){
			var Component = this;
			Component.set('showMap', true);
		},
		next: function(){
			var Component = this;
			Component.set('first', false);	
		},

		stopLocation: function(){
			var Component = this;
			Component.set('showMap', false);	
		},

		takeAPicture: function() {
			this.capturePhoto();
			var Component = this;
			Component.set('showCamera', true);
			return false;
		},
	}
});
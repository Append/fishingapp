import Ember from 'ember';

export default Ember.Component.extend({

	tiConnected: false,
	testing: false,
	clicks: 0,
	deviceId: "24:71:89:C0:B0:84",
	temp: 0,
	press: 0,
	baroHistory: [],
	tempHistory: [],
	nearbyDevices: [],


	//this method handles refreshing and populating the list with new devices
	onDiscoverDevice: function(component, device) {
		component.get('nearbyDevices').pushObject({name: device.name, id: device.id});
	},

	// //error function not currently used
	// onError: function(reason) {
 //        alert("ERROR: " + reason); // real apps should use notification.alert
 //    },

 	//recommended in ble central to convert the data from the sensor, add F conversion
	sensorBarometerConvert: function(data){
        return (data / 100);
    },

    //set up withe notification so it refreshes whenever the sensor sends new data
    onBarometerData: function(data, newThis) {
         var message;
         var a = new Uint8Array(data);
         //0-2 Temp
         //3-5 Pressure
         newThis.set('temp',newThis.get('sensorBarometerConvert')( a[0] | (a[1] << 8) | (a[2] << 16)));
         newThis.set('press', newThis.get('sensorBarometerConvert')( a[3] | (a[4] << 8) | (a[5] << 16)));
         message =  "Temperature <br/>" +
                    newThis.get('temp') + "°C <br/>" +
                    "Pressure <br/>" + newThis.get('press')
                     + "hPa <br/>" ;

        //barometerData.innerHTML = message;
        //update history, maintain 50 points max
		var history=newThis.get('baroHistory');
		if(history.length === 50){
			history.shiftObject();//shift an x off
		}
        var t = Date.now();
        var newXPoint = {time: t, label: 'x', value: newThis.get('press')};
        history.addObjects([newXPoint]);

        //update history, maintain 50 points max
		var history=newThis.get('tempHistory');
		if(history.length === 50){
			history.shiftObject();//shift an x off
		}
        var t = Date.now();
        var newXPoint = {time: t, label: 'x', value: newThis.get('temp')};
        history.addObjects([newXPoint]);

    },

    //recommended in ble central to convert the data from the sensor, add F conversion
	sensorLightConvert: function(data){
        return (data / 100);
    },

    //set up withe notification so it refreshes whenever the sensor sends new data
    onLightData: function(data, newThis) {
         var message;
         var a = new Uint8Array(data);
         alert(a);
    },

    //cleanly disconnect from device
    onDisconnect: function(Component){
    	ble.disconnect(Component.deviceId, function(){/*alert("Succesful disconnect");*/}, function(reason){alert("on DisconnectERROR: " + reason);});
    },

    //store the sensor data
    storeSensor: function(component){
    	var t = Date.now();
    	if(component.get('press') !== 0){
    		var newXPoint = {time: t, label: 'x', value: component.get('press')};
    	
			localforage.length().then(function(numberOfKeys) {
				// Outputs the length of the database.
				//console.log(numberOfKeys);
				var formattedNumber = ("0000" + numberOfKeys).slice(-5);
				localforage.setItem(formattedNumber, newXPoint, function(){});
			}).catch(function(err) {
				// This code runs if there were any errors
				console.log(err);
			});
		}
    }, 

    //Ever 5 seconds record the state of the sensor, uses recursion and the ember run later function
    recordLoop: function(component){
    	if(component.get('tiConnected') == true){
    		component.get('storeSensor')(component);
    	}
    	//run every 30 seconds
    	Ember.run.later(component, function(){component.get('recordLoop')(component)},5000);
    },

    //https://www.w3schools.com/jsref/jsref_gethours.asp
	addZero: function(i) {
		if (i < 10) {
			i = "0" + i;
		}
		return i;
	},

    onButtonData: function(component, data) {
		// button bitmask
		var LEFT_BUTTON = 1;  // 0001
		var RIGHT_BUTTON = 2; // 0010

        var state = new Uint8Array(data);
        var message = '';

        if (state === 0) {
            message = 'No buttons are pressed.';
        }

        if (state & LEFT_BUTTON) {
        	//catch event, log an event for a catch
        	localforage.length().then(function(numberOfKeys) {
				// Outputs the length of the database.
				//console.log(numberOfKeys);
				var formattedNumber = ("0000" + numberOfKeys).slice(-5);
				var t = new Date();
				var h = component.get('addZero')(t.getHours());
				var m = component.get('addZero')(t.getMinutes());
				var s = component.get('addZero')(t.getSeconds());

				localforage.setItem("catch" + formattedNumber, {"group": "default", "xValue": h +  + m +  + s, "yValue": 0}, function(){});
			}).catch(function(err) {
				// This code runs if there were any errors
				console.log(err);
			});
            message += 'Left button is pressed.<br/>';
        }

        if (state & RIGHT_BUTTON) {
            message += 'Right button is pressed.<br/>';
        }

    },

    //when you first connect to device
	onConnect: function(deviceId, newThis) {

		// Subscribe to button service
		ble.startNotification(deviceId, "FFE0", "FFE1", function(data){newThis.get('onButtonData')(newThis, data)}, function(reason){alert("butstart ERROR: " + reason);});

		//Subscribe to barometer service
		ble.startNotification(deviceId, "F000AA40-0451-4000-B000-000000000000", "F000AA41-0451-4000-B000-000000000000", function(data){newThis.get('onBarometerData')(data,newThis)}, function(reason){alert("barostart ERROR: " + reason);});

		//Subscribe to light service
		//ble.startNotification(deviceId, "F000AA70-0451-4000-B000-000000000000", "F000AA71-0451-4000-B000-000000000000", function(data){newThis.get('onLightData')(data,newThis)}, function(reason){alert("lightNot ERROR: " + reason);});

		//Turn on barometer
		
		var barometerConfig = new Uint8Array(1);
		barometerConfig[0] = 0x01;
		ble.write(deviceId, "F000AA40-0451-4000-B000-000000000000", "F000AA42-0451-4000-B000-000000000000", barometerConfig.buffer,
		function() { /*("Started barometer.");*/ }, function(reason){alert("write baroonConnect ERROR: " + reason);});
	
		//Turn on light
		// var humConfig = new Uint8Array(1);
		// humConfig[0] = 0x01;
		// ble.write(deviceId, "F000AA70-0451-4000-B000-000000000000", "F000AA72-0451-4000-B000-000000000000", humConfig.buffer,
		// function() { /*alert("Started humidity.");*/ }, function(reason){alert("write humonConnect ERROR: " + reason);});

		//this.get('showDetailPage');
		//alert('connected');
	},

	//found at https://github.com/don/cordova-plugin-ble-central/blob/master/examples/sensortag_cc2650/www/js/index.js#L63
	setup: function(deviceId,newThis){
        ble.connect(deviceId, function(){Ember.run.later(newThis.get('onConnect')(deviceId, newThis),100);}, function(reason){alert("setup ERROR: " + reason);});  
	},

	sDB: function(){
		var newThis = this;
		localforage.config({
		name        : 'FishBright',
		storeName   : 'sensor', // Should be alphanumeric, with underscores.
		description : 'db for sensor stuff'
		});
		this.get('recordLoop')(this);
	}.on('init'),

	actions: {
		//connect to device
		connect: function(id){
			var component = this;
			component.set('tiConnected', true);
			//alert(deviceId);
			component.set('deviceId', id);
			this.get('setup')(id, component);
		},

		//disconnect from device
		disconnect: function(){
			var Component = this;
			this.get('onDisconnect')(Component);
			Component.set('tiConnected', false);
		},

		//when first connected scan for devices with the CC2560 tag id, based on code from ble central
		refreshDeviceList: function() {
			var component = this;
			component.get('nearbyDevices').clear();
			ble.scan(['AA80'], 5, function(device){component.get('onDiscoverDevice')(component, device)}); // scan for CC2560 SensorTags
		},

		//error checking function, used to see if device is connected
		check: function() {
			ble.isConnected(this.get('deviceId'), function(){alert('connected');}, function(){alert('not connected');});
		}
	}
});

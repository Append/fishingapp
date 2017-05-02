import Ember from 'ember';

export default Ember.Component.extend({

	tiConnected: false,
	clicks: 0,
	deviceId: "24:71:89:C0:B0:84",
	temp: 0,
	press: 0,

	startDatabase: function(){
		const dbName = "sensorData";

		var request = indexedDB.open(dbName, 2);

		request.onerror = function(event) {
			// Handle errors.
			alert('Error in startDB');
		};
		request.onupgradeneeded = function(event) {
			alert('creating DB');
			var db = event.target.result;

			// Create an objectStore to hold information about our customers. We're
			// going to use "ssn" as our key path because it's guaranteed to be
			// unique - or at least that's what I was told during the kickoff meeting.
			var objectStore = db.createObjectStore("customers", { keyPath: "ssn" });

			// Create an index to search customers by name. We may have duplicates
			// so we can't use a unique index.
			objectStore.createIndex("name", "name", { unique: false });

			// Create an index to search customers by email. We want to ensure that
			// no two customers have the same email, so use a unique index.
			objectStore.createIndex("email", "email", { unique: true });

			// Use transaction oncomplete to make sure the objectStore creation is 
			// finished before adding data into it.
			objectStore.transaction.oncomplete = function(event) {
			// Store values in the newly created objectStore.
			var customerObjectStore = db.transaction("customers", "readwrite").objectStore("customers");
			for (var i in customerData) {
				customerObjectStore.add(customerData[i]);
			}
			};
		};
	}.on('init'),
	//this method handles refreshing and populating the list with new devices
	onDiscoverDevice: function(device) {
		var listItem = document.createElement('li'),
		html = '<b>' + device.name + '</b>' +
		'&nbsp;|&nbsp;' +
		device.id + '<button type="button" class="btn" {{action "connect" ' + device.id + '}}>Connect</button>';

		listItem.dataset.deviceId = device.id; 
		listItem.innerHTML = html;
		listItem.className = "list-group-item";
		deviceList.appendChild(listItem);
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

        barometerData.innerHTML = message;
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
    	console.log('yip');
    }, 

    //Ever 5 seconds record the state of the sensor, uses recursion and the ember run later function
    recordLoop: function(component){
    	var component = this;
    	if(component.get('tiConnected') === true){
    		component.get('storeSensor')(component);
    	}
    	//run every 30 seconds
    	Ember.run.later(component, function(){this.recordLoop(component)},30000);
    }.on('init'),

    onButtonData: function(data) {
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
            message += 'Left button is pressed.<br/>';
        }

        if (state & RIGHT_BUTTON) {
            message += 'Right button is pressed.<br/>';
        }

    },

    //when you first connect to device
	onConnect: function(deviceId, newThis) {

		// Subscribe to button service
		ble.startNotification(deviceId, "FFE0", "FFE1", function(data){newThis.get('onButtonData')(data,newThis)}, function(reason){alert("butstart ERROR: " + reason);});

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


	actions: {
		//connect to device
		connect: function(deviceId){
			var Component = this;
			Component.set('tiConnected', true);
			//alert(deviceId);
			this.get('setup')(deviceId,Component);
		},

		//disconnect from device
		disconnect: function(){
			var Component = this;
			this.get('onDisconnect')(Component);
			Component.set('tiConnected', false);
		},

		//when first connected scan for devices with the CC2560 tag id, based on code from ble central
		refreshDeviceList: function() {
			var Component = this;
			deviceList.innerHTML = ''; //dump old list
			ble.scan(['AA80'], 5, function(device){Component.get('onDiscoverDevice')(device)}); // scan for CC2560 SensorTags
		},

		//error checking function, used to see if device is connected
		check: function() {
			ble.isConnected(this.get('deviceId'), function(){alert('connected');}, function(){alert('not connected');});
		}
	}
});

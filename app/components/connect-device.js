import Ember from 'ember';

export default Ember.Component.extend({

	// barometer: {
 //    service: "F000AA40-0451-4000-B000-000000000000",
 //    data: "F000AA41-0451-4000-B000-000000000000",
 //    notification: "F0002902-0451-4000-B000-000000000000",
 //    configuration: "F000AA42-0451-4000-B000-000000000000",
 //    period: "F000AA43-0451-4000-B000-000000000000"
	// },

	tiConnected: false,
	clicks: 0,
	deviceId: "24:71:89:C0:B0:84",

	//this method handles refreshing and populating the list with new devices
	onDiscoverDevice: function(device) {
		var listItem = document.createElement('li'),
		html = '<b>' + device.name + '</b>' +
		'&nbsp;|&nbsp;' +
		device.id + '<button type="button" class="btn" {{action "theClick" "' + device.id + '"}}>Connect</button>';

		listItem.dataset.deviceId = device.id; 
		listItem.innerHTML = html;
		listItem.className = "list-group-item";
		deviceList.appendChild(listItem);
	},

	sensorBarometerConvert: function(data){
        return (data / 100);
    },
    onBarometerData: function(data) {
         var message;
         var a = new Uint8Array(data);
         //0-2 Temp
         //3-5 Pressure
         message =  "Temperature <br/>" +
                    this.get('sensorBarometerConvert')( a[0] | (a[1] << 8) | (a[2] << 16)) + "°C <br/>" +
                    "Pressure <br/>" +
                    this.get('sensorBarometerConvert')( a[3] | (a[4] << 8) | (a[5] << 16)) + "hPa <br/>" ;

        //barometerData.innerHTML = message;
        alert("1");
    },

	onConnect: function(deviceId) {
		// Subscribe to button service
		// ble.startNotification(deviceId, button.service, button.data, app.onButtonData, app.onError);

		//Subscribe to barometer service
		ble.startNotification(deviceId, "F000AA40-0451-4000-B000-000000000000", "F000AA41-0451-4000-B000-000000000000", function(data){this.get('onBarometerData')(data)}, function(reason){this.get('onError')(reason)});

		//Turn on barometer
		var barometerConfig = new Uint8Array(1);
		barometerConfig[0] = 0x01;
		ble.write(deviceId, "F000AA40-0451-4000-B000-000000000000", "F000AA42-0451-4000-B000-000000000000", barometerConfig.buffer,
		function() { alert("Started barometer."); }, function(reason){this.get('onError')(reason)});

		//Associate the deviceID with the disconnect button
		//disconnectButton.dataset.deviceId = deviceId;
		//this.get('showDetailPage');
		//alert('connected');
	},
	//on second click
	//found at https://github.com/don/cordova-plugin-ble-central/blob/master/examples/sensortag_cc2650/www/js/index.js#L63
	setup: function(deviceId,newThis){
        ble.connect(deviceId, newThis.get('onConnect')(deviceId), function(reason){this.get('onError')(reason)});
	},

	onError: function(reason) {
        alert("ERROR: " + reason); // real apps should use notification.alert
    },

	actions: {
		connect: function(){
			var Component = this;
			Component.set('tiConnected', true);
			//alert(this.get('deviceId'));
			this.get('setup')(this.get('deviceId'),Component);
		},

		disconnect: function(){
			var Component = this;
			Component.set('tiConnected', false);
		},
		//when first connected scan for devices with the CC2560 tag id, based on code from ble central
		refreshDeviceList: function() {
			var Component = this;
			deviceList.innerHTML = ''; //dump old list
			ble.scan(['AA80'], 5, function(device){Component.get('onDiscoverDevice')(device)}); // scan for CC2560 SensorTags
		},

	}
});

import Ember from 'ember';

export default Ember.Component.extend({

	tiConnected: false,


	onDiscoverDevice: function(device) {
		var listItem = document.createElement('li'),
		html = '<b>' + device.name + '</b><br/>' +
		'RSSI: ' + device.rssi + '&nbsp;|&nbsp;' +
		device.id;

		listItem.dataset.deviceId = device.id;  // TODO
		listItem.innerHTML = html;
		deviceList.appendChild(listItem);
	},

	onError: function(reason) {
		alert("ERROR: " + reason); // real apps should use notification.alert
	},


	actions: {
		connect: function(){

			var Component = this;
			Component.set('tiConnected', true);
		},

		disconnect: function(){
			var Component = this;
			Component.set('tiConnected', false);
		},

		refreshDeviceList: function() {
			ble.scan([], 5, function(device) {
		var listItem = document.createElement('li'),
		html = '<b>' + device.name + '</b><br/>' +
		'RSSI: ' + device.rssi + '&nbsp;|&nbsp;' +
		device.id;

		listItem.dataset.deviceId = device.id;  // TODO
		listItem.innerHTML = html;
		deviceList.appendChild(listItem);
	});

			//deviceList.innerHTML = ''; // empties the list
			// scan for CC2560 SensorTags
			//ble.scan(['AA80'], 5, this.onDiscoverDevice());
		},

	}
});

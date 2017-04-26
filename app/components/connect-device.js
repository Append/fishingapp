import Ember from 'ember';

export default Ember.Component.extend({

	tiConnected: false,

	//this method handles refreshing and populating the list with new devices
	onDiscoverDevice: function(device) {
		var listItem = document.createElement('li'),
		html = '<b>' + device.name + '</b>' +
		'&nbsp;|&nbsp;' +
		device.id;

		listItem.dataset.deviceId = device.id; 
		listItem.innerHTML = html;
		listItem.className = "list-group-item";
		deviceList.appendChild(listItem);
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
		//when first connected scan for devices with the CC2560 tag id, based on code from ble central
		refreshDeviceList: function() {
			var Component = this;
			deviceList.innerHTML = ''; //dump old list
			ble.scan(['AA80'], 5, function(device){Component.get('onDiscoverDevice')(device)}); // scan for CC2560 SensorTags
		},

	}
});

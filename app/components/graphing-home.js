import Ember from 'ember';

export default Ember.Component.extend({
	baroHistory: [],
	tempHistory: [],
	catchEvents: [],


	graphControl: function(){
		// Find the number of items in the datastore.
		var component = this;
		// The same code, but using ES6 Promises.
		localforage.iterate(function(value, key, iterationNumber) {
			// Resulting key/value pair -- this callback
			// will be executed for every item in the
			// database.
			//console.log([key, value]);
			if(key.includes('catch')){
				component.get('addCatch')(value, component);
			}
			else{
				component.get('addHistory')(value, component);
			}
		}).then(function() {
			console.log('Iteration has completed');
		}).catch(function(err) {
			// This code runs if there were any errors
			console.log(err);
		});
	}.on('init'),

	addHistory: function(item,newThis){
		//update history, maintain 50 points max
		var history=newThis.get('baroHistory');
		// if(history.length === 50){
		// 	history.shiftObject();//shift an x off
		// }
        history.addObjects([item]);
	},

	addCatch: function(item, component){
		var history=component.get('catchEvents');
		history.addObjects([item]);
	},
});

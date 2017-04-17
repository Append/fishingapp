import Ember from 'ember';

export default Ember.Component.extend({
	tiConnected: false,

	actions: {
		connect: function(){
			var Component = this;
			Component.set('tiConnected', true);
		},

		disconnect: function(){
			var Component = this;
			Component.set('tiConnected', false);
		},
	}
});

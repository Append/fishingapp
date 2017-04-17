import Ember from 'ember';

export default Ember.Component.extend({
	isP: false,

	actions: {
		Press: function(){
			var Component = this;
			Component.set('isP', true);
		},

		unPress: function(){
			var Component = this;
			Component.set('isP', false);
		},
	}
});
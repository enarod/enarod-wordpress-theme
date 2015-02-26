define(
	function(require){
		'use strict';

		var $	= require('jquery'),
		_		= require('underscore'),
		Backbone= require('backbone')
		;

		return Backbone.Model.extend({
			urlRoot: BASE_URL+"petition/v2/emailVote",

			defaults:{
				ID: '',
			}	
		
		
		});


});

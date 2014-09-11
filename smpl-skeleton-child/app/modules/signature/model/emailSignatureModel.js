define(
	function(require){
		'use strict';

		var $	= require('jquery'),
		_		= require('underscore'),
		Backbone= require('backbone')
		;

		return Backbone.Model.extend({
			urlRoot: "https://enarod.org/app/api/petition/emailVote",

			defaults:{
				ID: '',
			}	
		
		
		});


});

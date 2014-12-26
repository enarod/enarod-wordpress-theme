define (
	function(require){
		'use strict';

		var $	= require ('jquery'),
		_		= require ('underscore'),
		Backbone= require ('backbone');


		return Backbone.Model.extend ({
			validation: {
				Name	: {
					required: true,
					maxLength	: 255,
				},
				'Middle-Name' : {
					required	: false,
					maxLength	: 255
				},
				Surname : {
					required	: false,
					maxLength	: 255,
				},
				Email	: {
					required	: true,
					pattern		: 'email',
				},
				Address1 : {
					required	: false,
					maxLength	: 255
				},
				Address2 : {
					required	: false,
					maxLength	: 255
				},
				Area	: {
					required	: false,
					maxLength	: 255
				},
				'Zip-code':{
					required	: false,
					maxLength	: 255
				},
				Country : {
					required	: true,
				},
				City	: {
					required	: true,
					maxLength	: 255
				}
			},


		});


});

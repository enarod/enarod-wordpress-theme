define (
	function(require){
		'use strict';

		var $	= require ('jquery'),
		_		= require ('underscore'),
		Backbone= require ('backbone');


		return Backbone.Model.extend ({
			validation: {
				Name	: [{
					required: true,
					msg: 'Необхідно вказати ім’я'
				},
					{
						maxLength	: 255,
						msg: 'Ім’я надто довге (максимум 255 символів)'
					}],
				'Middle-Name' : {
					required	: false,
					maxLength	: 255,
					msg: 'Значення надто довге (максимум 255 символів)'
				},
				Surname : {
					required	: false,
					maxLength	: 255,
					msg: 'Значення надто довге (максимум 255 символів)'
				},
				Email	: [
					{
						required	: true,
						msg: 'Необхідно ввести Email'
					},
					{
						pattern		: 'email',
						msg: 'Слід ввести коректну адресу'
					}
				],
				Address1 : {
					required	: false,
					maxLength	: 255,
					msg: 'Значення надто довге (максимум 255 символів)'
				},
				Address2 : {
					required	: false,
					maxLength	: 255,
					msg: 'Значення надто довге (максимум 255 символів)'
				},
				Area	: {
					required	: false,
					maxLength	: 255,
					msg: 'Значення надто довге (максимум 255 символів)'
				},
				'Zip-code':{
					required	: false,
					maxLength	: 255,
					msg: 'Значення надто довге (максимум 255 символів)'
				},
				Country : {
					required	: true,
					msg: 'Слід вказати країну'
				},
				City	: [
					{
						required	: true,
						msg: 'Слід вказати місто'
					},
					{
						maxLength	: 255,
						msg: 'Значення надто довге (максимум 255 символів)'
					}
				]
			},


		});


});

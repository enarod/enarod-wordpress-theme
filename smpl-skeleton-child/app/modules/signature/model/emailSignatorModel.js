define (
	function(require){
		'use strict';

		var $	= require ('jquery'),
		_		= require ('underscore'),
		Backbone= require ('backbone');


		return Backbone.Model.extend ({
			validation: {
				FirstName	: [{
					required: true,
					msg: 'Необхідно вказати ім’я'
				},
					{
						maxLength	: 255,
						msg: 'Ім’я надто довге (максимум 255 символів)'
					}],
				MiddleName : {
					required	: false,
					maxLength	: 255,
					msg: 'Значення надто довге (максимум 255 символів)'
				},
				LastName : {
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
				AddressLine1 : {
					required	: false,
					maxLength	: 255,
					msg: 'Значення надто довге (максимум 255 символів)'
				},
				AddressLine2 : {
					required	: false,
					maxLength	: 255,
					msg: 'Значення надто довге (максимум 255 символів)'
				},
				Region	: {
					required	: false,
					maxLength	: 255,
					msg: 'Значення надто довге (максимум 255 символів)'
				},
				ZipCode:{
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
				],
				privacyConfirm : {
					acceptance: true,
					msg: 'Ваша згода є необхідна для зарахування голосу'
				}
			}


		});


});

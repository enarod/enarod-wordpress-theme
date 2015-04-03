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
				MiddleName : [{
						required	: true,
						msg: 'Необхідно вказати ім’я по-батькові'
					},
					{
						maxLength	: 255,
						msg: 'Значення надто довге (максимум 255 символів)'
					}
					],
				LastName : [{
						required	: true,
						msg: 'Необхідно вказати призвище'
					},
					{
						maxLength	: 255,
						msg: 'Значення надто довге (максимум 255 символів)'
					}],
				Email	: [
					{
						required	: true,
						msg: 'Необхідно ввести Email'
					},
					{
						pattern		: 'email',
						msg: 'Слід ввести коректну електронну адресу'
					}
				],
				AddressLine1 : [{
						required	: true,
						msg: 'Слід вказати адресу'
					},
					{
						maxLength	: 255,
						msg: 'Значення надто довге (максимум 255 символів)'
					}],
				AddressLine2 : {
					required	: false,
					maxLength	: 255,
					msg: 'Значення надто довге (максимум 255 символів)'
				},
				Region	: [{
						required	: true,
						msg: 'Слід вказати область'
					},
					{
						maxLength	: 255,
						msg: 'Значення надто довге (максимум 255 символів)'
					}],
				ZipCode:[{
						required	: true,
						msg: 'Слід вказати поштовий індекс'
					},
					{
						maxLength	: 255,
						msg: 'Значення надто довге (максимум 255 символів)'
					}],
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

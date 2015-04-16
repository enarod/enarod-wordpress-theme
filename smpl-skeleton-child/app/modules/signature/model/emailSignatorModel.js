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
						pattern: /^([a-z\s\-]+?|[\u0400-\u04FF\s\-]+)$/gi,
						msg: 'Ім’я містить недозволені символи'
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
						pattern: /^([a-z\s\-]+?|[\u0400-\u04FF\s\-]+)$/gi,
						msg: 'Ім’я по-батькові містить недозволені символи'
					},
					{
						maxLength	: 255,
						msg: 'Значення надто довге (максимум 255 символів)'
					}
					],
				LastName : [{
						required	: true,
						msg: 'Необхідно вказати прізвище'
					},
					{
						pattern: /^([a-z\s\-]+?|[\u0400-\u04FF\s\-]+)$/gi,
						msg: 'Прізвище містить недозволені символи'
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
						pattern: /^([0-9a-z\s\-]+?|[0-9\u0400-\u04FF\s\-]+)$/gi,
						msg: 'Адреса містить недозволені символи'
					},
					{
						maxLength	: 255,
						msg: 'Значення надто довге (максимум 255 символів)'
					}],
				AddressLine2 : [{
					required	: false,
					maxLength	: 255,
					msg: 'Значення надто довге (максимум 255 символів)'
					},
					{
						pattern: /^([0-9a-z\s\-]+?|[0-9\u0400-\u04FF\s\-]+)$/gi,
						msg: 'Адреса містить недозволені символи'
					}],
				Region	: [{
						required	: true,
						msg: 'Слід вказати область'
					},
					{
						pattern: /^([a-z\s\-]+?|[\u0400-\u04FF\s\-]+)$/gi,
						msg: 'Назва області містить недозволені символи'
					},
					{
						maxLength	: 255,
						msg: 'Значення надто довге (максимум 255 символів)'
					}],
				ZipCode:[{
						required	: true,
						msg: 'Слід вказати поштовий індекс',
					},
					{
						maxLength	: 255,
						msg: 'Значення надто довге (максимум 255 символів)'
					},
					{
						pattern: 'digits',
						msg: 'Поштовий індекс містить недозволені символи'
					}],
				Country :[{
						required	: true,
						msg: 'Слід вказати країну'
					},
					{
						pattern: /^([a-z\s\-]+?|[\u0400-\u04FF\s\-]+)$/gi,
						msg: 'Назва країни містить недозволені символи'
					}],
				City	: [{
						required	: true,
						msg: 'Слід вказати місто'
					},
					{
						pattern: /^([a-z\s\-]+?|[\u0400-\u04FF\s\-]+)$/gi,
						msg: 'Назва міста містить недозволені символи'
					},
					{
						maxLength	: 255,
						msg: 'Значення надто довге (максимум 255 символів)'
					}],
				privacyConfirm : {
					acceptance: true,
					msg: 'Ваша згода є необхідна для зарахування голосу'
				}
			}


		});


});

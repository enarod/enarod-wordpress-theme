define(
	function(require){
	'use strict';

	var $ = require('jquery'),
		_ = require('underscore'),
		Backbone = require('backbone'),
		PetitionCategories	= require( 'module/petition/collection/petitionCategoryCollection' ),
		PetitionLevels		= require( 'module/petition/collection/petitionLevelCollection' ) ,
		PetitionRegions		= require( 'module/petition/collection/petitionRegionCollection' ) ,
		Organizations		= require( 'module/organization/collection/organizationCollection' ) ,

		PetitionAuthor  = require('module/signature/model/emailSignatorModel');


	return Backbone.Model.extend({
		urlRoot: BASE_URL+"petition/",

		defaults: {
			Subject	:	'',
			Text	:	'',
			ID		:	'',
			Author	:   new PetitionAuthor(),
		},	

		initialize: function(){
			this.url = this.urlRoot + this.get('ID');
			this.on('change', this.changeHandler, this);
			this.on('invalid', this.errorHandler, this);

		},

		parse: function(response){
			var model;
			if (this.get('unfold')){
				model = response.Data;
			}else{
				model = response;
			}
			this.prepareModelParameters(model);
			return model;
		},	

		validation: {
			Organization: [{
				required: true,
				msg: 'Необхідно вибрати організацію'
			}],
			Subject: [{
				required: true,
				msg: 'Поле "Тема/Назва" петиції обов’язкове для заповнення'
			}],
			Text: [{
				required: true,
				msg: 'Поле "Опис проблеми" є обов’язкове для заповнення'
			}],
			Requirements: [{
				required: true,
				msg: 'Поле "Опис проблеми" є обов’язкове для заповнення'
			}],
			Category: [{
				required: true,
				msg: "Необхідно вибрати категорію петиції"
			}],
			KeyWords: [{
				required: true,
				msg: 'Поле "Ключові слова" є обов’язкове для заповнення'
			}],

		},


		errorHandler: function(){
alert("Error!");

		},		
	
		/*----------------------------------
		* Preparing petition parameters
		*----------------------------------*/
		prepareModelParameters: function(data){
			if ( data.VotesCount !== undefined ){
				var limit = data.Level.Limit;
				var collected = data.VotesCount;
				var left = limit - collected;
				data.VotesLeft = left;
			}

			if ( data.EffectiveTo ){
				var effectiveDate = new Date( data.EffectiveTo );
				this.setDaysLeft( effectiveDate );
				data.EffectiveTo = this.formatDate( effectiveDate );
			}

			if ( data.EffectiveFrom ){
				var effectiveDate = new Date( data.EffectiveFrom );
				this.setDaysLeft( effectiveDate );
				data.EffectiveFrom = this.formatDate( effectiveDate );
			}

			if( data.CreatedDate ){
				var createdDate = new Date( data.CreatedDate );
				data.CreatedDate =  this.formatDate( createdDate ) ;
			}

			if( data.Organization ) {
				data.Partner = data.Organization.Name;
			}
			else if(data.AddressedTo) {
				data.Partner = data.AddressedTo;
			}
			else {
				data.Partner = "Без адресата"
			}

			if (!data.Organization) {
				data.Organization = {Logo: ''};
			}

			if ( data.Author ) {
				if (data.Author.LastName) {
					data.AuthorRef = data.Author.LastName;
					if (data.Author.FirstName) {
						data.AuthorRef += ' ' + data.Author.FirstName.substring(0, 1).toUpperCase() + '.';
					}
					if (data.Author.City) {
						data.AuthorRef += ' (' + data.Author.City + ')';
					}
				}
				else {
					data.AuthorRef = 'Без Автора';
				}
			}else{
				data.AuthorRef = 'Без Автора';
			}

		},

		setDaysLeft: function(effectiveDate){
			var d, h, m, diff;
			var currentDate = new Date();

			diff = Math.abs( effectiveDate - currentDate ) / 1000;
			d = Math.floor( diff/86400 );
			diff -= d * 86400;
			h = Math.floor( diff/3600 );
			diff -= h * 3600;
			m = Math.floor( diff/60 );
			diff -= m * 60;

			this.set("daysLeft", d);
			this.set("hoursLeft", h);
			this.set("minutesLeft", m);
		},

		formatDate: function(date){
			var formatedDate = date.getDate()+"."+(date.getMonth()+1)+"."+date.getFullYear();
			return formatedDate;
		},

		getLevel: function(){
			var levelList = new PetitionLevels();
			this.set( 'levelList', levelList );
			levelList.fetch();
		},

		getCategory: function(){
			var categoryList = new PetitionCategories();
			this.set( 'categoryList', categoryList );
			categoryList.fetch();
		},

		getRegion: function(){
			var regionList = new PetitionRegions();
			this.set( 'regionList', regionList);
			regionList.fetch();

		},

		getOrganization: function(){
			var organizationList = new Organizations();
			this.set( 'organizationList', organizationList);
			organizationList.fetch();
		},

		setOrganization: function( id ){
			var orgID;

			if ( id ){
				orgID = id;
			}else if (this.get('organizationID') ){
				orgID = this.get('organizationID');
			}else{
alert("Unable select organization in petition model #184 \nSystem is unable to finish your request.\n Please contact system administration!");
			}

			var Organization;
			_.each (this.get('organizationList').models, function(el, index, list){
				if ( el.get('ID') == orgID ){
					Organization = el;
				}
			});

			this.set('Organization', Organization);
			this.unset('organizationID');
			return Organization;
		}


	}); 



});

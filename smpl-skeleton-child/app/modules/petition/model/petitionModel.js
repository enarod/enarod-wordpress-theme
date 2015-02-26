define(
	function(require){
	'use strict';

	var $ = require('jquery'),
		_ = require('underscore'),
		Backbone = require('backbone'),
		PetitionCategories	= require( 'module/petition/collection/petitionCategoryCollection' ),
		PetitionLevels		= require( 'module/petition/collection/petitionLevelCollection' ) ,
		PetitionRegions		= require( 'module/petition/collection/petitionRegionCollection' ) ,

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

		validate: function(attrs){
console.log(attrs);

		},


		errorHandler: function(){
alert("Error!");

		},		
	
		changeHandler: function(){
console.log(" Petition model changed! ");
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

			if( data.CreatedDate ){
				var createdDate = new Date( data.CreatedDate );
				data.CreatedDate =  this.formatDate( createdDate ) ;
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

		}


	}); 



});

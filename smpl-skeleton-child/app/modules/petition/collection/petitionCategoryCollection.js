define(
	function(require){
		'use strict';

		var Backbone = require('backbone'),
		PetitionCategory	= require( 'module/petition/model/petitionCategoryModel' );

		return Backbone.Collection.extend({
			model: PetitionCategory,

			url: "https://enarod.org/app/api/petition/category",

			parse: function(data){
				return data.Data;
			}
		
		
		});


});

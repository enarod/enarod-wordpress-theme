define(
	function(require){
		'use strict';

		var Backbone = require('backbone'),
		PetitionCategory	= require( 'module/petition/model/petitionCategoryModel' );

		return Backbone.Collection.extend({
			model: PetitionCategory,

			url: BASE_URL+"petition/category",

			parse: function(data){
				return data.Data;
			}
		
		
		});


});

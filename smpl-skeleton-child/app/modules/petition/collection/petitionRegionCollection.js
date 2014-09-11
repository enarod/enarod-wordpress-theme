define( function( require ){
	'use strict';

	var Backbone	= require ('backbone'),
	PetitionRegion	= require ('module/petition/model/petitionRegionModel');	

	return Backbone.Collection.extend({
		model : PetitionRegion,

		url: "https://enarod.org/app/api/petition/region/3",

		parse: function(data){
			return data.Data;
		}
	
	
	}); 



});

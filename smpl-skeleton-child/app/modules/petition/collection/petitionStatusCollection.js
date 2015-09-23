define(
	function(require){
		'use strict';

		var Backbone = require('backbone'),
		PetitionStatus = require( 'module/petition/model/petitionStatusModel' );

		return Backbone.Collection.extend({
			model: PetitionStatus,

			url: BASE_URL+"petitions/statuses",

			parse: function(data){
				return data.Data;
			}
		
		
		});


});

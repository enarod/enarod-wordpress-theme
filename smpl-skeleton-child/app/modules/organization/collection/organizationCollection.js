define(
	function(require){
		'use strict';
		
		var $	= require ('jquery'),
		_		= require ('underscore'),
		Backbone =require ('backbone'),
		Organization = require ('module/organization/model/organizationModel');

		return Backbone.Collection.extend({
			model: Organization,

			url: function(){
				return BASE_URL + 'Organizations/all';
			}, 
			
			parse: function(response){
				return response.Data;
			}	
		
			

		});
		
});

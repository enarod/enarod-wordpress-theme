define(
	function(require){
		'use strict';

		var $	= require('jquery'),
		_		= require('underscore'),
		Backbone= require('backbone'),
		Petition= require('modules/petition/model/petitionModel');

	return Backbone.Collection.extend({
		model: Petition,

		url: function(){
			var URL = "https://enarod.org/app/api/petition/";
			if(this.search){
				URL += "search/"+this.search;
			}else if(this.tag){
				URL += "tag/"+this.tag;
			}
			return URL;
		},

		initialize: function(options){
			if (options){
				this.search = options.search;	
				this.tag	= options.tag;	
			}
		},

		parse: function(response){
			return response.Data;
		},

	});



});

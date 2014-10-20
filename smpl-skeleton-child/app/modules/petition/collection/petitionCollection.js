define(['require', 'backbone', 'petition/model/petitionModel'], function(require, Backbone, Petition){
    'use strict';


	return Backbone.Collection.extend({
		model: require('petition/model/petitionModel'),

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
		}

	});



});

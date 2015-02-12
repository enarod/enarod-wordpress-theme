define(
    function(require){
    'use strict';

        
	var $ = require('jquery'),
		_ = require('underscore'),
		Backbone = require('backbone');


    return Backbone.Model.extend({
        urlRoot: BASE_URL + "Organization",

		initialize: function(){
			var id = this.get('ID');

			if ( id ){
				this.url = this.urlRoot + '/' + id;
			}
		},

		parse: function(response){
			return response.Data;
		} 



     });

    }

);

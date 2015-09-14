define(
    function(require){
    'use strict';

        
	var $ = require('jquery'),
		_ = require('underscore'),
		Backbone = require('backbone');


    return Backbone.Model.extend({
        urlRoot: BASE_URL + "Organizations",

		initialize: function(){
			var id = this.get('ID');
			if ( id ){
				this.url = this.urlRoot + '/' + id;
				this.set({'unfold' : 'true'});
			}
		},

		parse: function(response){
			var model;
			if (this.get('unfold') ){
				model = response.Data;
			}else{
				model = response;
			}
			return model;
		} 



     });

    }

);

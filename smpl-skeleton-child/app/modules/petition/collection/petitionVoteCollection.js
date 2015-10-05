define(
function(require){
    'use strict';

    var Backbone = require('backbone'),
    Model       = require('modules/petition/model/petitionVoteModel');

    return Backbone.Collection.extend({
        model: Model,

        url: function(){
            var URL = BASE_URL+'petitions/'+this.petitionID+'/votes';
            if (this.search){
                URL += '?'+this.search;
            }

            return URL;
        },

        initialize: function(options){
            if ( options ){
                this.petitionID = options.petitionID;
            }
        },

        parse: function(response){
            var collection = response.Data;
            this.prepareParameters(collection);

            return collection;
        },

        prepareParameters: function(collection){
            for ( var model of collection ){
                var date = new Date(model.VoteDate);
                if ( date ){
                    model.VoteDate = date.getDate()+'.'+(date.getMonth()+1)+'.'+date.getFullYear();
                }

            }
        },

    
    
    });

})

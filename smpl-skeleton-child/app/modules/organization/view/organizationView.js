define(
    function(require){
    'use strict';

        
	var $ = require('jquery'),
		_ = require('underscore'),
		Backbone = require('backbone'),
        Organization = require ('text!module/organization/templates/organization.html'),
        OrganizationNew = require ('text!module/organization/templates/organizationNew.html'),
        OrganizationItem	= require('text!module/organization/templates/organizationItem.html'),
		OrganizationInPetition = require('text!module/organization/templates/organizationInPetition.html')
		;
    

    return Backbone.View.extend({
        initialize: function(data) {
            if (data.tmpl === 'new') {
                this.tmpl = OrganizationNew;
                this.render;
// Run render after parameters from server 
// for new organization is loaded
//                this.onceAll ( [this.model.get( 'categoryList' ), 
//                               this.model.get( 'levelList' ), 
//                               this.model.get ('regionList') ],
//                               'sync', 
//                               this.render, this );
            } else if (data.tmpl === 'item'){ // this.render triggered by collection view (organizationsView.js)
                this.tmpl = OrganizationItem;
            } else if (data.tmpl === 'organization'){
                this.tmpl = Organization;
                this.listenTo(this.model, 'sync', this.render);
            } else if ( data.tmpl === 'organizationInPetition'){
				this.tmpl = OrganizationInPetition;
			}
        },

		events:{
			'click input[id=list-petitions]' : 'searchPetitions',
			'click input[id=create-petition]' : 'createPetition'	
		},

        render: function(){
            this.template = _.template(this.tmpl);
            this.$el.html(this.template( this.model.attributes ) );
            $(this.parentView.moduleNode).append(this.$el);
            if ( this.model.attributes.state ){
                this.checkState( this.model.get('state') );
            }
            return this;
        },
   
		searchPetitions: function(){
			var id = this.model.get('ID');
			var searchInActive	= $('[name=search-in-active]').prop('checked');
			var searchInNew		= $('[name=search-in-new]').prop('checked');

			this.parentView.router.navigate('/petition/search/Text=&ShowActivePetitions='+searchInActive+
					'&ShowInactivePetitions='+searchInNew+
					'&OrganizationId='+id, true);
		},

		createPetition: function(){
			var id = this.model.get('ID');
			this.parentView.router.navigate ('#petition/new/'+id, true );
		},

 
        close: function(){
            this.remove();
            this.unbind();
        }

    });

    }
);

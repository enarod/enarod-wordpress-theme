define( 	function( require ){
	"use strict";

	var $				= require ('jquery'),
	Backbone			= require ('backbone');


	return Backbone.Router.extend({
		initialize: function(options){
			this.appView = options.view;
			this.appView.router = this;
		},


		routes:{
			""						:	"home",
			"petition"				:	"listPetitions",
			"petition/search"		:	"listPetitions",
			"petition/search/(:query)"	:	"searchPetitions",
			"petition/new(/:organization)"	:	"createPetition",
			"petition/tag/:tag"		:	"listPetitions",
			"petition/:id"			:	"openPetition",
			"petition/:id/(:state)"	:	"openPetition",

			"organization"			:   "listOrganizations",
			"organization/:id"      :   "openOrganization",
		},
	
	
		home: function(){
console.log("Home!!!");
			this.appView.cleanUp();
			this.appView.removeModuleMenu();
		},

/*-----------------------
    Petition routes
-----------------------*/
		openPetition: function(id, state){
			var Petition = require('module/petition/model/petitionModel');
			Petition = new Petition({"ID" : id});
			Petition.set("id" , id);
			Petition.set("unfold" , 1);
			Petition.set("state", state);

			this.appView.addChildView({
				module: 'petition',
				type : 'petition', 
				settings : {model: Petition, tmpl : 'petition'}
		   	});

			Petition.fetch();

	
		}, 


		createPetition: function( organizationID ){
			var Petition = require('module/petition/model/petitionModel');
			Petition = new Petition();
			Petition.getLevel();
			Petition.getCategory();
			Petition.getRegion();
			Petition.getOrganization();

			if ( organizationID ){
				Petition.set('organizationID', organizationID );
			}

			this.appView.addChildView({
				module: 'petition',
				type : 'petition', 
				settings : {model : Petition, tmpl : 'new' }
		   	});
		},

	
		listPetitions: function(tagName){
			var PetitionCollection	= require ('module/petition/collection/petitionCollection');
			var Petitions;

			if (tagName){
				Petitions = new PetitionCollection({'tag': tagName });
			}else{
				Petitions = new PetitionCollection();
			}

			this.appView.addChildView({
				module: 'petition',
				type : 'petitions', 
				settings : {petitions : Petitions} 
			}); 

			Petitions.fetch();

		},

		searchPetitions: function( query ){
            var PetitionCollection  = require ('module/petition/collection/petitionCollection');
            var Petitions = new PetitionCollection({search: query});
        
            this.appView.addChildView({
                module: 'petition',
                type : 'petitions', 
                settings : {petitions : Petitions} 
            });

            Petitions.fetch();
		},

/*-----------------------
    Petition routes
-----------------------*/
        openOrganization: function (id){
            var Organization = require('module/organization/model/organizationModel');
            Organization = new Organization ({"ID"  : id});

            this.appView.addChildView({
                module: 'organization',
                type: 'organization',
                settings: {model: Organization, tmpl: 'organization'}
            });

            Organization.fetch();
        },

		listOrganizations: function (id) {
			var OrganizationCollection	= require ('module/organization/collection/organizationCollection');
			var Organizations;

			Organizations = new OrganizationCollection();

			this.appView.addChildView({
				module: 'organization',
				type : 'organizations',
				settings : {organizations : Organizations}
			});

			Organizations.fetch();
		}

	});



});

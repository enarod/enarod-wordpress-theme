define( 	function( require ){
	"use strict";

	var $				= require ('jquery'),
	Backbone			= require ('backbone'),
	defPetitionSearchURL= 'Text=&SearchInPetitions=true&ShowActivePetitions=true&ShowInactivePetitions=true&CreatedDateStart=&CreatedDateEnd=&FinishDateStart=&FinishDateEnd=&OrderBy=Subject&OrderDirection=ASC&PageNumber=1&PageSize=10'
	;


	return Backbone.Router.extend({
		initialize: function(options){
			this.appView = options.view;
			this.appView.router = this;
		},


		routes:{
			""						:	"home",
			"petition"				:	"searchPetitions",
			"petition/search"		:	"listPetitions",
			"petition/search/(:query)"		:	"searchPetitions",
			"petition/new(/:organization)"	:	"createPetition",
			"petition/tag/:tag"		:	"listPetitions",
			"petition/:id"			:	"openPetition",
			"petition/:id/widget"	:   "openPetitionWidgetPage",
            "petition/:id/votes(/:query)"   :   "listPetitionVotes",
			"petition/:id/(:state)"	:	"openPetition",

			"organization"			:   "listOrganizations",
			"organization/:id"      :   "openOrganization",

            "user"                  :   "userProfile"
		},
	
	
		home: function(){
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

		openPetitionWidgetPage: function(id){
			var Petition = require('module/petition/model/petitionModel');
			Petition = new Petition({"ID" : id});
			Petition.set("id" , id);
			Petition.set("unfold" , 1);

			this.appView.addChildView({
				module: 'petition',
				type : 'petition', 
				settings : {model: Petition, tmpl : 'widget'}
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
				tagName = 'tag='+tagName;
				Petitions = new PetitionCollection({'tag': tagName });
			}else{
				Petitions = new PetitionCollection();
			}

			this.appView.addChildView({
				module: 'petition',
				type : 'petitions', 
				hasPaging: true,
				settings : {petitions : Petitions} 
			}); 

			Petitions.fetch();

		},

		searchPetitions: function( query ){
            var PetitionCollection  = require ('module/petition/collection/petitionCollection');
			var searchQuery = ( query ? query : defPetitionSearchURL );
            var Petitions = new PetitionCollection({search: searchQuery});
        
            this.appView.addChildView({
                module: 'petition',
                type : 'petitions', 
				hasPaging: true,
                settings : {petitions : Petitions} 
            });

            Petitions.fetch();
		},

        listPetitionVotes: function( id, query ){

            var currentPetition;
            if ( this.appView.childView ){
                currentPetition = this.appView.childView.model;
            }else{
                var Petition = require('module/petition/model/petitionModel');
                currentPetition = new Petition({"ID" : id});
                currentPetition.set("unfold", 1);
                currentPetition.set("doPetitionLoad", 1);
                currentPetition.fetch();
            }
            this.appView.addChildView({
                module: 'petition',
                type:   'votes',
                settings: {
                    petition: currentPetition,
                    petitionID: id
                }
            });

        },

/*-----------------------
    Organization routes
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
		},

/*
 * User profile routes
 */ 
        userProfile: function(){
            var User = this.appView.User;
            var mode = User ? 'profile' : 'LogIn';
            this.appView.addChildView({
                module: 'petition',
                type:   'user',
                settings: { 
                    model: User,
                    'mode': mode
                }
            });
            
            User.getProfile();

        },


	});



});

define(function (require) {
    'use strict';
    var $ = require('jquery'),
        _ = require('underscore'),
        Backbone = require('backbone'),
        petitionMenu = require('text!common/templates/petitionMenu'),
        pollMenu = require('text!common/templates/pollMenu'),
        appFrame = require('text!common/templates/appFrame'),
        PetitionView = require('module/petition/view/petitionView'),
        PetitionsView = require('module/petition/view/petitionsView'),

        OrganizationView = require('module/organization/view/organizationView'),
        OrganizationsView = require('module/organization/view/organizationsView'),
		Organizations	 = require('module/organization/collection/organizationCollection'),
		Categories		 = require( 'module/petition/collection/petitionCategoryCollection' )
		;

    return Backbone.View.extend({
        className: 'app',

        template: _.template(appFrame),

        moduleNode: '#module-content',

        events: {
            'click span#search': 'openSearch',
            'click button#find': 'find',
            'click button#custom-search': 'find',
            'click button#show-all-petitions': 'showAllPetitions',
            'click button#show-all-partners': 'showAllPartners',
			'click input#id-search-in-organization': 'showOrganizations',
			'click input#id-search-in-category' : 'showCategories',
        },

        render: function () {
            this.$el.html(this.template());
            $('#content').append(this.$el);
            return this;
        },

        menues: {
            petition: petitionMenu,
            poll: pollMenu,
            organization: petitionMenu,
        },

        subviews: {
            petition: PetitionView,
            petitions: PetitionsView,
    
            organization: OrganizationView,
            organizations: OrganizationsView,
        },

        setModuleMenu: function () {
			var type = this.menuType;
            var menu = _.template(this.menues[type], {data: this});
            this.$('div.submenu').html(menu);
            this.submenu = type;
        },

        removeModuleMenu: function () {
            this.$('div.submenu').empty();
            this.submenu = null;
        },

        addChildView: function (view) {
            if (this.childView) {
                this.cleanUp();
            }
            if (!this.submenu) {
				this.menuType = view.module;

				//TODO: Code below need to be removed/generalized so it 
				// support loading of required components for menu for 
				// different modules
				//
				//Loading Organizations and Categories for petition menu
				this.OrganizationsList = new Organizations();
				this.CategoriesList = new Categories();
				//run setModuleMenu once OrganizationsList and CategoriesList are loaded
	            this.onceAll ( [this.OrganizationsList, this.CategoriesList ], 'sync', this.setModuleMenu, this );
				
//              this.setModuleMenu();
            }
            var View = this.subviews[view.type];
            var subView = new View(view.settings);
            this.childView = subView;
            subView.parentView = this;
        },

        openSearch: function () {
            $('input[name=search_for]').show();
            $('button[id=find]').show();
        },

        find: function () {
            event.preventDefault();
			
			var searchFor = '', 
			searchText = '', 
			searchOrganization = '', 
			searchCategory = '', 
			searchInNew = '';
		
			if ( $('input[name=search_for]').val() ){	
				searchText = 'Text=' + $('input[name=search_for]').val();
			}

			if ( $('input[name=search-in-new]').prop('checked') ){
				searchInNew = '&showNewPetitions=true';
			}

			if ( $('input[name=search-in-category').prop('checked') ){
				searchCategory = '&CategoryID=' + $('input[name=search-category]:checked').val();
			}
		
			if ( $('input[name=search-in-organization').prop('checked') ){
				searchOrganization = '&OrganizationID=' + $('input[name=search-organization]:checked').val();
			}
			searchFor =  searchText + searchCategory + searchOrganization + searchInNew;

            this.router.navigate('/petition/search/'+searchFor, true);

        },

        showAllPetitions: function () {
            this.router.navigate('/petition', true);
        },

      showAllPartners: function () {
        this.router.navigate('/organization', true);
      },

		showOrganizations: function () {
			if ( event.target.checked ){


			}
		},

		showCategories: function (){
			if (event.target.checked ){

				
			}
		},

        onceAll: function(sources, eventName, handler, context){
            handler = _.after( sources.length, handler);
            context = context || this;
            _.each(sources, function(source){
				source.fetch();
                source.once(eventName, handler, context)
            });
        },

        //Clean
        cleanUp: function () {
            if (this.childView) {
                this.childView.remove();
                this.childView.unbind();
            }
            this.searchActive = false;
            this.childView = null;
        }
    });
});

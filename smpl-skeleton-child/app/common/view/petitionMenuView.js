define ( function(require){
    'use strict';

    var $   = require('jquery'),
    _       = require('underscore'),
    Backbone= require('backbone'),    
    petitionMenu = require('text!common/templates/petitionMenu'),
    OrganizationView = require('module/organization/view/organizationView'),
    OrganizationsView = require('module/organization/view/organizationsView'),
	Organizations	 = require('module/organization/collection/organizationCollection'),
	Categories		 = require( 'module/petition/collection/petitionCategoryCollection' )
	;


    return Backbone.View.extend({

		template: _.template(petitionMenu),

		pagingSettings: {
			OrderBy: 'name',
			OrderDirection: 'ASC',
			PageNumber: 1,	
			PageSize: 20,
		},

		initialize: function( data ){
			this.parentView = data.parentView;

			this.OrganizationsList = new Organizations();
			this.CategoriesList = new Categories();

			//render view once OrganizationsList and CategoriesList are loaded
	        this.onceAll ( [this.OrganizationsList, this.CategoriesList ], 'sync', this.render, this );
		},
		
		events: {		
            'click button#find': 'find',
			'change input#search-advanced-checkbox' : 'toggleAdvancedSearchPanel',
            'click button#show-all-petitions': 'showAllPetitions',
            'click button#show-all-partners': 'showAllPartners',
		},

        render: function () {
            this.$el.html(this.template({data: this}));
			this.parentView.appendSubmenu();
            return this;
        },

        showAllPetitions: function () {
            this.parentView.router.navigate('/petition', true);
        },

		showAllPartners: function () {
			this.parentView.router.navigate('/organization', true);
		},

        find: function () {
			var searchFor = '', 
			searchText = 'Text=', 
			searchOrganization = '', 
			searchCategory = '', 
			searchInNew = '',
			searchInActive = '',
			searchInOrganizations = '', 
			searchInCategories = '', 
			searchInPetitions = '', 
			searchInNew = '',
			createDateStart = '',
			createDateEnd = '',
			finishDateStart = '',
			finishDateEnd = '';
			
			if ( $('input[name=search-for]').val() ){	
				searchText += $('input[name=search-for]').val();
			}

			if ( $('input[name=search-in-organization]').prop('checked') ){
				searchInOrganizations = '&SearchInOrganizations=true';
			}
			if ( $('input[name=search-in-petitions]').prop('checked') ){
				searchInPetitions = '&SearchInPetitions=true';
			}
			if ( $('input[name=search-in-category]').prop('checked') ){
				searchInCategories = '&SearchInCategories=true';
			}
			if ( $('input[name=search-in-active]').prop('checked') ){
				searchInActive = '&ShowActivePetitions=true' ;
			}
			if ( ! $('input[name=search-in-active]').prop('checked') ){
				searchInActive = '&ShowActivePetitions=false' ;
			}

			if ( $('input[name=search-in-new]').prop('checked') ){
				searchInNew = '&showInactivePetitions=true';
			}

			$('input[name^=search-category-]').each( function(){
				if ( $(this).prop('checked') ){
					searchCategory += '&CategoryID=' + $(this).val();
				}
			});

			
			if ( $('input[name=search-in-date-creation-from]') ){
				createDateStart = '&CreatedDateStart=' + $('input[name=search-in-date-creation-from]').val();
			}
			if ( $('input[name=search-in-date-creation-to]') ){
				createDateEnd = '&CreatedDateEnd=' + $('input[name=search-in-date-creation-to]').val();
			}
			if ( $('input[name=search-in-date-finish-from]') ){
				finishDateStart = '&FinishDateStart=' + $('input[name=search-in-date-finish-from]').val();
			}
			if ( $('input[name=search-in-date-finish-to]') ){
				finishDateEnd = '&FinishDateEnd=' + $('input[name=search-in-date-finish-to]').val();
			}
	
			var pagingSettings='';
			_.each(this.pagingSettings, function( val, key, list){
				pagingSettings += '&' + key + '=' + val;			
			});
	
			searchFor =  searchText + 
						searchCategory + 
						searchOrganization + 
						searchInOrganizations +
						searchInPetitions + 
						searchInCategories + 
						searchInNew +
						searchInActive +
						createDateStart +
						createDateEnd +
						finishDateStart +
						finishDateEnd + 
						pagingSettings
						;

            this.parentView.router.navigate('/petition/search/'+searchFor, true);

        },

        onceAll: function(sources, eventName, handler, context){
            handler = _.after( sources.length, handler);
            context = context || this;
            _.each(sources, function(source){
				source.fetch();
                source.once(eventName, handler, context)
            });
        },

		toggleAdvancedSearchPanel: function(){
			if ( $('#search-advanced-checkbox').prop('checked') ){
				$('div#search-advanced').show();
			}else{
				$('div#search-advanced').hide();
			}
		},

		close: function(){
			this.remove();
			this.unbind();
		}

    }); 

});


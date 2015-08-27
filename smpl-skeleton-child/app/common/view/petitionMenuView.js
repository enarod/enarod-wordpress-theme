define ( function(require){
    'use strict';

    var $   = require('jquery'),
    _       = require('underscore'),
    Backbone= require('backbone'),    
    petitionMenu = require('text!common/templates/petitionMenu'),
    OrganizationView = require('module/organization/view/organizationView'),
    OrganizationsView = require('module/organization/view/organizationsView'),
	Organizations	 = require('module/organization/collection/organizationCollection'),
	Categories		 = require('module/petition/collection/petitionCategoryCollection' )
	;


    return Backbone.View.extend({

		template: _.template(petitionMenu),

		pagingSettings: {
			OrderBy: 'Subject',
			OrderDirection: 'ASC',
			PageNumber: 1,	
			PageSize: 10,
		},

		initialize: function( data ){
			this.parentView = data.parentView;

			this.OrganizationsList = new Organizations();
			this.CategoriesList = new Categories();

			//render view once OrganizationsList and CategoriesList are loaded
	        this.onceAll ( [this.OrganizationsList, this.CategoriesList ], 'sync', this.render, this );
			this.listenTo ( this.parentView, 'hasPaging', this.togglePagingSettings );
			this.listenTo ( this.parentView, 'cleanup', this.resetPageNumber );
		},
		
		events: {		
            'click button#find'					: 'find',
            'click button#show-all-petitions'	: 'showAllPetitions',
            'click button#show-all-partners'	: 'showAllPartners',
			'click button#show-more'			: 'showMore',
			'change [name=items-per-page]'		: 'updatePageSize',
			'change [name=order-by]'			: 'updateOrderBy',
			'change [name=order-direction]'		: 'updateOrderDirection',
			'change [name=search-for]'			: 'resetPageNumber',
			'change [name*=search-in-]'			: 'resetPageNumber',
			'change input#search-advanced-checkbox' : 'toggleAdvancedSearchPanel',
			'submit form'						: 'findOnEnter',
            'click button#login'                : 'userLogIn',
            'click button#logout'               : 'userLogOut',
		},

        render: function () {
            this.$el.html(this.template({data: this}));
			this.parentView.appendSubmenu();
			this.togglePagingSettings( this.parentView.subMenuPaging );
            this.logStatusChanged();
            return this;
        },

        showAllPetitions: function () {
            this.parentView.router.navigate('/petition', true);
        },

		showAllPartners: function () {
			this.parentView.router.navigate('/organization', true);
		},

		togglePagingSettings: function( hasPaging ){
			$('#paging-settings, #app-footer, #div-search').toggle(hasPaging);
		},

		/*---------------------------
			Change paging settings
		---------------------------*/
		updatePageSize: function(){
			this.pagingSettings.PageSize = $('[name=items-per-page] option:selected').val();
			this.resetPageNumber();
			this.find();
		},

		updateOrderBy: function(){
			this.pagingSettings.OrderBy = $('[name=order-by] option:selected').val();
			this.resetPageNumber();
			this.find();
		},

		updateOrderDirection: function(){
			this.pagingSettings.OrderDirection = $('[name=order-direction]:checked').val();
			this.resetPageNumber();
			this.find();
		},

		showMore: function(){
			this.pagingSettings.PageNumber++;
			var query = this.prepareSearchQuery();

			return query;
		},

		resetPageNumber: function(){
			this.pagingSettings.PageNumber = 1;
		},

		/*--------------------------
			Petition search action
 		--------------------------*/
		findOnEnter: function(ev){
			ev.preventDefault();
			this.find();
		}, 

        find: function () {
			var searchFor = this.prepareSearchQuery();
            this.parentView.router.navigate('/petition/search/'+searchFor, true);

        },

		prepareSearchQuery: function(){
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

			return searchFor;
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

        /*------------------------------
         * Handling user authentication
         *-----------------------------*/
        userLogIn: function(){
            this.parentView.addUser();
			this.listenTo ( this.parentView.User, 'loggedIn', this.logStatusChanged );
        },


        userLogOut: function(){
            this.parentView.removeUser();
            this.logStatusChanged();
        },

        logStatusChanged: function(){
            if ( this.parentView.User ){
                $('#logout').show();
                $('#login').hide();
            }else{
                $('#logout').hide();
                $('#login').show();
            }
        }, 

        logOuthanges: function(){
        },


		close: function(){
			this.remove();
			this.unbind();
		}

    }); 

});


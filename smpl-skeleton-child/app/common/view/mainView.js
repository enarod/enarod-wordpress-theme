define(function (require) {
    'use strict';
    var $ = require('jquery'),
        _ = require('underscore'),
        Backbone = require('backbone'),
        pollMenu = require('text!common/templates/pollMenu'),
        appFrame = require('text!common/templates/appFrame'),

		PetitionMenu = require('common/view/petitionMenuView'),
        PetitionView = require('module/petition/view/petitionView'),
        PetitionsView = require('module/petition/view/petitionsView'),

        OrganizationView = require('module/organization/view/organizationView'),
        OrganizationsView = require('module/organization/view/organizationsView'),

        User             = require('module/user/model/userModel'),
        UserView         = require('module/user/view/userView'),

        ReCaptcha   = require('recaptcha')
		;

    return Backbone.View.extend({
        className: 'app',

        template: _.template(appFrame),

        moduleNode: '#module-content',
		
		submenuNode: '.submenu',

        events: {
			'click #show-more' : 'showMore',
		},

        render: function () {
            this.$el.html(this.template());
            $('#content').append(this.$el);
            return this;
        },

        menues: {
            petition: PetitionMenu,
            poll: pollMenu,
            organization: PetitionMenu,
        },

        subviews: {
            petition: PetitionView,
            petitions: PetitionsView,
    
            organization: OrganizationView,
            organizations: OrganizationsView,
        },

        setModuleMenu: function () {
			this.submenuNode = '.submenu';
			var submenuView = this.menues[this.menuType];
			this.submenu = new submenuView ( { parentView: this } );
        },

		/*
		 Once submenu view rendered append it to mainView
 		*/
		appendSubmenu: function(){
			this.$(this.submenuNode).append(this.submenu.$el);
		},

        removeModuleMenu: function () {
			this.submenu.close();
            this.submenu = null;
        },

        addChildView: function (view) {
            $('#spinner').show();

			this.subMenuPaging = ( view.hasPaging ? view.hasPaging : false );
			this.trigger( 'hasPaging', this.subMenuPaging );

            if (this.childView) {
                this.cleanUp();
            }
            if (!this.submenu) {
				this.menuType = view.module;
				this.setModuleMenu();
            }
            var View = this.subviews[view.type];
            var subView = new View(view.settings);
            this.childView = subView;
            subView.parentView = this;
        },

		showMore: function(){
            $('#spinner').show();

			var query = this.submenu.showMore();
            var PetitionCollection  = require ('module/petition/collection/petitionCollection');
            var Petitions = new PetitionCollection({search: query});
			this.morePetitions = Petitions;
			this.listenTo ( Petitions, 'sync', this.readyForAppend );
			Petitions.fetch();
		},

		readyForAppend: function(){
			this.trigger( 'appendPetitions', this.morePetitions );
		},

        //User handling
        addUser: function(){
            this.User = new User();
            var view = new UserView({
                model: this.User, 
                mode: 'logIn', 
                parentView: this
            });
            view.render();
        },

        removeUser: function(){
            this.User = undefined;
        },

        //Captcha handling
        addCaptcha: function( idSelector ){
            grecaptcha.render(
                idSelector,
                {
                    theme: 'clean', 
                    sitekey: RECAPTCHA_SITEKEY
                }
            );                

        },

        //Clean
        cleanUp: function () {
			this.trigger( 'cleanup' );
            if (this.childView) {
                this.childView.remove();
                this.childView.unbind();
            }
            this.searchActive = false;
            this.childView = null;
        }
    });
});

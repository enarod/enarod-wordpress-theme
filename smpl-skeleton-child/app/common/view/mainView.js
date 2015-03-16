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
        OrganizationsView = require('module/organization/view/organizationsView')
		;

    return Backbone.View.extend({
        className: 'app',

        template: _.template(appFrame),

        moduleNode: '#module-content',
		
		submenuNode: '.submenu',

        events: { },

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

//        toggleAdvanced: function () {
//            $('#search-advanced').toggle($(event.target.checked));
//        },

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

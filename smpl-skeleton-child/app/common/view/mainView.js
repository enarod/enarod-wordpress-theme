define(function (require) {
    'use strict';

    var $ = require('jquery'),
        _ = require('underscore'),
        Backbone = require('backbone'),
        petitionMenu = require('text!common/templates/petitionMenu'),
        pollMenu = require('text!common/templates/pollMenu'),
        appFrame = require('text!common/templates/appFrame'),
        PetitionView = require('module/petition/view/petitionView'),
        PetitionsView = require('module/petition/view/petitionsView');

    return Backbone.View.extend({
        className: 'app',
        template: _.template(appFrame),
        moduleNode: '#module-content',
        events: {
            'click span#search': 'openSearch',
            'click button#find': 'find',
            'click button#show-all-petitions': 'showAllPetitions',
        },
        render: function () {
            this.$el.html(this.template());
            $('#content').append(this.$el);
            return this;
        },
        menues: {
            petition: petitionMenu,
            poll: pollMenu
        },
        subviews: {
            petition: PetitionView,
            petitions: PetitionsView
        },
        setModuleMenu: function (type) {
            var menu = _.template(this.menues[type]);
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
                this.setModuleMenu(view.module);
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

            var searchFor = $('input[name=search_for]').val();
            this.router.navigate('/petition/search');

            var PetitionCollection  = require ('module/petition/collection/petitionCollection');
            var Petitions = new PetitionCollection({search: searchFor});
        
            this.addChildView({
                module: 'petition',
                type : 'petitions', 
                settings : {petitions : Petitions} 
            }); 
            Petitions.fetch();
        },
        showAllPetitions: function () {
            this.router.navigate('/petition', true);
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

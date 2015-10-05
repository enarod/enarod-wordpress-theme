define(function(require){
    'use strict';

    var _   = require('underscore'),
    $       = require('jquery'),
    Backbone= require('backbone'),
    VotesCollection = require ( 'module/petition/collection/petitionVoteCollection'),
    Template= require('text!modules/petition/templates/petitionVotes.html');

    return Backbone.View.extend({

        pagingSettings:{
            PageSize: 50,
            OrderBy: 'voteDate',
            OrderDirection: 'ASC',
            PageNumber: 1
        },

        initialize: function(options){
            this.petitionID = options.petitionID;
            this.votes = new VotesCollection({
                petitionID: this.petitionID
            });

            this.resetPageNumber();

            this.loadVotes();

            this.listenTo(this.votes, 'sync', this.render);
        },

        events: {
			'click button#votes-show-more'			: 'showMore',
			'change [name=votes-items-per-page]'	: 'updatePageSize',
			'change [name=votes-order-by]'			: 'updateOrderBy',
			'change [name=votes-order-direction]'	: 'updateOrderDirection',
        },

        render: function(){
            if ( this.pagingSettings.PageNumber == 1 ){
                this.template = _.template(Template);
                this.$el.html(this.template( ) );
                $(this.parentView.moduleNode).append(this.$el);
            }

            this.appendVotes();

            $('#spinner').hide();

            return this;
        },

        appendVotes: function(){
            _.each(this.votes.models, function(el, idx, list){
                $('#votes-list').append(
                '<li>'+el.get('Name')+' ( дата підпису: '+el.get('VoteDate')+' )</li>'
                );
            });
        },

        showMore: function(){
            this.pagingSettings.PageNumber++;
            this.loadVotes();
        },

        updatePageSize: function(){
			this.pagingSettings.PageSize = $('[name=votes-items-per-page] option:selected').val();
			this.resetPageNumber();
			this.loadVotes();
        },

        resetPageNumber: function(){
            this.pagingSettings.PageNumber = 1;
        },

        updateOrderBy: function(){
			this.pagingSettings.OrderBy = $('[name=votes-order-by] option:selected').val();
			this.resetPageNumber();
			this.loadVotes();
        },

        updateOrderDirection: function(){
			this.pagingSettings.OrderDirection = $('[name=votes-order-direction]:checked').val();
			this.resetPageNumber();
			this.loadVotes();
        },

        loadVotes: function(){
            this.votes.search = this.getPageSettings();
            this.votes.fetch();
        },

        getPageSettings: function(){
            var settings='';

            _.each(this.pagingSettings, function(val, key, list){
                settings += key+'='+val+'&';
            });

            return settings;
        },

        close: function(){
            this.remove();
            this.unbind();
        }
    
    });

});

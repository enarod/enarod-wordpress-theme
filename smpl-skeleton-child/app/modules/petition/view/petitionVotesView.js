define(function(require){
    'use strict';

    var _   = require('underscore'),
    $       = require('jquery'),
    Backbone= require('backbone'),
    VotesCollection = require ( 'module/petition/collection/petitionVoteCollection'),
    Template= require('text!modules/petition/templates/petitionVotes.html');

    return Backbone.View.extend({

        initialize: function(options){
            this.defaultPagingSettings();

            this.petition = options.petition;
            this.votes = new VotesCollection({
                petitionID: this.petition.get('ID')
            });

            if ( !this.petition.get('doPetitionLoad') ){
                this.votes.petitionId = this.petition.get('ID');
                this.listenTo(this.votes, 'sync', this.render);
            }else{
                this.votes.petitionId = options.petitionID;
                this.onceAll ([
                    this.petition, 
                    this.votes
                    ], 'sync', this.resetEventListen, this );
            }

            this.loadVotes();
        },

        resetEventListen: function(){
            this.stopListening (this.petition, 'sync');
            this.listenTo(this.votes, 'sync', this.render);
            this.render();
        },
        
        defaultPagingSettings: function(){
            this.pagingSettings = {
                PageSize: 50,
                OrderBy: 'voteDate',
                OrderDirection: 'ASC',
                PageNumber: 1
            };
        },
        

        events: {
			'click button#votes-show-more'			: 'showMore',
			'change [name=votes-items-per-page]'	: 'updatePageSize',
			'change [name=votes-order-by]'			: 'updateOrderBy',
			'change [name=votes-order-direction]'	: 'updateOrderDirection',
        },

        render: function(){
            if ( !this.alreadyLoaded ){
                this.template = _.template(Template);
                this.$el.html( this.template() );
                $(this.parentView.moduleNode).append(this.$el);

                this.alreadyLoaded = true;
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
            this.cleanUpList();
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
            $('#spinner').show();
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

        cleanUpList: function(){
           $('ul#votes-list>li').remove(); 
        },

        onceAll: function(sources, eventName, handler, context){
            handler = _.after( sources.length, handler);
            context = context || this;
            _.each(sources, function(source){
                source.once(eventName, handler, context)
            });
        },

        close: function(){
            this.remove();
            this.unbind();
        }
    
    });

});

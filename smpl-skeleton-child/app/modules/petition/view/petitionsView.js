define(function(require){
    'use strict';
    var $	= require('jquery'),
        _		= require('underscore'),
        Backbone= require('backbone'),
        PagingSettings	= require('text!module/petition/templates/petitionPagingSettings.html'),
        MorePetitionBtn	= require('text!module/petition/templates/morePetitionButton.html'),
        PetitionView	= require ('module/petition/view/petitionView');
    return Backbone.View.extend({
        className: 'petition-item',
        initialize: function( options ){
            this.petitions = options.petitions;
            this.petitionsViewList = [];
            this.listenTo(this.petitions, 'sync', this.render);
        },
		events:{
			'click [id=show-more]' : 'showMorePetitions'

		},
        render: function(){
            if ( this.petitions.length == 0 ){
                var message = $(document.createElement('div')).html(
                    '&nbsp;На жаль, не вдалося знайти петиції які відповідають Вашому запиту.'
                ).addClass('alert alert-info').prepend(
                    $(document.createElement('span')).addClass('glyphicon glyphicon-info-sign')
                );
                $('#module-content', this.parentView.el).append(message);
                this.parentView.router.on('route', function() {
                    message.remove();
                })
            }else{
//				$(this.parentView.moduleNode).append( _.template(PagingSettings) );

                var parentView = this.parentView;
                this.petitions.each(function(petition){
                    var item = new PetitionView ({ tmpl: 'item', model: petition });
                    item.parentView = parentView;
                    item.render();
                    this.petitionsViewList.push(item);
                }, this);
	
//				$( this.parentView.moduleNode ).append( _.template(MorePetitionBtn) );

            }
        },

		showMorePetitions: function(){
console.log('show more petitions');
		},		

        remove: function(){
            _.each( this.petitionsViewList, function (petition){
                petition.remove();
            });
			$('#page-settings').remove();
        },
        unbind: function(){
            _.each( this.petitionsViewList, function (petition){
                petition.unbind();
            });
            this.petitionsViewList = [];
        }
    });
});


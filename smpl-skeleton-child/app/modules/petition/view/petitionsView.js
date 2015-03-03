define(function(require){
    'use strict';
    var $	= require('jquery'),
        _		= require('underscore'),
        Backbone= require('backbone'),
        PetitionView	= require ('module/petition/view/petitionView');
    return Backbone.View.extend({
        className: 'petition-item',
        initialize: function( options ){
            this.petitions = options.petitions;
            this.petitionsViewList = [];
            this.listenTo(this.petitions, 'sync', this.render);
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
                var parentView = this.parentView;
                this.petitions.each(function(petition){
                    var item = new PetitionView ({ tmpl: 'item', model: petition });
                    item.parentView = parentView;
                    item.render();
                    this.petitionsViewList.push(item);
                }, this);
            }
        },
        remove: function(){
            _.each( this.petitionsViewList, function (petition){
                petition.remove();
            });
        },
        unbind: function(){
            _.each( this.petitionsViewList, function (petition){
                petition.unbind();
            });
            this.petitionsViewList = [];
        }
    });
});


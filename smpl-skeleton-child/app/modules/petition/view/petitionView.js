define( function(require){
    'use strict';
    var $	= require('jquery'),
        _		= require('underscore'),
        Backbone= require('backbone'),
        SignatureSelector	= require('module/signature/view/signatureSelectorView'),
        Petition		= require('text!module/petition/templates/petition.html'),
        PetitionNew		= require('text!module/petition/templates/petitionNew.html'),
        PetitionItem	= require('text!module/petition/templates/petitionItem.html');

    return Backbone.View.extend({
        initialize: function(data) {
            if (data.tmpl === 'new') {
                this.tmpl = PetitionNew;
                this.onceAll ( [this.model.get( 'categoryList' ), this.model.get( 'levelList' ), this.model.get ('regionList') ], 'sync', this.render, this );
            } else if (data.tmpl === 'item'){ // this.render triggered by collection view (petitionsView.js)
                this.tmpl = PetitionItem;
            } else if (data.tmpl === 'petition'){
                this.tmpl = Petition;
                this.listenTo(this.model, 'sync', this.render);
            }
        },

        events:{
            'click input[id=sign]':             'sign',
            'click input[id=publish_petition]': 'publishPetition',
            'click input[name=petition-level]': 'openRegionList'
        },

        render: function() {
            this.template = _.template(this.tmpl);
            this.$el.html(this.template( this.model.attributes ) );
            $(this.parentView.moduleNode).append(this.$el);
            if ( this.model.attributes.state ){
                this.checkState( this.model.get('state') );
            }
            return this;
        },

        sign: function() {
            var view = new SignatureSelector( {petitionID : this.model.get('ID')} );
            view.render();
        },

        publishPetition: function() {
            var mail = $('#email').val();
            if (mail.length > 0 ){
                this.model.set({
                    Subject         :   $('#subject').val(),
                    AddressedTo     :   $('#recipient').val(),
                    Text            :   $('#description').val(),
                    Requirements    :   JSON.stringify($('#requirements').val()),
                    Category        :   { Name  : $('input[name=petition-category]:checked').val() },
                    Level           :   { ID    : $('input[name=petition-level]:checked').val() },
                    KeyWords        :   $('#keywords').val().split(','),
                    Email           :   mail
                
                }); 
                delete this.model.attributes.ID;
                
                this.model.save();
                this.listenTo(this.model, 'sync', this.openStoredPetition);
            }else{
                alert('������ ����-����� ��� email.');
            }
        },

        openStoredPetition: function(){
        //TODO: Change below, so ID was reachable easily
        var id = this.model.attributes.Data.ID;
            this.parentView.router.navigate('/petition/'+id,true);
        },

        openRegionList: function(){
            console.log('open region list');
            console.log(event.target.value);
            var region_id = event.target.value;
            if (region_id == 3){

            }
        },

        checkState: function(state) {
            if (state=='alreadyVoted') {
                alert("Ваш голос вже було раніше зараховано!");
            } else if ( state == 'voteConfirmed' ){
                alert("Ваш голос зараховано!");
            } else if ( state == 'error' ){
                alert("Сталася помилка!");
            }
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


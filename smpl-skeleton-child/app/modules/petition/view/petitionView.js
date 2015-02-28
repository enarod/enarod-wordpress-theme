define( function(require){
    'use strict';
    var $	= require('jquery'),
        _		= require('underscore'),
        Backbone= require('backbone'),
        SignatureSelector	= require('module/signature/view/signatureSelectorView'),
        OrganizationView	= require('module/organization/view/organizationView'),
        Petition		= require('text!module/petition/templates/petition.html'),
        PetitionNew		= require('text!module/petition/templates/petitionNew.html'),
        PetitionItem	= require('text!module/petition/templates/petitionItem.html');

    return Backbone.View.extend({
        initialize: function(data) {
            if (data.tmpl === 'new') {
                this.tmpl = PetitionNew;
                this.onceAll ([
					this.model.get( 'categoryList' ), 
					this.model.get( 'levelList' ), 
					this.model.get( 'regionList'),
					this.model.get( 'organizationList')
					], 'sync', this.render, this );
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
            'click input[name=petition-level]': 'openRegionList',
			'change [name=organization]'	  : 'updateOrganization',
        },

        render: function() {
            this.template = _.template(this.tmpl);
            this.$el.html(this.template( this.model.attributes ) );
            $(this.parentView.moduleNode).append(this.$el);
            if ( this.model.attributes.state ){
                this.checkState( this.model.get('state') );
            }
		
			if ( this.model.get('organizationID') ){
				var orgID = this.model.get('organizationID');
				$('[name=organization]').val(this.model.get('organizationID'));
				var Organization;
				_.each (this.model.get('organizationList').models, function(el, index, list){
					if ( el.get('ID') == orgID ){
						Organization = el;
					}
				});

				this.model.set( 'Organization', Organization );
				this.addOrganizationView();
				this.model.unset('organizationID');
			}
	
            return this;
        },

        sign: function() {
            var view = new SignatureSelector( {petitionID : this.model.get('ID')} );
            view.render();
        },

        publishPetition: function() {
			this.setModelParameters();

            var view = new SignatureSelector( {
							signator: this.model.get("Author") 
						} );
            view.render();

            this.listenTo(this.model.get("Author"), 'signed', this.storePetition ); //model.save() );
            this.listenTo(this.model, 'sync', this.openStoredPetition);
        },
		
		setModelParameters: function( ){
             this.model.set({
                 Subject         :   $('#subject').val(),
        //         Organization    :   $('#organization').val(),
                 Text            :   $('#description').val(),
                 Requirements    :	 $('#requirements').val(),
                 Category        :   { Name  : $('input[name=petition-category]:checked').val() },
                 Level           :   { ID    : $('input[name=petition-level]:checked').val() },
                 KeyWords        :   $('#keywords').val().split(','),
             }); 
             delete this.model.attributes.ID;

		},

		storePetition: function(){
			this.model.set( 'Email', this.model.get("Author").get("Email") );
			this.model.save();
		},	
	
        openStoredPetition: function(){
        //TODO: Change below, so ID was reachable easily
			var id = this.model.attributes.Data.ID;
            this.parentView.router.navigate('/petition/'+id, true);
        },

        openRegionList: function(){
            console.log('open region list');
            console.log(event.target.value);
            var region_id = event.target.value;
            if (region_id == 3){

            }
        },

		updateOrganization: function( event ){
			var selectedOrgIndex = event.target.selectedIndex - 1;
			this.model.set("Organization", this.model.get('organizationList').models[selectedOrgIndex]);
			this.addOrganizationView();
		},

		addOrganizationView: function(){
			if (this.childView ){
				this.childView.close();
			}

			this.childView = new OrganizationView ( {model: this.model.get('Organization'), tmpl: 'organizationInPetition'} );
			this.moduleNode = '#organization-details';
			this.childView.parentView = this;
			this.childView.render();	
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


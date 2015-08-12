define( function(require){
    'use strict';
    var $	= require('jquery'),
        _		= require('underscore'),
		zClip   = require('zclip'),
		stickit	= require('stickit'),
        Backbone= require('backbone'),
        SignatureSelector	= require('module/signature/view/signatureSelectorView'),
        OrganizationView	= require('module/organization/view/organizationView'),
        Petition		= require('text!module/petition/templates/petition.html'),
        PetitionNew		= require('text!module/petition/templates/petitionNew.html'),
        PetitionItem	= require('text!module/petition/templates/petitionItem.html'),
		PetitionWidgetPage = require('text!module/petition/templates/petitionWidgetPage.html');

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
            }else if ( data.tmpl === 'widget' ){
				this.tmpl = PetitionWidgetPage;
				this.listenTo(this.model, 'sync', this.render);
			}
        }, 

		bindings:{
			'[name=Organization]' : {
				observe: 'Organization',
				setOptions: {
					validate: true
				},
				onGet: function(value, option){
					if ( value !== undefined ){
						return  value.get('ID') ;
					}else{ 
						return undefined ;
					}
				},
				onSet: function(value, option){
					if ( value && value !== '' ){
						return this.model.setOrganization(value);
					}else if (value == '' ){
						if (this.childView ){
							this.childView.close();
						}
						return undefined;
					}else{
						return undefined;
					}
				},
				getVal: function($el, event, options){
					return $el.val();
				}, 
				update: function($el, val, model, options){
					if (val){
						$el.val(val);
						this.addOrganizationView(val);
					}
				},
			},
			'[name=Subject]': {
				observe: 'Subject',
				setOptions: {
					validate: true
				}
			},
			'[name=Text]': {
				observe: 'Text',
				setOptions: {
					validate: true
				}
			},
			'[name=Requirements]': {
				observe: 'Requirements',
				setOptions: {
					validate: true
				}
			},
			'[name=Category]':{
				observe: 'Category',
				setOptions: {
					validate: true
				},
				onSet: function(value, option){
					if ( value && value !== '' ){
						return {Name: value};
					}else{
						return undefined;
					}
				},
			},
			'[name=KeyWords]':{
				observe: 'KeyWords',
				setOptions: {
					validate: true
				},
				onSet: function(value, option){
					if ( value && value !== '' ){
						return value.split(','); 
					}else{
						return undefined;
					}
				},
			},
			
		},

        events:{
            'click input[id=sign]'				: 'sign',
            'click input[id=publish_petition]'	: 'publishPetition',
            'click input[name=petition-level]'	: 'openRegionList',
        },

        render: function() {
            this.template = _.template(this.tmpl);
            this.$el.html(this.template( this.model.attributes ) );
            $(this.parentView.moduleNode).append(this.$el);
            if ( this.model.attributes.state ){
                this.checkState( this.model.get('state') );
            }
		
			if ( this.model.get('organizationID') ){
				this.model.setOrganization( this.model.get('organizationID') );
			}

			if ( $('[name^=copy-to-clipboard-]') ){
				$('[name^=copy-to-clipboard-]').zclip({
					path: '../wp-content/themes/smpl-skeleton-child/app/libs/ZeroClipboard.swf',
					copy: function(ev){
console.log('Here');
						var element = ev.currentTarget.name.replace(/(copy-to-clipboard-)(.*)/, 'source-$2');
						return $('#'+element).text();
					},
				});
			}

			this.stickit( this.model );

            return this;
        },

        sign: function() {
            var view = new SignatureSelector( {petitionID : this.model.get('ID')} );
            view.render();
        },

        publishPetition: function() {
			Backbone.Validation.bind ( this, {
				model	: this.model,
				valid	: function( view, attr, selector ){

					var el	= view.$('[name='+attr+']'),
					group	= el.closest('div.petition-form-item, div.petition-form-textarea');

					group.removeClass('has-error');
					group.find('.help-block').html('').addClass('hidden');

				},
				invalid	: function( view, attr, error, selector ){
					var el	= view.$('[name='+attr+']'),
					group	= el.closest('div.petition-form-item, div.petition-form-textarea');

					group.addClass('has-error');
					group.find('.help-block').html(error).removeClass('hidden');

				}
			} );

			if ( this.model.isValid(true) ){
				delete this.model.attributes.ID;

		        var view = new SignatureSelector( {
							signator: this.model.get("Author")
				} );
			    view.render();

				this.listenTo(this.model.get("Author"), 'signed', this.storePetition ); //model.save() );
				this.listenTo(this.model, 'sync', this.openStoredPetition);
			}else{
			}

        },
		
		storePetition: function(){
			this.unstickit(this.model);
			this.model.set( 'Email', this.model.get("Author").get("Email") );
			this.model.save();
		},	
	
        openStoredPetition: function(){
        //TODO: Change below, so ID was reachable easily
			alert ( this.model.get( "Message" ) );
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

		addOrganizationView: function( val ){

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
            } else if ( state == 'sign' ){
				this.sign();
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
			Backbone.Validation.unbind(this);
            this.remove();
            this.unbind();
        }
    });
});


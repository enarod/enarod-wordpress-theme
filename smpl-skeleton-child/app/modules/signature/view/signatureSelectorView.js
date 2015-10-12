define(
		function(require){
			'use strict';

			var $	= require ('jquery'),
			jqueryui= require ('jqueryui'),
			_		= require ('underscore'),
			Backbone= require ('backbone'),
			emailSignatorModel	= require('module/signature/model/emailSignatorModel'),
			emailSignatureModel	= require('module/signature/model/emailSignatureModel'),
			emailSignatureView	= require('module/signature/view/emailSignatureView'),
			fbSignatureModel	= require('module/signature/model/fbSignatureModel'),

			userModel			= require('module/user/model/userModel'),
			signatureSelector	= require('text!modules/signature/templates/signatureSelector.html')
			;

			return Backbone.View.extend ({
				className: 'signatureSelector',

				initialize: function(data){
					if ( data.petitionID ){
						this.petitionID = data.petitionID;
					}
					if ( data.signator ){
						this.signator = data.signator;
					}
                    if ( data.parentView ){
                        this.parentView = data.parentView;
                    }

				},

				events: {
					'click input#certificate'		: 'selectCertificate',
					'click input#e-mail'			: 'selectEmail', 
					'click input#fb-profile'		: 'selectFB', 
				},

				render: function(){
					var that = this;
					this.template =  _.template(signatureSelector);
					$("div.app").append( $(this.el).html( this.template() ) );
					$('.signatureSelector').dialog({
						modal: true,
						height: 200,
						width: 450,
						title:"Вибрати спосіб голосування",
						closeText: "&times;",
						close: function(){
							that.close();
						}
					});

					return this;
				},

				selectCertificate: function(){
console.log('select certificate');					
				},
				   
				selectEmail: function(){
					if ( !this.signator ){
                        if ( this.parentView.User ){
                            this.signator = new userModel();
                            this.signator.set('mode', 'signingPetition');
                            this.signator.getProfile();
                            this.listenTo(this.signator, 'sync', this.loadEmailSignatureForm)
                        }else{
                            this.signator	= new emailSignatorModel();
                            this.loadEmailSignatureForm();
                        }
					}
				},	

                loadEmailSignatureForm: function(){
                    this.signator.set('Email', this.parentView.User.get('UserEmail')); //Different attr name in models 
                    var signatureModel	= new emailSignatureModel({ 'PetitionID': this.petitionID, 'Signer' : this.signator });
                    var signatureView	= new emailSignatureView({ model: signatureModel });
                    signatureView.parentView = this.parentView;
                    this.close();
                    signatureView.render();
                },

				selectFB: function(){
					if ( !this.signator ){
						this.signator = new userModel();
					}
					this.signator.fbLogIn();
					this.listenTo ( this.signator, 'userProfileReady', this.signWithFB ); 

				},

				signWithFB: function(){
					this.signatureModel	= new fbSignatureModel({ 'PetitionID': this.petitionID, 'Signer' : this.signator });
					this.listenTo ( this.signatureModel, 'sync', this.close );

					this.signatureModel.save();
					
				},

				close: function(){
					$('.signatureSelector').dialog('destroy');
					this.remove();
					this.unbind();

					if ( this.signatureModel && this.signatureModel.get('PetitionID') !== ''){
						if ( typeof this.signatureModel.get('Message') !== undefined ){
							alert ( this.signatureModel.get('Message') );
						} 
					}

				},

			
			});
		
		});

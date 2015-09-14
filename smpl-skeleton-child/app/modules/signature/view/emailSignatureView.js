define(
	function(require){
		'use strict';

		var $	= require('jquery'),
		_		= require('underscore'),
		Backbone= require('backbone'),
		stickit	= require('stickit'),
		emailForm			= require('text!modules/signature/templates/emailForm.html');

		return Backbone.View.extend({
			className: 'emailForm',


			initialize: function(){
				this.listenTo (this.model, 'sync',  this.close );
			},

			events:{
				'click input#vote-with-email'	: 'signWithEmail'
			},

			bindings:{
				'[name=FirstName]' : {
					observe: 'FirstName',
					setOptions: {
						validate: true
					}
				},
				'[name=Email]' : {
					observe: 'Email',
					setOptions: {
						validate: true
					}
				},
				'[name=City]' : {
					observe: 'City',
					setOptions: {
						validate: true
					}
				},
				'[name=Country]' : {
					observe: 'Country',
					setOptions: {
						validate: true
					}
				},
				'[name=AddressLine1]'	: {
					observe : 'AddressLine1',
					setOptions : {
						validate : true
					}
				},
				'[name=AddressLine2]'	: { 
					observe : 'AddressLine2',
					setOptions : { 
						validate : true 
					}
				 },
				'[name=LastName]' : {
					observe : 'LastName',
					setOptions : {
						validate : true
					}
				},
				'[name=MiddleName]' : { 
					observe : 'MiddleName',
					setOptions : {
						validate : true
					}
				},
				'[name=Region]'	: { 
					observe : 'Region',
					setOptions : {
						validate : true
					}
				},
				'[name=ZipCode]'	: { 
					observe : 'ZipCode',
					setOptions : {
						validate : true
					}
				},
				'[name=privacyConfirm]'	: {
					observe : 'privacyConfirm',
					setOptions : {
						validate : true
					}
				}
				
			},

			render: function(){
				var that = this;
				this.template = _.template(emailForm);
				$('div.app').append( $(this.el).html( this.template() ) );
				$('.emailForm').dialog({
					modal: true,
					height: 'auto',
					width: 450,
					title: "Проголосувати через електронну пошту",
					closeText: "&times;",
					close: function(){
						that.close();
					}
				});

//                if ( $('#captcha').length ){
//                    this.parentView.addCaptcha('captcha');
//                }

				this.stickit( this.model.get('Signer') );
				return this;
			},

			signWithEmail: function(){
//				this.setModelParameters (this.model.get('Signer') );
				Backbone.Validation.bind ( this, {
					model	: this.model.get('Signer'),
					valid	: function( view, attr ){
						var el	= view.$('[name='+attr+']'),
						group	= el.closest('div.form-element-group');

						group.removeClass('has-error');
						group.find('.help-block').html('').addClass('hidden');

					},
					invalid	: function( view, attr, error ){
						var el	= view.$('[name='+attr+']'),
						group	= el.closest('div.form-element-group');

						group.addClass('has-error');
						group.find('.help-block').html(error).removeClass('hidden');

					}

				} );

				if ( this.model.get('Signer').isValid(true) ){
                    $('#spinner').show();
					if ( this.model.get('PetitionID') !== '' ){
						this.model.save();
					}else{
						this.model.get('Signer').trigger( 'signed' );
						this.close();
					}
				}
			},	

			setModelParameters: function( model ){
				$('#email-form input').each(function(){
					var name = this.name;
					var val	 = this.value;
					if (this.type == 'checkbox') {
						if (this.checked) {
							model.set( this.name, this.value );
						}
					}
					else {
						model.set( this.name, this.value );
					}
				});
			},
			

			close: function(){
                $('#spinner').hide();
				$('.emailForm').dialog('destroy');
				Backbone.Validation.unbind(this);
				this.remove();
				this.unbind();
				if (this.model.get('ID') !== ''){
					if (typeof this.model.get('Message') !== 'undefined') {
						alert(this.model.get('Message'));
					}
				}
			}
		
		});
	


});

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
				'click input#vote-with-email'	: 'signWithEmail',	
			},

			bindings:{
				'[name=Name]' : {
					observe: 'Name',
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
				'[name=Address1]'	: {
					observe : 'Address1',
					setOptions : {
						validate : true
					}
				},
				'[name=Address2]'	: { 
					observe : 'Address2',
					setOptions : { 
						validate : true 
					}
				 },
				'[name=Surname]' : {
					observe : 'Surname',
					setOptions : {
						validate : true
					}
				},
				'[name=Middle-name]' : { 
					observe : 'Middle-name',
					setOptions : {
						validate : true
					}
				},
				'[name=Area]'	: { 
					observe : 'Area',
					setOptions : {
						validate : true
					}
				},
				'[name=Zip-code]'	: { 
					observe : 'Zip-code',
					setOptions : {
						validate : true
					}
				},
				
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

				this.stickit( this.model.get('Signer') );
				return this;
			},

			signWithEmail: function(){
				this.setModelParameters (this.model.get('Signer') );
				Backbone.Validation.bind ( this, {
					model	: this.model.get('Signer'),
					valid	: function( view, attr ){
						var el	= view.$('[name='+attr+']'),
						group	= el.closest('li');

						group.removeClass('error');
						group.find('.help-block').html('').addClass('hidden');

					},
					invalid	: function( view, attr, error ){
						var el	= view.$('[name='+attr+']'),
						group	= el.closest('li');

						group.addClass('error');
						group.find('.help-block').html(error).removeClass('hidden');

					}

				} );

				if ( this.model.get('Signer').isValid(true) ){
					this.model.save();
				}
			},	

			setModelParameters: function( model ){
				$('ul input').each(function(){
					var name = this.name;
					var val	 = this.value;

					model.set( this.name, this.value );
				});
			},
			

			close: function(){
				$('.emailForm').dialog('destroy');
				Backbone.Validation.unbind(this);
				this.remove();
				this.unbind();
				alert(this.model.get('Message'));
			},
		
		});
	


});

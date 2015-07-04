define(function(require){
	'use strict';

	var $	= require('jquery'),
	_		= require('underscore'), 
	Backbone= require('backbone'),
	logInForm	= require('text!modules/user/templates/userLogInForm.html')
	;

	
	return Backbone.View.extend({
		
				className: 'logInSelector',

				initialize: function(data){
					if (data){
						this.model = data.model;
					}
				},

				events: {
					'click input#fb-login'	: 'fbLogIn',
					'click input#login'		: 'logIn',
				},

				render: function(){
					var that = this;
					this.template =  _.template( logInForm );
					$("div.app").append( $(this.el).html( this.template() ) );
					$('.logInSelector').dialog({
						modal: true,
						height: 350,
						width: 450,
						title:"Вибрати спосіб реєстрації",
						closeText: "&times;",
						close: function(){
							that.close();
						}
					});

					return this;
				},

	
				fbLogIn: function(){
					this.model.fbLogIn(); 
				},

				logIn: function(){
console.log('Log in the system using email!');
				},
		
				close: function(){
					$('.logInSelector').dialog('destroy');
					this.remove();
					this.unbind();
				},
	});

});

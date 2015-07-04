define(function(require){
	'use strict';

	var Backbone	= require('backbone'),
	fb				= require('facebook')
	;

	return Backbone.Model.extend({

		logIn: function(){
console.log('UserModel: logIn function');

		},

		fbLogIn: function(){
			var that = this;

			this.initFBConnection();
			FB.getLoginStatus( function(response){
				that.statusChangeCallback(response);
			});

		},

		initFBConnection: function(){
			FB.init({
				appId: 770731953025405,
				version: 'v2.3'
			});
		},

		statusChangeCallback: function(response){
			var that = this;

			if (response.status === 'connected' ){
				FB.api('/me', function(response){
					//Set User attributes from FB profile
					that.setUserAttributesFB( response );
				});


			}else if ( response.status === 'not_authorized' ){
				console.log('Not autorized!');

			}else{
				FB.login(function(response){
					that.setUserAttributesFB( response );
				}, {scope: 'public_profile,email'});
			}

		},

		setUserAttributesFB: function( response ){
			this.set({
				'FirstName' : response.first_name,
				'LastName'	: response.last_name,
				'Email'		: response.email,
			});

			this.trigger('userProfileReady');

		},


	});
});

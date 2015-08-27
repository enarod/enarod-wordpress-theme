define(function(require){
	'use strict';

	var Backbone	= require('backbone'),
    $   = require('jquery')
    ,
	fb				= require('facebook')
	;

	return Backbone.Model.extend({

        validation: {
			UserEmail	: [
				{
					required: true,
					msg: 'Необхідно ввести Email'
				},
				{
					pattern: 'email',
					msg: 'Слід ввести коректну електронну адресу'
				}
			],
            Password : [
                {
                    required: true,
					msg: 'Необхідно вказати пароль'
                },
                {
                    pattern: /((?=.*\d)(?=.*[a-z])(?=.*[A-Z)(?=.*[@#_\-$]).{8,100})/,
					msg: 'Пароль має складатись щонайменш з 8 символів і \
                        включати одину цифру, одну велику літеру \
                        та один спеціальний символ (-_#@$)'
                }
            ],
            ConfirmPassword : [
                {
                    required: true,
					msg: 'Повторіть введений пароль'
                },
                {
                    equalTo: 'Password',
					msg: 'Введені значення не співпадають'
                },
            ]

        },

        register: function(){
            this.urlRoot = BASE_URL+'Account/Register';
            this.save();
        },

        /*
         * Log in using e-mail
         */
        signIn: function(){
            var that = this;
            $.ajax({
                method: 'POST',
                url: BASE_URL+'Account/Signin',
//                url: 'http://dev.enarod.org/token',
                contentType: 'application/x-www-form-urlencoded',
                accepts: 'application/json',
                data:{
                    grant_type: 'password',
                    username: that.get('UserEmail'),
                    password: that.get('Password')
                },
                success: function( data ){
                    that.logInSuccess(data);
                },
                error: function( data ){
                    that.logInError(data);
                }           
            });    
        },

        logInSuccess: function(data){
            this.set({Token : data});
            this.trigger('loggedIn');
        },

        logInError: function(data){
            var error = JSON.parse(data.responseText).error_description;
            this.trigger( 'logInError', { msg: error} );
        },

        getToken: function(){
            if ( this.get('Token') ){
                return this.get('Token').token_type+' '
                    + this.get('Token').access_token;
            }else{
                return false;
            }
        },


        /*
         * Handling FB user connection
         */           
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

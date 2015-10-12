define(function(require){
  'use strict';

  var Backbone	= require('backbone'),
      $   = require('jquery')
      ,
      fb				= require('facebook'),
      addressRegexp = /^([0-9a-z\u0400-\u04FF]+?)([\s\-\.,:;#u2116]*?)([0-9a-z\u0400-\u04FF\s\-\.,:;#\u2116]*?)$/gi
      ;

  return Backbone.Model.extend({

    initialize: function(){
      FB.init({
        appId: 770731953025405,
        version: 'v2.3'
      });
    },

    getProfile: function(){
      this.url = BASE_URL+'users/current';
      this.fetch();
    },

    parse: function(response){
        return response.Data;
    },

    /*
     * Overloading Backbone.isNew() method. In our case User.ID is not returned
     * by backend (security reason). Instead we using access_token validate if
     * user is stored in DB.
     */
    isNew: function(){
        if ( this.get('Token') ){
            return this.get('Token').access_token ? false : true;
        }else{
            return true;
        }
    },

    validation: {
        UserEmail	: [{
            required: function(){
                return this.get('mode') == 'signingPetition' ? false : true; 
            },
            msg: 'Необхідно ввести Email'
        },
        {
            pattern: 'email',
            msg: 'Слід ввести коректну електронну адресу'
        }],
        Email	: [{
            required: function(){
                return this.get('mode') == 'signingPetition' ? true : false ; 
            },
            msg: 'Необхідно ввести Email'
        },
        {
            pattern: 'email',
            msg: 'Слід ввести коректну електронну адресу'
        }],
        Password : [{
            required: function(){
                if ( this.get('mode') == 'signingPetition'){
                    return false;
                }else if ( this.get('Token') ){
                    return false;
                }else{
                    return true;
                }
            },
            msg: 'Необхідно вказати пароль'
        },
        {
            pattern: /((?=.*\d)(?=.*[a-z])(?=.*[A-Z)(?=.*[@#_\-$]).{8,100})/,
            msg: 'Пароль має складатись щонайменш з 8 символів і \
                включати одину цифру, одну велику літеру \
                та один спеціальний символ (-_#@$)'
        }],
        ConfirmPassword : [{
            required: function(){
                if ( this.get('mode') == 'signingPetition'){
                    return false;
                }else if ( this.get('Token') ){
                    return false;
                }else{
                    return true;
                }
            },
            msg: 'Повторіть введений пароль'
        },
        {
            equalTo: 'Password',
            msg: 'Введені значення не співпадають'
        }],

        FirstName	: [{
            required: true,
            msg: 'Необхідно вказати ім’я'
        },
        {
            pattern: /^([a-z\s\-]+?|[\u0400-\u04FF\s\-]+)$/gi,
            msg: 'Ім’я містить недозволені символи'
        },
        {
            maxLength	: 255,
            msg: 'Ім’я надто довге (максимум 255 символів)'
        }],

        MiddleName : [{
            required	: true,
            msg: 'Необхідно вказати ім’я по-батькові'
        },
        {
            pattern: /^([a-z\s\-]+?|[\u0400-\u04FF\s\-]+)$/gi,
            msg: 'Ім’я по-батькові містить недозволені символи'
        },
        {
            maxLength	: 255,
            msg: 'Значення надто довге (максимум 255 символів)'
        }],

        LastName : [{
            required	: true,
            msg: 'Необхідно вказати прізвище'
        },
        {
            pattern: /^([a-z\s\-]+?|[\u0400-\u04FF\s\-]+)$/gi,
            msg: 'Прізвище містить недозволені символи'
        },
        {
            maxLength	: 255,
            msg: 'Значення надто довге (максимум 255 символів)'
        }],

        AddressLine1 : [{
            required	: false,
            maxLength	: 255,
            msg: 'Значення надто довге (максимум 255 символів)'
        },
        {
            pattern: addressRegexp,
            msg: 'Адреса містить недозволені символи'
        }],

        AddressLine2 : [{
            required	: false,
            maxLength	: 255,
            msg: 'Значення надто довге (максимум 255 символів)'
        },
        {
            pattern: addressRegexp,
            msg: 'Адреса містить недозволені символи'
        }],

        Region	: [{
            required	: true,
            msg: 'Слід вказати область'
        },
        {
            //pattern: /^([a-z\s\-]+?|[\u0400-\u04FF\s\-]+)$/gi,
            pattern: addressRegexp,
            msg: 'Назва області містить недозволені символи'
        },
        {
            maxLength	: 255,
            msg: 'Значення надто довге (максимум 255 символів)'
        }],

        ZipCode:[{
            required	: false,
            maxLength	: 255,
            msg: 'Значення надто довге (максимум 255 символів)'
        },
        {
            pattern: 'digits',
            msg: 'Поштовий індекс містить недозволені символи'
        }],

        Country :[{
            required	: true,
            msg: 'Слід вказати країну'
        },
        {
            pattern: /^([a-z\s\-]+?|[\u0400-\u04FF\s\-]+)$/gi,
            msg: 'Назва країни містить недозволені символи'
        }],

        City	: [{
            required	: false,
            maxLength	: 255,
            msg: 'Значення надто довге (максимум 255 символів)'
        },
        {
            pattern: addressRegexp,						
            msg: 'Назва міста містить недозволені символи'
        }],

        privacyConfirm : {
            required: function(){
                if ( this.get('mode') == 'signingPetition'){
                    return true;
                }else if ( this.get('Token') ){
                    return false;
                }else{
                    return true;
                }
            },
            acceptance: true,
            msg: 'Ваша згода є необхідна для зарахування голосу'
        }

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

    /*
     * Save user profile
     */
    /* evzen.jaskal@gmail.com 
     * Probably won't be necessery, using Backbone.save() method instead
     *
    profileSave: function(){
      var that = this;
      $.ajax({
        method: 'PUT',
        url: BASE_URL+'users/current',
        contentType: 'application/x-www-form-urlencoded',
        accepts: 'application/json',
        data:{
          username: that.get('UserEmail'),
          password: that.get('Password')
        },
        success: function( data ){
          //that.logInSuccess(data);
        },
        error: function( data ){
          //that.logInError(data);
        }
      });
    },
    */

    logInSuccess: function(data){
      this.set({Token : data});
      var that = this;
      localStorage.setItem(
          'edemUser',
          JSON.stringify({
            'Token'     : that.get('Token'),
            'UserEmail' : that.get('UserEmail'),
          })
      );
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

    checkFBLoginState(){
    var that = this;
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

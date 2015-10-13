define(function(require){
  'use strict';

  var $	= require('jquery'),
      _		= require('underscore'),
      Backbone= require('backbone'),
      stickit = require('stickit'),
      logInForm	= require('text!modules/user/templates/userLogInForm.html'),
      registerForm= require('text!modules/user/templates/userRegistrationForm.html'),
      profileForm = require('text!modules/user/templates/userProfilePage.html'),
      restorePasswordForm = require('text!modules/user/templates/restorePasswordForm.html')
      ;


  return Backbone.View.extend({

    className: 'logInSelector',

    initialize: function(data){
      if (data){
        this.model = data.model;
        this.mode = data.mode;
        this.parentView = data.parentView;
      }

      this.listenTo( this.model, 'loggedIn', this.close );
      this.listenTo( this.model, 'logInError', this.logInError );
      this.listenTo( this.model, 'sync', this.render);
    },

    addValidation: function(){
      Backbone.Validation.bind ( this, {
        model	: this.model,
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
    },

    events: {
      'click input#fb-login'	: 'fbLogIn',
      'click input#signIn'	    : 'signIn',
      'click input#signUp'    : 'signUp',
      'click input#register'  : 'register',
      'input input#UserEmail' : 'logInInputChanged',
      'input input#Password'  : 'logInInputChanged',
      'click input#profileSave'  : 'profileSave',
      'click input#openRestorePasswordForm' : 'openRestorePasswordForm',
      'click input#restorePassword' : 'restorePassword',
      'click input#saveNewPassword' : 'saveNewPassword'
    },

    bindings: {
      '#Password': {
        observe: 'Password',
        setOptions: {
          validate: true
        }

      },
      '#UserEmail': {
        observe: 'UserEmail',
        setOptions: {
          validate: true
        }
      },
      '#ConfirmPassword': {
        observe: 'ConfirmPassword',
        setOptions: {
          validate: true
        }
      },

      '[name=FirstName]' : {
          observe: 'FirstName',
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
      this.setTemplate();
      $("div.app").append( $(this.el).html( this.template() ) );

      if ( this.mode != 'profile' ){
        $('.logInSelector').dialog({
          modal: true,
          width: 450,
          closeText: "&times;",
          close: function(){
            that.close();
          }
        });
      }

      if ( $('#captcha').length ){
//  this.parentView.addCaptcha('captcha');
      }

//  FB.XFBML.parse(document.getElementById('fb-login-btn'));

      this.stickit();
      $('#spinner').hide();
      return this;
    },

    setTemplate: function(){
      if ( this.mode == 'logIn' ){
        this.template = _.template(logInForm);
      }else if ( this.mode == 'register' ) {
        this.template = _.template(registerForm);
      }else if ( this.mode == 'profile' ){
        this.template = _.template(profileForm);
      }else if ( this.mode == 'resetPassword'){
        this.template = _.template(restorePasswordForm);
      }
    },


    fbLogIn: function(){
      this.model.fbLogIn();
    },

    signIn: function(){
      $('#spinner').show();
      this.model.signIn();
      $('#spinner').hide();
    },

    signUp: function(){
      $('#spinner').show();
      $('.logInSelector').dialog('destroy');
      this.mode = 'register';
      this.render();
    },

    profileSave: function(){
      this.addValidation();
      if ( this.model.isValid(true) ){
        $('#spinner').show();
        if (this.parentView.PetitionID){
            this.returnPetitionID = this.parentView.PetitionID;
            this.parentView.PetitionID = undefined;
            this.listenTo(this.model, 'sync', this.getBackToPetition);
        }
        this.model.save();
      }

    },

    register: function(){
      this.addValidation();

      if ( this.model.isValid(true) ){
        $('#spinner').show();
        this.listenTo ( this.model, 'sync', this.signIn );
        this.model.register();
      }
    },

    logInInputChanged: function(){
      $('#LogInStatus')
          .addClass('hidden')
          .removeClass('has-error')
          .find('.help-block')
          .html();

      if (
          $('#Password').val().length > 0 &&
          $('#UserEmail').val().length > 0
      ){
        $('#signIn').prop('disabled', false);
      }else{
        $('#signIn').prop('disabled', true);
      }

    },

    logInError: function(data){
      $('#LogInStatus')
          .removeClass('hidden')
          .addClass('has-error')
          .find('.help-block')
          .html(data.msg);
    },

    /*
     * Password modification handling
     */
    openRestorePasswordForm: function(){
      $('.logInSelector').dialog('destroy');
      this.mode = 'resetPassword';
      this.render();
    },

    restorePassword: function(){
console.log('do restore password');    
    },

    saveNewPassword: function(){
console.log('Save new password');
    },

    getBackToPetition: function(){
        this.parentView.router.navigate('#petition/'+this.returnPetitionID, true);
        this.close();
    },

    close: function(){
      if ($('.logInSelector').hasClass("ui-dialog-content")){
          $('.logInSelector').dialog('destroy');
      }  
      this.remove();
      this.unbind();
    }
  });

});

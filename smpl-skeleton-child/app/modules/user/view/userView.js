define(function(require){
  'use strict';

  var $	= require('jquery'),
      _		= require('underscore'),
      Backbone= require('backbone'),
      stickit = require('stickit'),
      logInForm	= require('text!modules/user/templates/userLogInForm.html'),
      registerForm= require('text!modules/user/templates/userRegistrationForm.html'),
      profileForm = require('text!modules/user/templates/userProfilePage.html')
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
      'click input#signIn'	: 'signIn',
      'click input#signUp'    : 'signUp',
      'click input#register'  : 'register',
      'input input#UserEmail' : 'logInInputChanged',
      'input input#Password'  : 'logInInputChanged',
      'click input#profileSave'  : 'profileSave'
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
    },

    render: function(){
      var that = this;
      this.setTemplate();
      $("div.app").append( $(this.el).html( this.template() ) );

      if ( this.mode != 'profile' ){
        $('.logInSelector').dialog({
          modal: true,
          height: 380,
          width: 450,
          closeText: "&times;",
          close: function(){
            that.close();
          }
        });
      }

      if ( $('#captcha').length ){
//                        this.parentView.addCaptcha('captcha');
      }

//                    FB.XFBML.parse(document.getElementById('fb-login-btn'));

      this.stickit();
      return this;
    },

    setTemplate: function(){
      if ( this.mode == 'logIn' ){
        this.template = _.template(logInForm);
      }else if ( this.mode == 'register' ) {
        this.template = _.template(registerForm);
      }else if ( this.mode == 'profile' ){
        this.template = _.template(profileForm);
      }
    },


    fbLogIn: function(){
      this.model.fbLogIn();
    },

    signIn: function(){
      this.model.signIn();
      $('#spinner').hide();
    },

    signUp: function(){
      $('.logInSelector').dialog('destroy');
      this.mode = 'register';
      this.render();
    },

    profileSave: function(){
      this.model.profileSave();
      $('#spinner').hide();
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

    close: function(){
      $('.logInSelector').dialog('destroy');
      this.remove();
      this.unbind();
    }
  });

});

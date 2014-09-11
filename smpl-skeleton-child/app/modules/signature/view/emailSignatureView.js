define(
	function(require){
		'use strict';

		var $	= require('jquery'),
		_		= require('underscore'),
		Backbone= require('backbone'),
		emailForm			= require('text!modules/signature/templates/emailForm.html');

		return Backbone.View.extend({
			className: 'emailForm',


			initialize: function(){
				this.listenTo (this.model, 'sync',  this.close );
			},

			events:{
				'click input#vote-with-email'	: 'signWithEmail',	
			},

			render: function(){
				var that = this;
				this.template = _.template(emailForm);
				$('div.app').append( $(this.el).html( this.template() ) );
				$('.emailForm').dialog({
					modal: true,
					height: 150,
					width: 450,
					title: "Проголосувати через електронну пошту", 
					close: function(){
						that.close();
					}
				});

				return this;
			},

			signWithEmail: function(){
				var email = $('#email-address').val();
				this.model.set('Email', email);
				this.model.save();
			},	

			close: function(){
				$('.emailForm').dialog('destroy');
				this.remove();
				this.unbind();
				alert(this.model.get('Message'));
			},
		
		});
	


});

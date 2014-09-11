define(
		function(require){
			'use strict';

			var $	= require ('jquery'),
			jqueryui= require ('jqueryui'),
			_		= require ('underscore'),
			Backbone= require ('backbone'),
			signatureSelector	= require('text!modules/signature/templates/signatureSelector.html'),
			emailForm			= require('text!modules/signature/templates/emailForm.html')
			;

			return Backbone.View.extend ({
				className: 'signatureSelector',

				initialize: function(){
					this.listenTo (this.model, 'sync',  this.close );
				},

				events: {
					'click input#certificate'		: 'selectCertificate',
					'click input#e-mail'			: 'selectEmail', 
					'click input#vote-with-email'	: 'signWithEmail',	
				},

				signatureSelector: function(){
					var that = this;
					this.template =  _.template(signatureSelector);
					$("div.app").append( $(this.el).html( this.template() ) );
					$('.signatureSelector').dialog({
						modal: true,
						height: 150,
						width: 450,
						title:"Вибрати спосіб голосування",
						close: function(){
							that.clearDialog(this.id);
						}
					});

					return this;
				},

				selectCertificate: function(){
console.log('select certificate');					
				},
				   
				selectEmail: function(){
					var that = this;
					this.clearDialog();
					this.template = _.template(emailForm);
					$('div.app').append( $(this.el).html( this.template() ) );
					$('.signatureSelector').dialog({
						modal: true,
						height: 150,
						width: 450,
						title: "Проголосувати через електронну пошту", 
						close: function(){
							that.clearDialog(id);
						}
					});

					return this;
				},	

				signWithEmail: function(){
					var email = $('#email-address').val();
					this.model.set('Email', email);
					this.model.save();
				},	

				clearDialog: function(id){
					$('.signatureSelector').dialog('destroy');
					$('#'+id).remove();
				},

				close: function(){
					$('.signatureSelector').dialog('destroy');
					this.remove();
				},

			
			});
		
		});

define(
		function(require){
			'use strict';

			var $	= require ('jquery'),
			jqueryui= require ('jqueryui'),
			_		= require ('underscore'),
			Backbone= require ('backbone'),
			emailSignatorModel	= require('module/signature/model/emailSignatorModel'),
			emailSignatureModel	= require('module/signature/model/emailSignatureModel'),
			emailSignatureView	= require('module/signature/view/emailSignatureView'),
			signatureSelector	= require('text!modules/signature/templates/signatureSelector.html')
			;

			return Backbone.View.extend ({
				className: 'signatureSelector',

				initialize: function(data){
					this.petitionID = data.petitionID;
				},

				events: {
					'click input#certificate'		: 'selectCertificate',
					'click input#e-mail'			: 'selectEmail', 
				},

				render: function(){
					var that = this;
					this.template =  _.template(signatureSelector);
					$("div.app").append( $(this.el).html( this.template() ) );
					$('.signatureSelector').dialog({
						modal: true,
						height: 150,
						width: 450,
						title:"Вибрати спосіб голосування",
						closeText: "&times;",
						close: function(){
							that.close();
						}
					});

					return this;
				},

				selectCertificate: function(){
console.log('select certificate');					
				},
				   
				selectEmail: function(){
					var emailSignator	= new emailSignatorModel();
					var signatureModel	= new emailSignatureModel({'ID': this.petitionID, 'Signer' : emailSignator});
					var signatureView	= new emailSignatureView({model: signatureModel});
					this.close();
					signatureView.render();
				},	

				close: function(){
					$('.signatureSelector').dialog('destroy');
					this.remove();
					this.unbind();
				},

			
			});
		
		});

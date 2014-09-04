define(
	function(require){
		'use strict';

		var $	= require ('jquery'),
		_		= require ('underscore'),
		jqueryui	= require ('jqueryui'),
		Backbone	= require ('backbone'),
		keySelector	= require('text!module/signature/templates/keySelector.html');
//		certDpa		= require ('dpa'),
//		certUaCrypt	= require ('uacrypto');

		return Backbone.View.extend ({
			initialize: function(){
console.log('keySelector View');
				this.template = _.template(keySelector);
				this.render();
			},

			events:{
				"click #dialogBox-keyType>li>a" : "selectCertificate",
			},

			render: function(){
console.log("Render key Selector View");
				var dialog = this.template();
				var that = this;

				$(dialog).dialog({
					modal	:	true,
					height	:	80,
					title	:	'Виберіть тип сертифікату',
					autoopen:	true,
					resizable	: false,
					buttons	:{
						"ДПА"		: that.signDPA,
						"UACrypt"	: that.signUACrypt,
					}				
				
				});
				
				this.el = $(".dialogFrom");
				this.delegateEvents(this.events);

				return this;
			},



			signDPA: function(){
				window.cert = new certDpa();
				window.cert.InitializeDPA(
					signButton,
					function () {
						return $('#agreement-text').html();
					},
					function () {
						cert.SignDpa();
					}
				);

			},


			signUACrypt: function(){
				window.cert = new certUaCrypt();
				window.cert.InitializeCrypto(
					signButton,
					function() {
						return $('#agreement-text').html();
					},
					function() {
						cert.SignUaCrypto();
					});
			},

		
		
		});





});

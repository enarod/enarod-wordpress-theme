'use strict'

require.config ({
	baseUrl: '/wp-content/themes/smpl-skeleton-child/app',
//	baseUrl: 'app/',
	
	paths:{
			module		: './modules',
			jquery		: 'libs/jquery-1.11.1',
			underscore	: 'libs/underscore',
			backbone	: 'libs/backbone',
			text		: 'libs/text',
			jqueryui	: 'libs/jquery-ui-1.11.0/jquery-ui',
			jqte		: 'libs/jqte/jquery-te-1.4.0',
			validation	: 'libs/backbone-validation-amd',
			stickit		: 'libs/backbone.stickit',
			
	}, 

	shim: {
			'backbone':{
				deps: ['underscore', 'jquery'],
				exports	:	'Backbone'
			},

			'underscore':{
				exports	:	'_'
			},
			
			'jqueryui':{
				deps: ['jquery'],
				exports:	'jqueryui'
			}
	}
});


require(['jquery', 'backbone', 'router', 'common/view/mainView', 'validation'], 

	function ( $, Backbone, Router, MainView ){
		
		// Add custom header to HTTP request
		var defaultBackboneSync = Backbone.sync;
		Backbone.sync = function ( method, model, options ){
			options.headers = {
				'api-version' : 2
			};
			defaultBackboneSync(method, model, options);
	    }

		// Validation config 
		Backbone.Validation.config({
			forceUpdate : true
		});

		var appView = new MainView();
		appView.render();

		var router = new Router({view : appView});
		Backbone.history.start();		
	}

);

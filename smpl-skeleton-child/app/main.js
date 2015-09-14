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
            validation  : 'libs/backbone-validation-amd',
            stickit     : 'libs/backbone.stickit',
			facebook	: '//connect.facebook.net/en_US/sdk',
            zeroClip    : 'libs/components/zeroclipboard/dist/ZeroClipboard.min',
            recaptcha   : 'https://www.google.com/recaptcha/api',
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
			},
			'facebook' : {
				exports: 'FB'
			},
            'recaptcha' : {
                exports: 'grecaptcha'
            }
	}
});


require(['jquery', 'backbone', 'router', 'common/view/mainView', 'validation', 'config' ], 

	function ( $, Backbone, Router, MainView ){
		var appView = new MainView();

        //Add custom header to HTTP request
        var defaultBackboneSync = Backbone.sync;
        Backbone.sync = function ( method, model, options ){
            options.headers = options.headers || {};
            _.extend(options.headers, { 'api-version' : 2 });

            if (appView.User){
                var token = appView.User.getToken();
                if ( token ){
                    _.extend(
                        options.headers, 
                        { 'Authorization' : appView.User.getToken() }
                    );
                }
            }
            defaultBackboneSync( method, model, options );
        };

        // Validation config
        Backbone.Validation.configure ({
            forceUpdate : true
        });


		var appView = new MainView();
		appView.render();

		var router = new Router({view : appView});
		Backbone.history.start();		
	}

);

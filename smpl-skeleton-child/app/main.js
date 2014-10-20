(function () {
    'use strict';

    require.config({
        defaultPath: './',
        paths: {
            jquery: 'libs/jquery-1.11.1',
            underscore: 'libs/underscore',
            backbone: 'libs/backbone',
            text: 'libs/text',
            jqueryui: 'libs/jquery-ui-1.11.0/jquery-ui',
            jqte: 'libs/jqte/jquery-te-1.4.0',
            module: 'modules',
            petition: 'modules/petition',
            agreement: 'modules/agreement'
        },

        shim: {
            'backbone': {
                deps: ['underscore', 'jquery'],
                exports: 'Backbone'
            },

            'underscore': {
                exports: '_'
            },

            'jqueryui': {
                deps: ['jquery'],
                exports: 'jqueryui'
            }
        }
    });


    require(['jquery', 'backbone', 'router', 'common/view/mainView'],
        function ($, Backbone, Router, MainView) {
            var appView = new MainView();
            appView.render();

            var router = new Router({view: appView});
            Backbone.history.start();
        }
    );
})();



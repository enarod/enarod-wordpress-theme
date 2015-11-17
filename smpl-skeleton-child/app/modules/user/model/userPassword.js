define( function(require){
    'use strict';

    var Backbone = require ('backbone');


    return Backbone.Model.extend({
        urlRoot: BASE_URL+"account/changePassword", 

        defaults: {
           NewPassword: '',
           ConfirmPassword: '',
           CurrentPassword: '',
        },

        validation: {
            NewPassword : [{
                required: true,
                msg: 'Необхідно вказати новий пароль'
            },
           {
                pattern: /((?=.*\d)(?=.*[a-z])(?=.*[A-Z)(?=.*[@#_\-$]).{8,100})/,
                msg: 'Пароль має складатись щонайменш з 8 символів і \
                включати одину цифру, одну велику літеру \
                та один спеціальний символ (-_#@$)'
           }],
           ConfirmPassword : [{
                required: true,
                msg: 'Повторіть введений пароль'
           },
           {
                equalTo: 'NewPassword',
                msg: 'Введені значення не співпадають'
           }],
           CurrentPassword : {
                required: true,
                msg: 'Введіть Ваш сучасний пароль'
           },
        },


    });

});

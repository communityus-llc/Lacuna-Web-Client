'use strict';

var Reflux                = require('reflux');
var StatefulMixinStore    = require('js/stores/mixins/stateful');

var CaptchaWindowActions  = require('js/actions/windows/captcha');

var server                = require('js/server');

var CaptchaRPCStore = Reflux.createStore({
    listenables : [
        CaptchaWindowActions
    ],

    mixins : [
        StatefulMixinStore
    ],

    getDefaultData : function() {
        return {
            guid : '',
            url  : ''
        };
    },

    onClear : function() {
        this.emit(this.getDefaultData());
    },

    onFetch : function() {
        server.call({
            module  : 'captcha',
            method  : 'fetch',
            params  : [],
            success : function(result) {
                this.emit(result);
            },
            scope : this
        });
    },

    onSolve : function(solution, success) {
        server.call({
            module : 'captcha',
            method : 'solve',
            params : [
                this.state.guid,
                solution
            ],
            success : function(result) {
                if (typeof success === 'function') {
                    success();
                }
            },
            error : function() {
                CaptchaWindowActions.refresh();
            },
            scope : this
        });
    },

    onRefresh : function() {
        CaptchaWindowActions.clear();
        CaptchaWindowActions.fetch();
    }
});

module.exports = CaptchaRPCStore;

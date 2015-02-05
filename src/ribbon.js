"use strict";

angular.module('ribbon', [])
    .provider('ribbon', function () {
        var tabs = [];

        var service = {
            activateContextualGroup: function (groupName, context) {
                var contextualTabs = tabs.filter(function (tab) {
                    if(tab.contextual && tab.contextual.group === groupName) {
                        tab.contextual.context = context;
                        return true;
                    }
                    return false;
                });

                return function () {
                    contextualTabs.forEach(function (tab) {
                        tab.contextual.context = null;
                    });
                };
            }
        };

        var sortTabs = function () {
            tabs.sort(function (t1, t2) {
                if (!t1.hasOwnProperty('order')) {
                    if (!t2.hasOwnProperty('order')) {
                        return 0;
                    }
                    return (t2.order === 'last') ? -1 : 1;
                }

                if (t1.order === 'last') {
                    return (t2.order === 'last') ? -1 : 1;
                }

                return (t2.order === 'last') ? -1 :  t1.order - t2.order;
            });
        };

        return {
            register: function (tab) {
                tabs.push(tab);
                return this;
            },
            $get: function () {
                sortTabs();

                return service;
            }
        };
    })
;

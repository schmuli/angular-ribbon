angular.module('ngRibbon', [])
    .directive('ngRibbon', function () {
        function RibbonController(ribbonTabs) {
            this.ribbonTabs = ribbonTabs;
        }

        Object.defineProperties(RibbonController.prototype, {
            'hasBackstage': {
                get: function () {
                    return !!this.ribbonTabs.backstage;
                }
            },
            'backstage': {
                get: function () {
                    return this.ribbonTabs.backstage;
                }
            },
            tabs: {
                get: function () {
                    return this.ribbonTabs.tabs;
                }
            }
        });

        return {
            scope: {
                title: '='
            },
            transclude: true,
            templateUrl: 'ribbon.html',
            controller: ['ribbonTabs', RibbonController],
            controllerAs: 'ribbon',
            bindToController: true
        };
    })
    .directive('ngRibbonBackstage', function (ribbonTabs) {
        return {
            scope: {
                title: '='
            },
            link: function (scope, element, attrs) {
                ribbonTabs.setBackstage(scope.title);
            }
        };
    })
    .directive('ngRibbonTab', function () {
        return {

        };
    })
    .directive('ngRibbonGroup', function () {
        return {

        };
    })
    .factory('ribbonTabs', function () {
        return {
            backstage: undefined,
            tabs: [],
            setBackstage: function (title) {
                this.backstage = {
                    title: title
                };
            }
        };
    });

angular.module('ngRibbon.actions', []);

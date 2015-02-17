var ngRibbonTabDirective = function () {
    return {
        scope: {
            title: '=',
            contextual: '@?'
        },
        template: '<div class="tab" ng-transclude ng-show="tab.active"></div>',
        transclude: true,
        replace: true,
        require: ['^ngRibbon', 'ngRibbonTab'],
        controller: function () {
        },
        link: {
            pre: function (scope, element, attrs, ctrls) {
                var tabController = ctrls[1];
                tabController.title = scope.title;
            },
            post: function (scope, element, attrs, ctrls) {
                var ribbonController = ctrls[0];

                if (attrs.dynamic === 'true') {
                    ribbonController.addDynamicTab(scope.title, scope.contextual, function (tab) {
                        scope.tab = tab;
                    })
                } else {
                    scope.tab = ribbonController.addTab(scope.title, scope.contextual);
                }
            }
        }
    };
};

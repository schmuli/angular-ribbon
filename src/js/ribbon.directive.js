export var ngRibbonDirective = function ($templateCache, clickHandler, dynamicRibbon) {
    return {
        scope: {
            title: '=',
            ribbonContext: '=context'
        },
        transclude: true,
        templateUrl: 'ngRibbon/templates/ribbon-template.html',
        controller: 'RibbonController',
        controllerAs: 'ribbon',
        bindToController: true,
        compile: function (element) {
            var tabContents = angular.element(element[0].querySelector('.tab-content'));

            dynamicRibbon.tabs.forEach(function (tab) {
                var template = angular.element($templateCache.get(tab));
                template.attr('data-dynamic', true);
                tabContents.prepend(template);
            });

            return function link(scope, element, attrs, ctrl, transclude) {
                transclude(function (clone) {
                    tabContents.prepend(clone);
                });
                ctrl.addDynamicTabs();
            };
        }
    };
};

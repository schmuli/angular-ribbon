export var ngRibbonBackstageDirective = function () {
    return {
        scope: {
            title: '='
        },
        require: ['^ngRibbon', 'ngRibbonBackstage'],
        transclude: true,
        template: '<div></div>',
        controller: 'BackstageController',
        controllerAs: 'backstage',
        bindToController: true,
        link: function (scope, element, attrs, controllers, transcludeFn) {
            var backstageController = controllers[1];
            backstageController.content = transcludeFn;

            var ribbonController = controllers[0];
            ribbonController.backstage = backstageController;
        }
    };
};

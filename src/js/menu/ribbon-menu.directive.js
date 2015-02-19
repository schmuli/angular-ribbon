export var ribbonMenuDirective = function () {
    return {
        scope: true,
        templateUrl: 'ribbon/templates/ribbon-menu-template.html',
        transclude: true,
        controller: 'RibbonMenuController',
        controllerAs: 'menu',
        bindToController: true
    };
};

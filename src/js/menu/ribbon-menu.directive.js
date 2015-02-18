export var ngRibbonMenuDirective = function () {
    return {
        scope: true,
        templateUrl: 'ngRibbon/templates/ribbon-menu-template.html',
        transclude: true,
        controller: 'RibbonMenuController',
        controllerAs: 'menu',
        bindToController: true
    };
};

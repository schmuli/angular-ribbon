var ngRibbonMenuDirective = function () {
    return {
        scope: true,
        templateUrl: 'ribbon-menu.html',
        transclude: true,
        controller: 'RibbonMenuController',
        controllerAs: 'menu',
        bindToController: true
    };
};

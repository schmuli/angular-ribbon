export var ngRibbonMenuSeparatorDirective = function () {
    return {
        require: '^ngRibbonMenu',
        link: function (scope, element, attrs, ribbonMenuController) {
            ribbonMenuController.addSeparator();
        }
    };
};

export var ribbonMenuSeparatorDirective = function () {
    return {
        require: '^ribbonMenu',
        link: function (scope, element, attrs, ribbonMenuController) {
            ribbonMenuController.addSeparator();
        }
    };
};

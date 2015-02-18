export var ngRibbonBackstageContentDirective = function () {
    return {
        require: '^ngRibbon',
        link: function (scope, element, attrs, ribbonController) {
            var backstageController = ribbonController.backstage;
            backstageController.content(function (clone) {
                element.empty();
                element.append(clone);
            });
        }
    };
};

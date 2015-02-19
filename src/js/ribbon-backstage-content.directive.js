export var ribbonBackstageContentDirective = function () {
    return {
        require: '^ribbon',
        link: function (scope, element, attrs, ribbonController) {
            var backstageController = ribbonController.backstage;
            backstageController.content(function (clone) {
                element.empty();
                element.append(clone);
            });
        }
    };
};

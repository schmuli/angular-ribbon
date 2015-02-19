export var splitButtonDirective = function () {
    return {
        scope: {
            command: '@',
            popup: '@'
        },
        controller: 'PopupButtonController',
        controllerAs: 'button',
        require: ['^ribbon', 'splitButton'],
        templateUrl: 'ribbon/templates/ribbon-split-button-template.html',
        transclude: true,
        replace: true,
        link: function (scope, element, attrs, ctrls) {
            var ribbonController = ctrls[0];
            var command = ribbonController.getCommand(scope.command);
            if (command) {
                var splitButtonController = ctrls[1];
                splitButtonController.setCommand(command, scope.popup);
            }
        }
    };
};

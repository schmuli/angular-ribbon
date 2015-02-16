var ngDropButtonDirective = function () {
    return {
        scope: {
            command: '@',
            popup: '@'
        },
        require: ['^ngRibbon', 'ngDropButton'],
        templateUrl: 'ribbon-drop-button.html',
        transclude: true,
        replace: true,
        controller: 'PopupButtonController',
        controllerAs: 'button',
        link: function (scope, element, attrs, controllers) {
            var ribbonController = controllers[0];
            var command = ribbonController.getCommand(scope.command);
            if (command) {
                var dropButtonController = controllers[1];
                dropButtonController.setCommand(command, scope.popup);
            }
        }
    }
};

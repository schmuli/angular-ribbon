var ngSplitButtonDirective = function () {
    return {
        scope: {
            command: '@',
            popup: '@'
        },
        controller: 'PopupButtonController',
        controllerAs: 'button',
        require: ['^ngRibbon', 'ngSplitButton'],
        templateUrl: 'ribbon-split-button.html',
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
    }
};
